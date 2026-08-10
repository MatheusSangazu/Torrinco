import { createHash } from 'node:crypto';
import * as XLSX from 'xlsx';
import { extractPdfText } from './agent/pdf.service.js';

export const IMPORT_MAX_FILE_BYTES = Number(process.env.IMPORT_MAX_FILE_BYTES || 10 * 1024 * 1024);
export const IMPORT_MAX_EXTRACTED_CHARS = Number(process.env.IMPORT_MAX_EXTRACTED_CHARS || 250_000);

export class ImportFileError extends Error {
  constructor(public code: string, message: string, public statusCode = 400, public details?: Record<string, unknown>) { super(message); }
}

export type ParsedImportItem = {
  rowIndex: number; date: Date; originalDescription: string; description: string;
  excerpt?: string; amount: number; type: 'expense' | 'income';
  kind: 'purchase' | 'fee' | 'interest' | 'fine' | 'refund' | 'credit' | 'bill_payment' | 'previous_balance' | 'installment' | 'unknown';
  confidence: number; requiresReview: boolean; included: boolean; exclusionReason?: string;
};

export type ParsedFinancialDocument = {
  documentType: 'card_statement' | 'bank_statement' | 'spreadsheet' | 'boleto' | 'receipt' | 'unknown';
  sourceProfile?: 'nubank_credit_card_csv' | 'generic_spreadsheet' | 'pdf_text';
  issuer?: string; cardLastFour?: string; holderName?: string; dueDate?: Date;
  closingDate?: Date; documentTotal?: number; items: ParsedImportItem[];
};

const PDF = Buffer.from('%PDF-');
const OLE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ZIP = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

export function validateImportFile(buffer: Buffer, fileName: string, mimeType: string): 'pdf' | 'csv' | 'xls' | 'xlsx' {
  if (!buffer.length) throw new ImportFileError('EMPTY_FILE', 'O arquivo enviado está vazio.');
  if (buffer.length > IMPORT_MAX_FILE_BYTES) throw new ImportFileError('FILE_TOO_LARGE', `O arquivo excede o limite de ${Math.floor(IMPORT_MAX_FILE_BYTES / 1024 / 1024)} MB.`, 413);
  const ext = fileName.toLowerCase().split('.').pop();
  if (buffer.subarray(0, PDF.length).equals(PDF) && mimeType === 'application/pdf' && ext === 'pdf') return 'pdf';
  if (buffer.subarray(0, OLE.length).equals(OLE) && ['application/vnd.ms-excel', 'application/octet-stream'].includes(mimeType) && ext === 'xls') return 'xls';
  if (buffer.subarray(0, ZIP.length).equals(ZIP) && mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && ext === 'xlsx') return 'xlsx';
  const allowedCsvMime = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
  if (ext === 'csv' && allowedCsvMime.includes(mimeType) && !buffer.includes(0)) return 'csv';
  throw new ImportFileError('UNSUPPORTED_OR_MISMATCHED_FILE', 'O formato, o conteúdo ou o tipo MIME do arquivo não é suportado.');
}

export function fullFileHash(buffer: Buffer): string { return createHash('sha256').update(buffer).digest('hex'); }
export function normalizeDescription(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
export function itemFingerprint(date: Date, amount: number, description: string, type: string): string {
  const day = date.toISOString().slice(0, 10);
  return createHash('sha256').update(`${day}|${amount.toFixed(2)}|${normalizeDescription(description)}|${type}`).digest('hex');
}

function parseBrazilianAmount(input: unknown): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? Math.abs(input) : null;
  let raw = String(input ?? '').trim().replace(/R\$\s?/gi, '').replace(/\s/g, '');
  if (!raw) return null;
  const negative = raw.startsWith('-') || /^\(.*\)$/.test(raw);
  raw = raw.replace(/[()\-+]/g, '');
  if (raw.includes(',') && raw.includes('.')) raw = raw.replace(/\./g, '').replace(',', '.');
  else if (raw.includes(',')) raw = raw.replace(',', '.');
  const value = Number(raw);
  return Number.isFinite(value) ? Math.abs(value) * (negative ? -1 : 1) : null;
}

