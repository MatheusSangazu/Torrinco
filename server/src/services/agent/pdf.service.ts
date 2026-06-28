import { createHash } from 'node:crypto';

/**
 * Extrai texto de um PDF.
 *
 * Usado para importar faturas de cartão enviadas como PDF no WhatsApp.
 * O texto bruto é devolvido para o LLM estruturar (via tools) — o agente
 * decide o que é cada linha e registra como transação.
 */

/**
 * Extrai o texto de um Buffer de PDF.
 * @returns texto extraído, ou string vazia se não conseguir.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Import dinâmico para evitar problema conhecido com o arquivo de teste
    // do pdf-parse em ambientes de build.
    const mod = await import('pdf-parse');
    const pdfParse = typeof mod === 'function' ? mod : (mod as any).default ?? (mod as any);
    const data = await pdfParse(buffer);
    return data?.text ?? '';
  } catch (err) {
    console.error('[pdf] Falha ao extrair texto do PDF:', err);
    return '';
  }
}

/** Hash rápido para deduplicação (evita importar o mesmo PDF 2x). */
export function hashBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex').slice(0, 16);
}
