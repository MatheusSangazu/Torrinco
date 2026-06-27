import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

/**
 * Histórico de conversa por telefone (em memória).
 *
 * Permite que o agente faça perguntas de confirmação ("foi cartão ou dinheiro?")
 * e entenda a resposta do usuário no contexto da pergunta anterior.
 *
 * TTL de 5 min: se o usuário ficar inativo, o histórico expira (começa do zero).
 * Mantém as últimas 20 mensagens (10 turnos) para não estourar o contexto.
 */

const HISTORY_TTL_MS = 5 * 60 * 1000; // 5 minutos
const MAX_MESSAGES = 20;

interface HistoryEntry {
  messages: ChatCompletionMessageParam[];
  lastUpdated: number;
}

const histories = new Map<string, HistoryEntry>();

/** Retorna o histórico de um telefone (ou vazio se expirou/inexistente). */
export function getHistory(phone: string): ChatCompletionMessageParam[] {
  const entry = histories.get(phone);
  if (!entry) return [];

  // Expirou?
  if (Date.now() - entry.lastUpdated > HISTORY_TTL_MS) {
    histories.delete(phone);
    return [];
  }

  return entry.messages;
}

/** Adiciona a mensagem do usuário e a resposta do assistente ao histórico. */
export function appendToHistory(
  phone: string,
  userMessage: string,
  assistantReply: string
): void {
  const existing = histories.get(phone);
  const messages = existing?.messages ?? [];

  messages.push({ role: 'user', content: userMessage });
  messages.push({ role: 'assistant', content: assistantReply });

  // Mantém só as últimas MAX_MESSAGES.
  const trimmed = messages.slice(-MAX_MESSAGES);

  histories.set(phone, {
    messages: trimmed,
    lastUpdated: Date.now()
  });
}

/** Limpa o histórico de um telefone (para testes ou reset manual). */
export function clearHistory(phone: string): void {
  histories.delete(phone);
}
