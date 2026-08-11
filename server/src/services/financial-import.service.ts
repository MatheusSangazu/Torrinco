import { prisma } from '../lib/prisma.js';
import { parseDate, startOfDay } from '../lib/date-utils.js';
import { ImportFileError, itemFingerprint, parseFinancialDocument, type ParsedImportItem } from './financial-import-parser.service.js';

export class FinancialImportError extends Error {
  constructor(public code: string, message: string, public statusCode = 400) { super(message); }
}

type Scope = { accountId: number; userId: number };
type UploadInput = Scope & { buffer: Buffer; fileName: string; mimeType: string; fileSize: number; allowReimport?: boolean };
type BulkItemInput = { item_ids: number[]; changes: { category_id?: number | null; entity_id?: number | null; included?: boolean; transaction_status?: 'paid' | 'pending' } };
type ListInput = { cursor?: number; limit: number; search?: string; status?: string; from?: string; to?: string };

function money(value: unknown): number { return Math.round(Number(value || 0) * 100) / 100; }
function dayBounds(date: Date) { const from = new Date(date); from.setUTCHours(0, 0, 0, 0); const to = new Date(from); to.setUTCDate(to.getUTCDate() + 1); return { from, to }; }

function reconciliation(items: Array<any>, documentTotal?: unknown) {
  const selected = items.filter(i => i.included);
  const expenses = selected.filter(i => i.type === 'expense').reduce((sum, i) => sum + money(i.amount), 0);
  const incomes = selected.filter(i => i.type === 'income').reduce((sum, i) => sum + money(i.amount), 0);
  const net = money(expenses - incomes);
  const total = documentTotal == null ? null : money(documentTotal);
  return {
    found: items.length, selected: selected.length, ignored: items.length - selected.length,
    duplicates: items.filter(i => i.duplicate_kind).length,
    feesAndInterest: money(selected.filter(i => ['fee', 'interest', 'fine'].includes(i.item_kind)).reduce((s, i) => s + money(i.amount), 0)),
    expenseTotal: money(expenses), incomeTotal: money(incomes), selectedTotal: net,
    documentTotal: total, difference: total == null ? null : money(net - total)
  };
}

const duplicateLabels: Record<string, string> = {
  within_document: 'Repetido neste arquivo.',
  existing_transaction: 'Já existe no Torrinco.',
  previous_import: 'Importado anteriormente.',
};
function encodedDuplicateEvidence(kind: string, evidence: Record<string, unknown>) {
  const compact = { kind, ...evidence, description: String(evidence.description ?? '').slice(0, 48) };
  const encoded = JSON.stringify(compact);
  if (encoded.length <= 255) return encoded;
  return JSON.stringify({ ...compact, description: String(evidence.description ?? '').slice(0, 12) });
}
function presentBatch(batch: any) {
  return {
    ...batch,
    items: batch.items.map((item: any) => {
      if (!item.duplicate_kind || !item.duplicate_reason?.startsWith('{')) return item;
      try { return { ...item, duplicate_reason: duplicateLabels[item.duplicate_kind] ?? 'Possível duplicidade.', duplicate_evidence: JSON.parse(item.duplicate_reason) }; }
      catch { return item; }
    }),
    reconciliation: reconciliation(batch.items, batch.document_total),
  };
}

async function audit(scope: Scope, eventType: string, targetId: number, outcome: 'success' | 'failure', metadata?: Record<string, unknown>, tx: any = prisma) {
  await tx.privacy_audit_events.create({ data: { user_id: scope.userId, account_id: scope.accountId, event_type: eventType, target_type: 'financial_import', target_id: String(targetId), outcome, metadata } });
}

async function assertEntity(tx: any, id: number | null | undefined, accountId: number) {
  if (id == null) return null;
  const entity = await tx.financial_entities.findFirst({ where: { id, account_id: accountId } });
  if (!entity) throw new FinancialImportError('INVALID_ENTITY', 'A conta ou o cartão selecionado não pertence a esta conta.', 403);
  return entity;
}
async function assertCategory(tx: any, id: number | null | undefined, accountId: number) {
  if (id == null) return null;
  const category = await tx.categories.findFirst({ where: { id, account_id: accountId } });
  if (!category) throw new FinancialImportError('INVALID_CATEGORY', 'A categoria selecionada não pertence a esta conta.', 403);
  return category;
}

