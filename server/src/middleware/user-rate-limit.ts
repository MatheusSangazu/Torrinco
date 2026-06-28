/**
 * Limitador por usuário (em memória) — janela deslizante.
 *
 * Diferente do apiLimiter (que protege a API por IP), este limita AÇÕES do
 * agente por usuário: quantas conversas/tool calls ele pode fazer por janela.
 *
 * Uso típico: bloquear abuso de um único usuário que sobrecarrega o agente
 * sem afetar os demais. Importante pra serviço pago: 1 cliente não pode
 * derrubar o orçamento de OpenAI pra todo mundo.
 *
 * Não persiste (reiniciar zera) — é aceitável pra controle de abuso.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<number, Bucket>();

export interface UserRateLimitOptions {
  /** Máximo de ações por janela. */
  max: number;
  /** Tamanho da janela em ms. */
  windowMs: number;
}

/** Default: 30 conversas/hora por usuário. Equivalente a 1 msg a cada 2 min. */
export const DEFAULT_AGENT_LIMIT: UserRateLimitOptions = {
  max: 30,
  windowMs: 60 * 60 * 1000
};

/**
 * Verifica se o usuário pode realizar mais uma ação.
 * Retorna { allowed: true } ou { allowed: false, retryInMs }.
 */
export function checkUserRateLimit(
  userId: number,
  opts: UserRateLimitOptions = DEFAULT_AGENT_LIMIT
): { allowed: true } | { allowed: false; retryInMs: number } {
  const now = Date.now();
  const bucket = buckets.get(userId);

  // Sem bucket ou janela expirada → cria/reinicia.
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(userId, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true };
  }

  // Dentro da janela: incrementa se houver crédito.
  if (bucket.count < opts.max) {
    bucket.count += 1;
    return { allowed: true };
  }

  // Esgotado.
  return { allowed: false, retryInMs: bucket.resetAt - now };
}

/** Reseta explicitamente (úteil em testes). */
export function resetUserRateLimit(userId: number): void {
  buckets.delete(userId);
}
