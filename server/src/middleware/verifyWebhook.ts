import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Valida a assinatura HMAC-SHA256 do webhook da Evolution API.
 *
 * SEM isso, qualquer um que descubra a URL `/webhooks/evolution` pode forjar
 * payloads e injetar transações / ler dados / tomar ações em nome de usuários.
 *
 * A Evolution envia o header `X-Webhook-Signature: sha256=<hex>` (ou
 * `x-hub-signature-256` em versões mais antigas). O hash é calculado sobre o
 * body BRUTO do request usando um segredo compartilhado configurado por
 * webhook no painel da Evolution (securityConfig.signatureSecret).
 *
 * Requer `rawBody` no request — habilitado no express.json via opção `verify`.
 *
 * Se `EVOLUTION_WEBHOOK_SECRET` não estiver definido, o middleware BLOQUEIA
 * em produção e apenas avisa em desenvolvimento (pra não travar dev local).
 */

function getSignature(req: Request): string | undefined {
  return (
    (req.headers['x-webhook-signature'] as string | undefined) ??
    (req.headers['x-hub-signature-256'] as string | undefined)
  );
}

/** Comparação em tempo constante (proteção contra timing attack). */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyEvolutionSignature(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.EVOLUTION_WEBHOOK_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (!secret) {
    if (isProd) {
      console.error('[security] EVOLUTION_WEBHOOK_SECRET ausente em produção — webhook recusado');
      res.status(503).json({ error: 'Webhook não configurado' });
      return;
    }
    // Em dev apenas avisa no log uma vez; segue sem validar.
    console.warn('[security] EVOLUTION_WEBHOOK_SECRET não definido — webhook sem validação (apenas dev).');
    return next();
  }

  const sigHeader = getSignature(req);
  const raw = (req as any).rawBody;

  if (!raw) {
    // Sem raw body = express.json não configurado pra capturar.
    console.error('[security] rawBody ausente — configure express.json({ verify })');
    res.status(500).json({ error: 'configuração inválida' });
    return;
  }

  if (!sigHeader) {
    res.status(401).json({ error: 'assinatura ausente' });
    return;
  }

  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex');

  if (!safeEqual(sigHeader, expected)) {
    console.warn('[security] assinatura inválida no webhook');
    res.status(401).json({ error: 'assinatura inválida' });
    return;
  }

  next();
}
