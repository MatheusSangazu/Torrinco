import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { extractPdfText } = vi.hoisted(() => ({ extractPdfText: vi.fn() }));
vi.mock('../src/services/agent/pdf.service.js', () => ({ extractPdfText }));
import { fullFileHash, ImportFileError, itemFingerprint, parseFinancialDocument, parsePdf, parseSpreadsheetRows, validateImportFile } from '../src/services/financial-import-parser.service.js';

function sheetBuffer(rows: Record<string, unknown>[], type: 'xlsx' | 'xls' = 'xlsx') {
  const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), 'Dados');
  return Buffer.from(XLSX.write(book, { type: 'buffer', bookType: type }));
}

describe('parser central de importações financeiras', () => {
  beforeEach(() => extractPdfText.mockReset());
  it('lê CSV separado por vírgula e valor brasileiro', () => {
    const parsed = parseSpreadsheetRows(Buffer.from('Data,Descrição,Valor\n01/08/2026,Mercado,"1.234,56"'), 'dados.csv');
    expect(parsed.items[0]).toMatchObject({ description: 'Mercado', amount: 1234.56, type: 'expense' });
  });
  it('lê CSV separado por ponto e vírgula', () => {
    const parsed = parseSpreadsheetRows(Buffer.from('Data;Descrição;Valor\n02/08/2026;Farmácia;45,90'), 'dados.csv');
    expect(parsed.items[0]?.amount).toBe(45.9);
  });
  it.each(['xlsx', 'xls'] as const)('lê planilha %s', type => {
    const parsed = parseSpreadsheetRows(sheetBuffer([{ Data: '03/08/2026', Descrição: 'Padaria', Valor: 18.5 }], type), `dados.${type}`);
    expect(parsed.items).toHaveLength(1);
  });
  it('recusa PDF escaneado sem OCR', async () => {
    extractPdfText.mockResolvedValue('');
    await expect(parsePdf(Buffer.from('%PDF-1.4'))).rejects.toMatchObject({ code: 'SCANNED_PDF_OCR_REQUIRED' });
  });
  it('lê PDF textual, mostra estorno e exclui pagamento de fatura', async () => {
    extractPdfText.mockResolvedValue('FATURA CARTÃO FINAL 1234\n01/08 Mercado 100,00\n02/08 Estorno loja -20,00\n03/08 Pagamento da fatura -80,00\nTotal da fatura R$ 80,00\n');
    const parsed = await parsePdf(Buffer.from('%PDF-1.4'));
    expect(parsed.documentType).toBe('card_statement'); expect(parsed.cardLastFour).toBe('1234'); expect(parsed.documentTotal).toBe(80);
    expect(parsed.items.find(i => i.kind === 'refund')?.type).toBe('income');
    expect(parsed.items.find(i => i.kind === 'bill_payment')?.included).toBe(false);
  });
  it('não confia somente na extensão ou MIME', () => {
    expect(() => validateImportFile(Buffer.from('não é pdf'), 'fraude.pdf', 'application/pdf')).toThrowError(ImportFileError);
  });
  it('recusa arquivo vazio e malformado', () => {
    expect(() => validateImportFile(Buffer.alloc(0), 'dados.csv', 'text/csv')).toThrowError(ImportFileError);
    expect(() => parseSpreadsheetRows(Buffer.from('lixo\0binário'), 'dados.xlsx')).toThrowError(ImportFileError);
  });
  it('usa hash integral e fingerprint estável para duplicidade', () => {
    expect(fullFileHash(Buffer.from('abc'))).toHaveLength(64);
    const date = new Date('2026-08-01T00:00:00Z');
    expect(itemFingerprint(date, 10, 'Mercado São José', 'expense')).toBe(itemFingerprint(date, 10, 'mercado sao jose', 'expense'));
  });
  it('valida assinatura de XLSX e processa sem truncar silenciosamente', async () => {
    const buffer = sheetBuffer([{ Data: '04/08/2026', Descrição: 'Compra', Valor: '10,00' }]);
    const result = await parseFinancialDocument(buffer, 'dados.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(result.parsed.items).toHaveLength(1);
  });
  it('aceita o perfil oficial de CSV do cartão Nubank sem classificar Pix no Crédito como receita', () => {
    const fixture = readFileSync(fileURLToPath(new URL('./fixtures/nubank-credit-card.csv', import.meta.url)));
    const parsed = parseSpreadsheetRows(fixture, 'Nubank_2026-09-08.csv');
    expect(parsed.sourceProfile).toBe('nubank_credit_card_csv');
    expect(parsed.documentType).toBe('card_statement');
    expect(parsed.items).toHaveLength(11);
    const pix = parsed.items.filter(item => item.description.startsWith('Pix no Crédito'));
    expect(pix).toHaveLength(3);
    expect(pix.every(item => item.type === 'expense' && item.kind === 'purchase')).toBe(true);
    expect(pix[0]?.amount).toBe(163.23);
    expect(parsed.items.find(item => item.description === 'Loja de teste')).toMatchObject({ type: 'expense', amount: 97 });
    expect(parsed.items.find(item => item.description === 'Pagamento recebido')).toMatchObject({ kind: 'bill_payment', type: 'expense', amount: 2942.17, included: false });
    expect(parsed.items.find(item => item.description === 'Estorno de compra')).toMatchObject({ kind: 'refund', type: 'income', amount: 50, included: true });
    expect(parsed.items.filter(item => item.included)).toHaveLength(10);
  });
  it('mantém valor negativo desconhecido do perfil Nubank visível e marcado para revisão', () => {
    const parsed = parseSpreadsheetRows(Buffer.from('date,title,amount\n2026-08-01,Ajuste não identificado,"- 10,00"'), 'nubank.csv');
    expect(parsed.items[0]).toMatchObject({ kind: 'unknown', type: 'income', included: true, requiresReview: true, amount: 10 });
  });
  it('normaliza BOM, caixa, acentos e espaços dos aliases de cabeçalho', () => {
    const parsed = parseSpreadsheetRows(Buffer.from('\uFEFF DATE , Transaction Description , AMOUNT \n2026-08-01,Compra segura,"12,34"'), 'arquivo.csv');
    expect(parsed.items[0]).toMatchObject({ description: 'Compra segura', amount: 12.34 });
  });
  it('retorna diagnóstico seguro quando faltam campos obrigatórios', () => {
    try {
      parseSpreadsheetRows(Buffer.from('date,unknown,amount\n2026-08-01,segredo,"10,00"'), 'arquivo.csv');
      throw new Error('deveria falhar');
    } catch (error) {
      expect(error).toMatchObject({ code: 'NO_ITEMS_FOUND', details: { detected_headers: ['date', 'unknown', 'amount'], mapped_fields: ['date', 'amount'], missing_fields: ['description'], rows_read: 1, rows_accepted: 0, rows_rejected: 1 } });
      expect(JSON.stringify((error as ImportFileError).details)).not.toContain('segredo');
    }
  });
});