function markWithinDocumentDuplicates(items: ParsedImportItem[]) {
  const seen = new Set<string>();
  return items.map(item => {
    const fingerprint = itemFingerprint(item.date, item.amount, item.description, item.type);
    let duplicateKind: string | undefined; let duplicateReason: string | undefined;
    if (seen.has(fingerprint)) { duplicateKind = 'within_document'; duplicateReason = 'Lançamento repetido dentro deste documento.'; }
    seen.add(fingerprint);
    return { item, fingerprint, duplicateKind, duplicateReason, included: duplicateKind ? false : item.included };
  });
}

const detailInclude = { items: { orderBy: { row_index: 'asc' as const }, include: { categories: { select: { id: true, name: true } }, financial_entities: { select: { id: true, name: true, type: true } } } }, target_entity: { select: { id: true, name: true, type: true } } };

export class FinancialImportService {
  static async upload(input: UploadInput) {
    const { parsed, hash } = await parseFinancialDocument(input.buffer, input.fileName, input.mimeType);
    const activeDraft = await prisma.financial_imports.findFirst({
      where: {
        account_id: input.accountId,
        user_id: input.userId,
        file_hash: hash,
        status: { in: ['uploaded', 'processing', 'review'] },
      },
      orderBy: { created_at: 'asc' },
      select: { id: true },
    });
    if (activeDraft) {
      await audit(input, 'financial_import.upload_reused', activeDraft.id, 'success', { fileHash: hash });
      return { ...await this.get(input, activeDraft.id), resumed: true };
    }
    const prior = await prisma.financial_imports.findFirst({
      where: { account_id: input.accountId, user_id: input.userId, file_hash: hash, status: { in: ['completed', 'completed_with_warnings'] } },
      orderBy: { completed_at: 'desc' },
      select: { id: true, completed_at: true, target_entity: { select: { id: true, name: true, type: true } } },
    });
    if (prior && !input.allowReimport) {
      return { reimport_blocked: true, previous_import: prior };
    }
    const candidates = markWithinDocumentDuplicates(parsed.items);
    const created = await prisma.$transaction(async tx => {
      const batch = await tx.financial_imports.create({ data: {
        account_id: input.accountId, user_id: input.userId, file_name: input.fileName.slice(0, 255), file_hash: hash,
        mime_type: input.mimeType, file_size: input.fileSize, document_type: parsed.documentType, status: 'processing', issuer: parsed.issuer,
        card_last_four: parsed.cardLastFour, holder_name: parsed.holderName, due_date: parsed.dueDate, closing_date: parsed.closingDate,
        document_total: parsed.documentTotal
      } });
      await tx.financial_import_items.createMany({ data: candidates.map(({ item, fingerprint, duplicateKind, duplicateReason, included }) => ({
        import_id: batch.id, row_index: item.rowIndex, included, transaction_date: item.date, original_description: item.originalDescription.slice(0, 500),
        description: item.description.slice(0, 255), original_excerpt: item.excerpt?.slice(0, 1000), amount: item.amount, type: item.type,
        item_kind: item.kind, confidence: item.confidence, requires_review: item.requiresReview, duplicate_kind: duplicateKind,
        duplicate_reason: duplicateReason, exclusion_reason: duplicateKind ? 'automatic_duplicate' : item.exclusionReason, fingerprint
      })) });
      const totals = reconciliation(candidates.map(c => ({ ...c.item, item_kind: c.item.kind, included: c.included, duplicate_kind: c.duplicateKind })), parsed.documentTotal);
      await tx.financial_imports.update({ where: { id: batch.id }, data: { status: 'review', selected_expense_total: totals.expenseTotal, selected_income_total: totals.incomeTotal, selected_total: totals.selectedTotal, reconciliation_difference: totals.difference } });
      await audit(input, 'financial_import.uploaded', batch.id, 'success', { fileHash: hash, itemCount: totals.found, duplicateFile: Boolean(prior) }, tx);
      const detail = await tx.financial_imports.findUnique({ where: { id: batch.id }, include: detailInclude });
      if (!detail) throw new FinancialImportError('IMPORT_NOT_FOUND', 'ImportaÃ§Ã£o nÃ£o encontrada.', 500);
      return { ...detail, reconciliation: reconciliation(detail.items, detail.document_total) };
    });
    return created;
  }

