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

  // DEBUG TEMPORÁRIO — mostra todos os headers recebidos pra descobrir o que
  // a Evolution envia de fato. Remover depois de estabilizar.
  console.log('[webhook] Headers recebidos:', JSON.stringify(req.headers, null, 2));

  if (!expected) {
    if (isProd) {
      console.error('[security] EVOLUTION_WEBHOOK_API_KEY ausente em produção — webhook recusado');
      res.status(503).json({ error: 'Webhook não configurado' });
      return;
    }
    console.warn('[security] EVOLUTION_WEBHOOK_API_KEY não definido — webhook sem validação (apenas dev).');
    return next();
  }

  // Tenta vários nomes de header possíveis (a Evolution envia o que você
  // configurar manualmente em webhook.headers, então pode ser qualquer nome).
  const candidates = [
    req.headers['apikey'],
    req.headers['api-key'],
    req.headers['x-api-key'],
    req.headers['x-webhook-key'],
    req.headers['authorization']
  ];
  const received = candidates.find(h => typeof h === 'string') as string | undefined;

  if (!received) {
    console.warn('[security] nenhum header de auth reconhecido. Recebidos:', Object.keys(req.headers));
    res.status(401).json({ error: 'api key ausente' });
    return;
  }

  // Se vier "Bearer xxx" extrai o token.
  const token = received.startsWith('Bearer ') ? received.slice(7) : received;

  if (!safeEqual(token, expected)) {
    console.warn('[security] api key inválida no webhook. Esperado len:', expected.length, 'Recebido len:', token.length);
    res.status(401).json({ error: 'api key inválida' });
    return;
  }

  next();
}
