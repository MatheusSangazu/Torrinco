import type { Response, NextFunction } from 'express';
import { verifyToken, type JwtRequest } from './jwt.js';

/** Valida somente a identidade, usado na area de assinatura mesmo sem acesso ao produto. */
export function authenticateIdentity(req: JwtRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token de autenticacao nao fornecido' });
  try {
    const payload = verifyToken(header.slice(7));
    req.userId = payload.userId;
    req.accountId = payload.accountId;
    req.userRole = payload.userRole;
    next();
  } catch { return res.status(401).json({ error: 'Token invalido ou expirado' }); }
}
