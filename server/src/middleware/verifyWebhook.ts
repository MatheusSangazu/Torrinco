import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Valida o webhook da Evolution API via header customizado `x-webhook-key`.
 *
 * A Evolution NÃO envia nenhum header de auth automaticamente (confirmado em
 * produção). Por isso, configuramos manualmente um header customizado no
 * webhook dela (campo `headers: { "x-webhook-key": "..." }` ao configurar o
 * webhook). Esse mesmo valor vai pra `EVOLUTION_WEBHOOK_API_KEY` no .env.
 *
 * Sem isso, qualquer um que descubra a URL pode forjar payloads. Comparação
 * em tempo constante (anti-timing attack).
 *
 * Em dev sem env var: apenas avisa no log (não trava).
 */

/** Comparação em tempo constante (proteção contra timing attack). */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyEvolutionApiKey(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.EVOLUTION_WEBHOOK_API_KEY;
  const isProd = process.env.NODE_ENV === 'production';

  if (!expected) {
    if (isProd) {
      console.error('[security] EVOLUTION_WEBHOOK_API_KEY ausente em produção — webhook recusado');
      res.status(503).json({ error: 'Webhook não configurado' });
      return;
    }
    console.warn('[security] EVOLUTION_WEBHOOK_API_KEY não definido — webhook sem validação (apenas dev).');
    return next();
  }

  // Header customizado configurado no webhook da Evolution:
  //   headers: { "x-webhook-key": "<mesmo valor do .env>" }
  // Aceita também Bearer x-webhook-key pra flexibilidade.
  const received =
    (req.headers['x-webhook-key'] as string | undefined) ??
    (req.headers['x-api-key'] as string | undefined);

  if (!received) {
    console.warn('[security] header x-webhook-key ausente. Headers:', Object.keys(req.headers));
    res.status(401).json({ error: 'api key ausente' });
    return;
  }

  if (!safeEqual(received, expected)) {
    console.warn('[security] api key inválida no webhook');
    res.status(401).json({ error: 'api key inválida' });
    return;
  }

  next();
}
