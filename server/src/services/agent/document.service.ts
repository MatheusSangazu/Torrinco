import { createHash } from 'node:crypto';
import * as XLSX from 'xlsx';
import { extractPdfText } from './pdf.service.js';

/**
 * Extração de texto de documentos — camada unificada para qualquer arquivo
 * enviado pelo WhatsApp (PDF, planilhas Excel, CSV).
 *
 * O nome do arquivo é repassado ao LLM como contexto — ele decide o que é
 * (fatura, boleto, extrato, comprovante) e como tratar. Não há mais
 * acoplamento a "fatura de cartão".
 *
 * Limites:
 *  - PDF de imagem/scanner não é OCRizado (texto vazio → sinaliza o agente).
 *  - Planilhas muito grandes são truncadas (limite ~6000 chars) pra não
 *    estourar o contexto do LLM.
 */

export const MAX_DOC_CHARS = Number(process.env.WHATSAPP_DOCUMENT_MAX_CHARS || 50_000);

export type DocKind = 'pdf' | 'spreadsheet' | 'unknown';

export interface ExtractedDoc {
  kind: DocKind;
  fileName: string;
  /** Texto estruturado pronto pro LLM (pode estar truncado). */
  text: string;
  /** True se o texto precisou ser truncado. */
  truncated: boolean;
  /** True se a extração não conseguiu ler nada (ex.: PDF imagem). */
  empty: boolean;
}

/** Classifica o arquivo pela extensão/nome. */
export function classifyDoc(fileName?: string, mimeType?: string): DocKind {
  const name = (fileName ?? '').toLowerCase();
  const mime = mimeType ?? '';
  if (name.endsWith('.pdf') || mime.includes('application/pdf')) return 'pdf';
  if (
    name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') ||
    mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv')
  ) {
    return 'spreadsheet';
  }
  return 'unknown';
}

/** Extrai o texto de um Buffer conforme o tipo. */
export async function extractDocument(
  buffer: Buffer,
  fileName: string,
  kind: DocKind
): Promise<ExtractedDoc> {
  let raw = '';

  if (kind === 'pdf') {
    raw = await extractPdfText(buffer);
  } else if (kind === 'spreadsheet') {
    raw = extractSpreadsheetText(buffer, fileName);
  } else {
    // Tipo desconhecido: tenta PDF; se vier vazio, sinaliza.
    raw = await extractPdfText(buffer);
    if (!raw.trim()) {
      return { kind: 'unknown', fileName, text: '', truncated: false, empty: true };
    }
  }

  const empty = !raw.trim();
  const truncated = raw.length > MAX_DOC_CHARS;
  const text = truncated ? raw.slice(0, MAX_DOC_CHARS) + '\n[...truncado]' : raw;

  return { kind, fileName, text, truncated, empty };
}

/**
 * Converte planilha (xlsx/xls/csv) em texto tabular legível pro LLM.
 * Estratégia: lê a primeira sheet como array de objetos JSON (cabeçalho na 1ª linha).
 * Se falhar, cai pra `sheet_to_csv` (útil pra CSV legado sem cabeçalho claro).
 */
function extractSpreadsheetText(buffer: Buffer, fileName: string): string {
  try {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = wb.SheetNames[0];
    if (!firstSheet) return '';
    const ws = wb.Sheets[firstSheet];
    if (!ws) return '';

    // 1) Tenta como JSON (cada linha vira um objeto chave=valor).
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, {
      defval: '',
      raw: false
    });
    if (rows.length > 0) {
      const lines = rows.map(r => JSON.stringify(stripEmpty(r)));
      return `Planilha: ${fileName}\nLinhas: ${rows.length}\n\n${lines.join('\n')}`;
    }

    // 2) Fallback: CSV puro.
    const csv = XLSX.utils.sheet_to_csv(ws);
    return `Planilha: ${fileName}\n\n${csv}`;
  } catch (err) {
    console.error('[document] Falha ao ler planilha:', err);
    return '';
  }
}

/** Remove chaves vazias pra reduzir ruído no prompt. */
function stripEmpty(obj: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === '' || v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

/** Hash rápido para deduplicação (evita importar o mesmo arquivo 2x). */
export function hashBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex').slice(0, 16);
}
