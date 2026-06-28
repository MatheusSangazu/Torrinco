import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Valida o webhook da Evolution API via API Key no header.
 *
 * A Evolution envia automaticamente o header `apikey` em todos os webhooks
 * (tradicional ou external), com o valor configurado em `AUTHENTICATION_API_KEY`
 * ou no token da instância. Sem isso, qualquer um que descubra a URL pode
 * forjar payloads — então bloqueamos qualquer chamada sem key válida.
 *
 * Requer `EVOLUTION_WEBHOOK_API_KEY` no .env com o MESMO valor cadastrado
 * na Evolution. Comparação em tempo constante (anti-timing attack).
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

  // Evolution usa o header `apikey` (case-insensitive pelo Express).
  const received = req.headers['apikey'] as string | undefined
    ?? req.headers['Apikey'] as string | undefined
    ?? req.headers['APIKEY'] as string | undefined;

  if (!received) {
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
