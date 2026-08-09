import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateIdentity } from './identity.js';
import type { JwtRequest } from './jwt.js';

export interface PlatformRequest extends JwtRequest {
  platformRole?: 'platform_owner' | 'platform_support';
}

export const authenticatePlatformIdentity = authenticateIdentity;

export async function requirePlatformOwner(req: PlatformRequest, res: Response, next: NextFunction) {
  try {
    const role = await prisma.platform_user_roles.findFirst({
      where: { user_id: req.userId!, role: 'platform_owner', revoked_at: null },
    });
    if (!role) return res.status(403).json({ error: 'Acesso restrito ao administrador da plataforma' });
    req.platformRole = 'platform_owner';
    next();
  } catch (error) { next(error); }
}

export function requireRecentAuthentication(req: PlatformRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.slice(7);
  if (!token) return res.status(401).json({ error: 'Autenticação requerida' });
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1]!, 'base64url').toString()) as { iat?: number };
    const maxAge = Number(process.env.PLATFORM_ADMIN_RECENT_AUTH_SECONDS ?? 900);
    if (!payload.iat || Date.now() / 1000 - payload.iat > maxAge) {
      return res.status(401).json({ error: 'Autenticação recente requerida', code: 'RECENT_AUTH_REQUIRED' });
    }
    next();
  } catch { return res.status(401).json({ error: 'Token inválido' }); }
}