  static async list(scope: Scope, input: ListInput = { limit: 20 }) {
    const where: any = { account_id: scope.accountId, user_id: scope.userId };
    if (input.cursor) where.id = { lt: input.cursor };
    if (input.status) where.status = input.status;
    if (input.search) where.OR = [{ file_name: { contains: input.search } }, { target_entity: { is: { name: { contains: input.search } } } }];
    if (input.from || input.to) {
      where.created_at = {};
      if (input.from) where.created_at.gte = startOfDay(parseDate(input.from));
      if (input.to) { const end = startOfDay(parseDate(input.to)); end.setUTCDate(end.getUTCDate() + 1); where.created_at.lt = end; }
    }
    const rows = await prisma.financial_imports.findMany({ where, orderBy: { id: 'desc' }, take: input.limit + 1, include: { target_entity: { select: { id: true, name: true, type: true } }, _count: { select: { items: true } } } });
    const hasMore = rows.length > input.limit;
    const imports = hasMore ? rows.slice(0, input.limit) : rows;
    return { imports, next_cursor: hasMore ? imports.at(-1)?.id ?? null : null, has_more: hasMore };
  }

  static async get(scope: Scope, id: number) {
    const batch = await prisma.financial_imports.findFirst({ where: { id, account_id: scope.accountId, user_id: scope.userId }, include: detailInclude });
    if (!batch) throw new FinancialImportError('IMPORT_NOT_FOUND', 'Importação não encontrada.', 404);
    return presentBatch(batch);
  }

  static async update(scope: Scope, id: number, input: { target_entity_id?: number | null; document_type?: any }) {
    const batch = await this.get(scope, id);
    if (!['review', 'uploaded'].includes(batch.status)) throw new FinancialImportError('IMPORT_LOCKED', 'Esta importação não pode mais ser alterada.', 409);
    await assertEntity(prisma, input.target_entity_id, scope.accountId);
    await prisma.$transaction(async tx => {
      if (input.target_entity_id !== undefined && batch.target_entity_id != null) {
        // Compatibilidade: versões antigas copiavam o destino principal para itens herdados.
        await tx.financial_import_items.updateMany({ where: { import_id: id, entity_id: batch.target_entity_id }, data: { entity_id: null } });
      }
      await tx.financial_imports.update({ where: { id }, data: { target_entity_id: input.target_entity_id, document_type: input.document_type } });
    });
    if (input.target_entity_id !== undefined) await this.recheckDestinationDuplicates(scope, id, input.target_entity_id);
    return this.recalculate(scope, id);
  }

