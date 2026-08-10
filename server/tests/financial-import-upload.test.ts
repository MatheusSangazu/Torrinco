import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  financial_imports: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn(), create: vi.fn() },
  financial_import_items: { findMany: vi.fn(), createMany: vi.fn() },
  transactions: { findMany: vi.fn(), create: vi.fn() },
  privacy_audit_events: { create: vi.fn() },
  $transaction: vi.fn(),
}));
vi.mock('../src/lib/prisma.js', () => ({ prisma: db }));
import { FinancialImportService } from '../src/services/financial-import.service.js';

const scope = { accountId: 11, userId: 7 };
const input = {
  ...scope,
  buffer: Buffer.from('date,title,amount\n2026-08-08,Loja de teste,"97,00"'),
  fileName: 'Nubank.csv', mimeType: 'text/csv', fileSize: 54,
};
const item = { id: 1, import_id: 4, row_index: 1, included: true, transaction_date: new Date('2026-08-08T00:00:00Z'), original_description: 'Loja de teste', description: 'Loja de teste', amount: 97, type: 'expense', item_kind: 'purchase', duplicate_kind: null };

describe('upload idempotente de rascunhos', () => {
  beforeEach(() => {
    Object.values(db).forEach(group => { if (typeof group === 'object') Object.values(group).forEach(fn => (fn as any).mockReset?.()); });
    db.$transaction.mockImplementation((fn: any) => fn(db));
    db.financial_import_items.findMany.mockResolvedValue([]);
    db.transactions.findMany.mockResolvedValue([]);
    db.privacy_audit_events.create.mockResolvedValue({});
    db.financial_imports.update.mockResolvedValue({});
  });

  it('reutiliza o rascunho ativo do mesmo arquivo sem criar outro lote', async () => {
    db.financial_imports.findFirst.mockResolvedValueOnce({ id: 3 }).mockResolvedValueOnce({ id: 3, account_id: 11, user_id: 7, status: 'review', document_total: null, items: [item] });
    const result = await FinancialImportService.upload(input);
    expect(result.id).toBe(3);
    expect(db.financial_imports.create).not.toHaveBeenCalled();
    expect(db.transactions.create).not.toHaveBeenCalled();
  });

  it('monta a resposta do novo lote dentro da mesma transacao', async () => {
    db.financial_imports.findFirst.mockResolvedValue(null);
    db.financial_imports.create.mockResolvedValue({ id: 4 });
    db.financial_import_items.createMany.mockResolvedValue({ count: 1 });
    db.financial_imports.findUnique.mockResolvedValue({ id: 4, account_id: 11, user_id: 7, status: 'review', document_total: null, items: [item] });
    const result = await FinancialImportService.upload(input);
    expect(result).toMatchObject({ id: 4, reconciliation: { found: 1 } });
    expect(db.financial_imports.findUnique).toHaveBeenCalled();
    expect(db.transactions.create).not.toHaveBeenCalled();
  });
});

