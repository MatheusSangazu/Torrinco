import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Valida o webhook da Evolution API.
 *
 * A Evolution (v2.3.6) inclui a API key em DOIS lugares por padrão:
 *  1. No campo `apikey` do body (confirmado em produção).
 *  2. Opcionalmente em header customizado `x-webhook-key` que configuramos.
 *
 * Aceitamos qualquer um dos dois. Sem validação, qualquer um que descubra
 * a URL pode forjar payloads. Comparação em tempo constante (anti-timing).
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

  // 1) Header customizado (se configurado no webhook da Evolution).
  const fromHeader =
    (req.headers['x-webhook-key'] as string | undefined) ??
    (req.headers['x-api-key'] as string | undefined);

  // 2) Campo `apikey` no body (a Evolution sempre envia — confirmado em prod).
  const fromBody = typeof req.body?.apikey === 'string' ? req.body.apikey : undefined;

  const received = fromHeader ?? fromBody;

  if (!received) {
    console.warn('[security] api key ausente (header e body). Headers:', Object.keys(req.headers));
    res.status(401).json({ error: 'api key ausente' });
    return;
  }

  if (!safeEqual(received, expected)) {
    // DEBUG TEMP: mostra só o início (8 chars) pra comparar sem vazar segredo.
    console.warn('[security] api key inválida. Esperado:', expected.slice(0, 8), 'len:', expected.length, '| Recebido:', received.slice(0, 8), 'len:', received.length, '| fonte:', fromBody ? 'body' : 'header');
    res.status(401).json({ error: 'api key inválida' });
    return;
  }

  next();
}