  private static async recheckDestinationDuplicates(scope: Scope, importId: number, entityId?: number | null) {
    const batch = await prisma.financial_imports.findFirst({ where: { id: importId, account_id: scope.accountId, user_id: scope.userId }, include: { items: true } });
    if (!batch?.items.length) return;
    const targetEntityId = entityId === undefined ? batch.target_entity_id : entityId;
    const destinationIds = [...new Set(batch.items.map(i => i.entity_id ?? targetEntityId).filter((id): id is number => id != null))];
    const min = new Date(Math.min(...batch.items.map(i => i.transaction_date.getTime()))); const max = new Date(Math.max(...batch.items.map(i => i.transaction_date.getTime()))); max.setUTCDate(max.getUTCDate() + 1);
    const [transactions, previous] = await Promise.all([
      destinationIds.length ? prisma.transactions.findMany({ where: { account_id: scope.accountId, user_id: scope.userId, entity_id: { in: destinationIds }, deleted_at: null, transaction_date: { gte: min, lt: max } }, select: { id: true, entity_id: true, transaction_date: true, amount: true, description: true, type: true } }) : [],
      destinationIds.length ? prisma.financial_import_items.findMany({ where: { import_id: { not: importId }, fingerprint: { in: batch.items.map(i => i.fingerprint) }, financial_imports: { account_id: scope.accountId, user_id: scope.userId, status: { in: ['completed', 'completed_with_warnings'] } } }, select: { id: true, entity_id: true, fingerprint: true, transaction_date: true, amount: true, description: true, financial_imports: { select: { id: true, target_entity_id: true } } } }) : []
    ]);
    const seen = new Map<string, any>();
    await prisma.$transaction(batch.items.map(item => {
      let kind: string | null = null; let reason: string | null = null;
      const effectiveEntityId = item.entity_id ?? targetEntityId;
      const within = seen.get(item.fingerprint);
      const transaction = transactions.find(t => effectiveEntityId != null && t.entity_id === effectiveEntityId && itemFingerprint(t.transaction_date, Number(t.amount), t.description ?? '', t.type) === item.fingerprint);
      const imported = previous.find(p => effectiveEntityId != null && (p.entity_id ?? p.financial_imports.target_entity_id) === effectiveEntityId && p.fingerprint === item.fingerprint);
      if (within) { kind = 'within_document'; reason = encodedDuplicateEvidence(kind, { destination_id: effectiveEntityId, date: within.transaction_date, description: within.description, amount: Number(within.amount), source_item_id: within.id }); }
      else if (transaction) { kind = 'existing_transaction'; reason = encodedDuplicateEvidence(kind, { destination_id: effectiveEntityId, date: transaction.transaction_date, description: transaction.description, amount: Number(transaction.amount), transaction_id: transaction.id }); }
      else if (imported) { kind = 'previous_import'; reason = encodedDuplicateEvidence(kind, { destination_id: effectiveEntityId, date: imported.transaction_date, description: imported.description, amount: Number(imported.amount), import_id: imported.financial_imports.id, source_item_id: imported.id }); }
      seen.set(item.fingerprint, item);
      const newlyAutomatic = Boolean(kind && !item.duplicate_kind);
      const duplicateRemoved = Boolean(!kind && item.duplicate_kind);
      const included = newlyAutomatic ? false : duplicateRemoved && item.exclusion_reason === 'automatic_duplicate' ? true : item.included;
      const exclusionReason = newlyAutomatic ? 'automatic_duplicate' : duplicateRemoved && item.exclusion_reason === 'automatic_duplicate' ? null : item.exclusion_reason;
      return prisma.financial_import_items.update({ where: { id: item.id }, data: { duplicate_kind: kind, duplicate_reason: reason, included, exclusion_reason: exclusionReason } });
    }));
  }

  static async updateItem(scope: Scope, importId: number, itemId: number, input: any) {
    const batch = await this.get(scope, importId);
    if (batch.status !== 'review') throw new FinancialImportError('IMPORT_LOCKED', 'Esta importação não pode mais ser alterada.', 409);
    const current = batch.items.find((i: any) => i.id === itemId);
    if (!current) throw new FinancialImportError('ITEM_NOT_FOUND', 'Lançamento não encontrado.', 404);
    await assertEntity(prisma, input.entity_id, scope.accountId); await assertCategory(prisma, input.category_id, scope.accountId);
    const date = input.transaction_date ? parseDate(input.transaction_date) : current.transaction_date;
    const amount = input.amount ?? Number(current.amount); const description = input.description ?? current.description; const type = input.type ?? current.type;
    const duplicateFieldsChanged = ['transaction_date', 'amount', 'description', 'type', 'entity_id'].some(field => input[field] !== undefined);
    await prisma.financial_import_items.update({ where: { id: itemId }, data: {
      included: input.included, transaction_date: input.transaction_date ? date : undefined, description: input.description?.slice(0, 255), amount: input.amount,
      type: input.type, category_id: input.category_id, entity_id: input.entity_id, payment_method: input.payment_method,
      transaction_status: input.transaction_status, edited_by_user_id: scope.userId, requires_review: input.requires_review,
      exclusion_reason: input.included === false ? 'manual' : input.included === true && current.exclusion_reason === 'manual' ? null : undefined,
      fingerprint: itemFingerprint(date, Number(amount), description, type),
      duplicate_kind: duplicateFieldsChanged ? null : undefined, duplicate_reason: duplicateFieldsChanged ? null : undefined,
    } });
    if (duplicateFieldsChanged) await this.recheckDestinationDuplicates(scope, importId);
    return this.recalculate(scope, importId);
  }