function parseDate(input: unknown): Date | null {
  if (input instanceof Date && !Number.isNaN(input.getTime())) return new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()));
  if (typeof input === 'number') {
    const p = XLSX.SSF.parse_date_code(input);
    if (p) return new Date(Date.UTC(p.y, p.m - 1, p.d));
  }
  const raw = String(input ?? '').trim();
  const br = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (br) { const year = Number(br[3]) < 100 ? 2000 + Number(br[3]) : Number(br[3]); return new Date(Date.UTC(year, Number(br[2]) - 1, Number(br[1]))); }
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00.000Z`);
  return null;
}

function classifyItem(description: string, signedAmount: number, sourceProfile: ParsedFinancialDocument['sourceProfile'] = 'generic_spreadsheet'): Pick<ParsedImportItem, 'kind' | 'type' | 'included' | 'exclusionReason' | 'requiresReview'> {
  const d = normalizeDescription(description);
  if (/pagamento (recebido|da fatura)|payment received/.test(d)) return { kind: 'bill_payment', type: 'expense', included: false, exclusionReason: 'Pagamento de fatura não é uma nova transação.', requiresReview: false };
  if (/saldo anterior/.test(d)) return { kind: 'previous_balance', type: 'expense', included: false, exclusionReason: 'Saldo anterior já pertence a outro período.', requiresReview: false };
  if (/estorno|reembolso/.test(d)) return { kind: 'refund', type: 'income', included: true, requiresReview: false };
  if (/cashback|credito recebido|credito em conta|credito de compra|ajuste credor|bonificacao/.test(d)) return { kind: 'credit', type: 'income', included: true, requiresReview: false };
  if (/tarifa|anuidade/.test(d)) return { kind: 'fee', type: 'expense', included: true, requiresReview: false };
  if (/juros|iof/.test(d)) return { kind: 'interest', type: 'expense', included: true, requiresReview: false };
  if (/multa/.test(d)) return { kind: 'fine', type: 'expense', included: true, requiresReview: false };
  if (signedAmount < 0 && (sourceProfile === 'nubank_credit_card_csv' || sourceProfile === 'pdf_text')) return { kind: 'unknown', type: 'income', included: true, requiresReview: true };
  if (/\b\d{1,2}[\/]\d{1,2}\b/.test(d)) return { kind: 'installment', type: 'expense', included: true, requiresReview: false };
  return { kind: 'purchase', type: signedAmount < 0 ? 'income' : 'expense', included: true, requiresReview: false };
}

const aliases = {
  date: ['data', 'date', 'transaction date', 'dt'], description: ['descricao', 'descrição', 'description', 'title', 'merchant', 'narrative', 'details', 'transaction description', 'historico', 'histórico', 'memo', 'lancamento', 'lançamento'],
  amount: ['valor', 'amount', 'total'], debit: ['debito', 'débito', 'debit', 'saida', 'saída'], credit: ['credito', 'crédito', 'credit', 'entrada']
};
function findValue(row: Record<string, unknown>, names: string[]): unknown {
  const normalizedAliases = new Set(names.map(normalizeDescription));
  const entry = Object.entries(row).find(([key]) => normalizedAliases.has(normalizeDescription(key)));
  return entry?.[1];
}

export function parseSpreadsheetRows(buffer: Buffer, fileName: string): ParsedFinancialDocument {
  let rows: Record<string, unknown>[];
  let detectedHeaders: string[] = [];
  try {
    if (fileName.toLowerCase().endsWith('.csv')) {
      const lines = buffer.toString('utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
      const delimiter = (lines[0]?.match(/;/g)?.length ?? 0) > (lines[0]?.match(/,/g)?.length ?? 0) ? ';' : ',';
      const parseLine = (line: string) => { const values: string[] = []; let value = ''; let quoted = false; for (let i = 0; i < line.length; i++) { const char = line[i]; if (char === '"' && line[i + 1] === '"') { value += '"'; i++; } else if (char === '"') quoted = !quoted; else if (char === delimiter && !quoted) { values.push(value); value = ''; } else value += char; } values.push(value); return values; };
      const headers = parseLine(lines.shift() ?? '');
      detectedHeaders = headers.map(normalizeDescription).filter(Boolean);
      rows = lines.map(line => Object.fromEntries(parseLine(line).map((value, index) => [headers[index] ?? `coluna_${index + 1}`, value])));
    } else {
      const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];
      if (!sheet) throw new ImportFileError('EMPTY_DOCUMENT', 'A planilha não possui linhas para importar.');
      rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: true });
      detectedHeaders = Object.keys(rows[0] ?? {}).map(normalizeDescription).filter(Boolean);
    }
  } catch (error) { if (error instanceof ImportFileError) throw error; throw new ImportFileError('MALFORMED_FILE', 'Não foi possível ler a planilha. Verifique se o arquivo não está corrompido.'); }
  const headerSet = new Set(detectedHeaders);
  const hasAlias = (names: string[]) => names.some(name => headerSet.has(normalizeDescription(name)));
  const sourceProfile: ParsedFinancialDocument['sourceProfile'] = hasAlias(['date']) && hasAlias(['title']) && hasAlias(['amount']) ? 'nubank_credit_card_csv' : 'generic_spreadsheet';
  const mappedFields = [hasAlias(aliases.date) && 'date', hasAlias(aliases.description) && 'description', (hasAlias(aliases.amount) || hasAlias(aliases.debit) || hasAlias(aliases.credit)) && 'amount'].filter(Boolean) as string[];
  const missingFields = ['date', 'description', 'amount'].filter(field => !mappedFields.includes(field));
  const items: ParsedImportItem[] = [];
  for (const [index, row] of rows.entries()) {
    const date = parseDate(findValue(row, aliases.date));
    const description = String(findValue(row, aliases.description) ?? '').trim();
    const debit = parseBrazilianAmount(findValue(row, aliases.debit));
    const credit = parseBrazilianAmount(findValue(row, aliases.credit));
    const general = parseBrazilianAmount(findValue(row, aliases.amount));
    const signed = credit != null && credit !== 0 ? -Math.abs(credit) : debit != null && debit !== 0 ? Math.abs(debit) : general;
    if (!date || !description || signed == null || signed === 0) continue;
    const classified = classifyItem(description, signed, sourceProfile);
    items.push({ rowIndex: index + 1, date, originalDescription: description, description: description.slice(0, 255), excerpt: JSON.stringify(row).slice(0, 1000), amount: Math.abs(signed), confidence: classified.requiresReview ? 0.5 : 0.95, ...classified });
  }
  if (!items.length) throw new ImportFileError('NO_ITEMS_FOUND', 'Nenhum lançamento válido foi identificado na planilha.', 400, { detected_headers: detectedHeaders, mapped_fields: mappedFields, missing_fields: missingFields, rows_read: rows.length, rows_accepted: 0, rows_rejected: rows.length });
  return { documentType: sourceProfile === 'nubank_credit_card_csv' ? 'card_statement' : 'spreadsheet', sourceProfile, items };
}

function extractInvoiceTotal(text: string): number | undefined {
  const patterns = [/total\s+(?:da\s+)?fatura\s*[:\-]?\s*R?\$?\s*([\d.]+,\d{2})/i, /valor\s+total\s*[:\-]?\s*R?\$?\s*([\d.]+,\d{2})/i];
  for (const pattern of patterns) { const match = text.match(pattern); const value = parseBrazilianAmount(match?.[1]); if (value != null) return Math.abs(value); }
}

export async function parsePdf(buffer: Buffer): Promise<ParsedFinancialDocument> {
  const text = await extractPdfText(buffer);
  if (!text.trim()) throw new ImportFileError('SCANNED_PDF_OCR_REQUIRED', 'Este PDF parece escaneado ou formado apenas por imagens. OCR ainda não está disponível e nenhuma transação foi criada.');
  if (text.length > IMPORT_MAX_EXTRACTED_CHARS) throw new ImportFileError('DOCUMENT_TOO_LARGE', 'O documento possui texto demais para processamento seguro. Nenhuma importação parcial foi criada.', 413);
  const lowered = normalizeDescription(text.slice(0, 5000));
  const documentType = /fatura|cartao|cartão/.test(lowered) ? 'card_statement' : /extrato|saldo/.test(lowered) ? 'bank_statement' : /boleto/.test(lowered) ? 'boleto' : /comprovante/.test(lowered) ? 'receipt' : 'unknown';
  const items: ParsedImportItem[] = [];
  const linePattern = /(?:^|\n)\s*(\d{1,2}[\/.-]\d{1,2}(?:[\/.-]\d{2,4})?)\s+(.{2,180}?)\s+(-?\s*(?:R\$\s*)?[\d.]+,\d{2})\s*(?=\n|$)/g;
  let match: RegExpExecArray | null; let index = 0;
  while ((match = linePattern.exec(text)) !== null) {
    const rawDate = match[1]!.split(/[\/.-]/); const hasYear = rawDate.length === 3;
    const year = hasYear ? Number(rawDate[2]) + (Number(rawDate[2]) < 100 ? 2000 : 0) : new Date().getUTCFullYear();
    const date = new Date(Date.UTC(year, Number(rawDate[1]) - 1, Number(rawDate[0])));
    const description = match[2]!.trim(); const signed = parseBrazilianAmount(match[3]);
    if (!description || signed == null || signed === 0 || Number.isNaN(date.getTime())) continue;
    const classified = classifyItem(description, signed, 'pdf_text');
    items.push({ rowIndex: ++index, date, originalDescription: description, description: description.slice(0, 255), excerpt: match[0].trim().slice(0, 1000), amount: Math.abs(signed), confidence: documentType === 'unknown' ? 0.55 : 0.82, ...classified, requiresReview: classified.requiresReview || documentType === 'unknown' });
  }
  if (!items.length) throw new ImportFileError('NO_ITEMS_FOUND', 'O PDF foi lido, mas nenhum lançamento foi identificado com segurança. Nenhuma transação foi criada.');
  const lastFour = text.match(/(?:final|terminado em|cart[aã]o)\s*[*x.-]*\s*(\d{4})/i)?.[1];
  return { documentType, sourceProfile: 'pdf_text', cardLastFour: lastFour, documentTotal: extractInvoiceTotal(text), items };
}

export async function parseFinancialDocument(buffer: Buffer, fileName: string, mimeType: string): Promise<{ parsed: ParsedFinancialDocument; hash: string; format: string }> {
  const format = validateImportFile(buffer, fileName, mimeType);
  const parsed = format === 'pdf' ? await parsePdf(buffer) : parseSpreadsheetRows(buffer, fileName);
  return { parsed, hash: fullFileHash(buffer), format };
}
