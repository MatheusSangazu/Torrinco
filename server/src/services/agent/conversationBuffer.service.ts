/**
 * Buffer de conversação — agrega mensagens de um mesmo telefone.
 *
 * Resolve o problema "olá" + "bom dia" chegarem como 2 webhooks separados e a
 * IA responder 2x isoladamente. A cada mensagem, reinicia um timer de 5s; só
 * dispara o processamento quando o usuário fica em silêncio por 5s.
 *
 * Em memória (suficiente para 1 instância). Para múltiplas instâncias, migrar
 * para Redis com chave por telefone.
 */

import type { WebhookMessage } from './types.js';

const DEBOUNCE_MS = 5000;
const buffers = new Map<string, { messages: WebhookMessage[]; timer: NodeJS.Timeout }>();

export type FlushCallback = (phone: string, userId: number, messages: WebhookMessage[]) => Promise<void>;

/**
 * Adiciona uma mensagem ao buffer do telefone e (re)inicia o timer.
 * Quando o timer dispara (5s de silêncio), chama `onFlush` com todas as
 * mensagens acumuladas e limpa o buffer.
 */
export function enqueueMessage(
  phone: string,
  userId: number,
  message: WebhookMessage,
  onFlush: FlushCallback
): void {
  const existing = buffers.get(phone);

  if (existing) {
    existing.messages.push(message);
    clearTimeout(existing.timer);
    existing.timer = setTimeout(() => flush(phone, onFlush), DEBOUNCE_MS);
    return;
  }

  const entry = {
    messages: [message],
    timer: setTimeout(() => flush(phone, onFlush), DEBOUNCE_MS)
  };
  buffers.set(phone, entry);
}

function flush(phone: string, onFlush: FlushCallback) {
  const entry = buffers.get(phone);
  if (!entry) return;
  buffers.delete(phone);
  // Chama o callback sem bloquear; erros são tratados por quem registrou.
  onFlush(phone, entry.messages[0]?.userId ?? 0, entry.messages).catch(err => {
    console.error(`[buffer] Erro ao processar buffer de ${phone}:`, err);
  });
}

/** Número de mensagens atualmente em buffer (para testes/diagnostics). */
export function pendingCount(): number {
  return buffers.size;
}