  static async updateItemsBulk(scope: Scope, importId: number, input: BulkItemInput) {
    const result = await prisma.$transaction(async tx => {
      const batch = await tx.financial_imports.findFirst({ where: { id: importId, account_id: scope.accountId, user_id: scope.userId }, select: { id: true, status: true } });
      if (!batch) throw new FinancialImportError('IMPORT_NOT_FOUND', 'Importação não encontrada.', 404);
      if (batch.status !== 'review') throw new FinancialImportError('IMPORT_LOCKED', 'Esta importação não pode mais ser alterada.', 409);
      const items = await tx.financial_import_items.findMany({ where: { import_id: importId, id: { in: input.item_ids } }, select: { id: true } });
      if (items.length !== input.item_ids.length) throw new FinancialImportError('ITEM_NOT_FOUND', 'Um ou mais lançamentos não pertencem a esta importação.', 404);

      await assertEntity(tx, input.changes.entity_id, scope.accountId);
      await assertCategory(tx, input.changes.category_id, scope.accountId);
      await tx.financial_import_items.updateMany({ where: { import_id: importId, id: { in: input.item_ids } }, data: { ...input.changes, exclusion_reason: input.changes.included === false ? 'manual' : input.changes.included === true ? null : undefined, edited_by_user_id: scope.userId } });

      const updated = await tx.financial_imports.findFirst({ where: { id: importId, account_id: scope.accountId, user_id: scope.userId }, include: detailInclude });
      if (!updated) throw new FinancialImportError('IMPORT_NOT_FOUND', 'Importação não encontrada.', 404);
      const totals = reconciliation(updated.items, updated.document_total);
      await tx.financial_imports.update({ where: { id: importId }, data: { selected_expense_total: totals.expenseTotal, selected_income_total: totals.incomeTotal, selected_total: totals.selectedTotal, reconciliation_difference: totals.difference } });
      await audit(scope, 'financial_import.items_bulk_updated', importId, 'success', { itemCount: input.item_ids.length, fields: Object.keys(input.changes) }, tx);
      return { ...updated, selected_expense_total: totals.expenseTotal, selected_income_total: totals.incomeTotal, selected_total: totals.selectedTotal, reconciliation_difference: totals.difference, reconciliation: totals };
    });
    if (input.changes.entity_id !== undefined) {
      await this.recheckDestinationDuplicates(scope, importId);
      return this.recalculate(scope, importId);
    }
    return result;
  }

  static async addItem(scope: Scope, importId: number, input: any) {
    const batch = await this.get(scope, importId); if (batch.status !== 'review') throw new FinancialImportError('IMPORT_LOCKED', 'Esta importação não pode mais ser alterada.', 409);
    await assertEntity(prisma, input.entity_id, scope.accountId); await assertCategory(prisma, input.category_id, scope.accountId);
    const max = Math.max(0, ...batch.items.map((i: any) => i.row_index)); const date = parseDate(input.transaction_date);
    await prisma.financial_import_items.create({ data: { import_id: importId, edited_by_user_id: scope.userId, row_index: max + 1, included: true, transaction_date: date, original_description: input.description, description: input.description, amount: input.amount, type: input.type, category_id: input.category_id, entity_id: input.entity_id ?? null, payment_method: input.payment_method, item_kind: 'unknown', confidence: 1, requires_review: false, fingerprint: itemFingerprint(date, input.amount, input.description, input.type) } });
    await this.recheckDestinationDuplicates(scope, importId);
    return this.recalculate(scope, importId);
  }

  static async recalculate(scope: Scope, id: number) {
    const batch = await this.get(scope, id); const totals = batch.reconciliation;
    await prisma.financial_imports.update({ where: { id }, data: { selected_expense_total: totals.expenseTotal, selected_income_total: totals.incomeTotal, selected_total: totals.selectedTotal, reconciliation_difference: totals.difference } });
    return this.get(scope, id);
  }

