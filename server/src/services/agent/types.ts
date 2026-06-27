/**
 * Tipos compartilhados do agente de IA.
 */

/** Mensagem normalizada que entra no buffer. */
export interface WebhookMessage {
  /** Texto já processado (transcrito se áudio, descrito se foto, etc). */
  text: string;
  /** Tipo original da mídia. */
  mediaType: 'text' | 'audio' | 'image' | 'file' | 'unknown';
  /** URL/base64 do conteúdo original (quando aplicável). */
  mediaUrl?: string;
  /** ID do usuário dono do telefone (preenchido pelo eligibility). */
  userId: number;
  /** Timestamp de chegada no webhook. */
  receivedAt: Date;
}

/** Resultado da checagem de elegibilidade. */
export interface EligibilityResult {
  ok: boolean;
  userId?: number;
  reason?: string;
}