  static async confirm(scope: Scope, id: number, input: { allow_difference?: boolean; allow_duplicates?: boolean; difference_reason?: string }) {
    try {
      return await prisma.$transaction(async tx => {
        const batch = await tx.financial_imports.findFirst({ where: { id, account_id: scope.accountId, user_id: scope.userId }, include: { items: true } });
        if (!batch) throw new FinancialImportError('IMPORT_NOT_FOUND', 'Importação não encontrada.', 404);
        if (['completed', 'completed_with_warnings'].includes(batch.status)) return { id: batch.id, status: batch.status, importedCount: batch.items.filter(i => i.imported_transaction_id).length, idempotent: true };
        if (batch.status !== 'review') throw new FinancialImportError('IMPORT_LOCKED', 'A importação já está sendo processada ou foi encerrada.', 409);
        const claimed = await tx.financial_imports.updateMany({ where: { id, account_id: scope.accountId, user_id: scope.userId, status: 'review' }, data: { status: 'importing', confirmed_at: new Date() } });
        if (claimed.count !== 1) throw new FinancialImportError('IMPORT_LOCKED', 'A importação já está sendo processada.', 409);
        const totals = reconciliation(batch.items, batch.document_total);
        if (!totals.selected) throw new FinancialImportError('NO_SELECTED_ITEMS', 'Selecione ao menos um lançamento para importar.');
        if (totals.difference != null && Math.abs(totals.difference) >= 0.01 && (!input.allow_difference || !input.difference_reason?.trim())) throw new FinancialImportError('RECONCILIATION_CONFIRMATION_REQUIRED', `A soma dos lançamentos selecionados não corresponde ao total identificado no documento. Diferença: R$ ${Math.abs(totals.difference).toFixed(2).replace('.', ',')}. Informe um motivo para continuar.`);
        const selected = batch.items.filter(i => i.included);
        if (selected.some(i => i.duplicate_kind) && !input.allow_duplicates) throw new FinancialImportError('DUPLICATE_CONFIRMATION_REQUIRED', 'Há possíveis duplicidades selecionadas. Confirme explicitamente para importá-las.');
        for (const item of selected) {
          if (item.entity_id == null && batch.target_entity_id == null) throw new FinancialImportError('TARGET_REQUIRED', 'Selecione a conta ou o cartão que receberá os lançamentos.');
          await assertEntity(tx, item.entity_id ?? batch.target_entity_id, scope.accountId); await assertCategory(tx, item.category_id, scope.accountId);
        }
        await tx.financial_imports.update({ where: { id }, data: { difference_reason: input.difference_reason?.trim() } });
        for (const item of selected) {
          const transaction = await tx.transactions.create({ data: { account_id: scope.accountId, user_id: scope.userId, entity_id: item.entity_id ?? batch.target_entity_id, category_id: item.category_id, category: null, amount: item.amount, type: item.type, status: item.transaction_status, description: item.description, transaction_date: item.transaction_date, payment_method: item.payment_method ?? 'other', is_recurring: false } });
          await tx.financial_import_items.update({ where: { id: item.id }, data: { imported_transaction_id: transaction.id } });
        }
        const warnings = selected.some(i => i.duplicate_kind || i.requires_review) || (totals.difference != null && Math.abs(totals.difference) >= 0.01);
        const status = warnings ? 'completed_with_warnings' : 'completed';
        await tx.financial_imports.update({ where: { id }, data: { status, completed_at: new Date() } });
        await audit(scope, 'financial_import.confirmed', id, 'success', { importedCount: selected.length, ignoredCount: totals.ignored, duplicatesIncluded: selected.filter(i => i.duplicate_kind).length, difference: totals.difference, differenceReason: input.difference_reason }, tx);
        return { id, status, importedCount: selected.length, idempotent: false };
      });
    } catch (error) {
      if (!(error instanceof FinancialImportError)) await audit(scope, 'financial_import.confirmed', id, 'failure', { reason: 'unexpected_failure' }).catch(() => undefined);
      throw error;
    }
  }

  static async cancel(scope: Scope, id: number) {
    const result = await prisma.financial_imports.updateMany({ where: { id, account_id: scope.accountId, user_id: scope.userId, status: { in: ['uploaded', 'processing', 'review'] } }, data: { status: 'cancelled', cancelled_at: new Date() } });
    if (!result.count) throw new FinancialImportError('IMPORT_LOCKED', 'Esta importação não pode ser cancelada.', 409);
    await audit(scope, 'financial_import.cancelled', id, 'success'); return { id, status: 'cancelled' };
  }
}

export { ImportFileError };
