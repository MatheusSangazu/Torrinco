import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { prisma } from '../lib/prisma.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

console.log('✅ JWT module loaded');
console.log('✅ JWT_SECRET exists:', !!JWT_SECRET);
console.log('✅ ACCESS_TOKEN_EXPIRES_IN:', ACCESS_TOKEN_EXPIRES_IN);
console.log('✅ REFRESH_TOKEN_EXPIRES_IN:', REFRESH_TOKEN_EXPIRES_IN);

export interface JwtRequest extends Request {
  userId?: number;
  accountId?: number;
  userRole?: string;
}

export interface JwtPayload {
  userId: number;
  accountId: number;
  userRole: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN as any });
};

export const generateToken = (payload: JwtPayload, expiresIn: string | number = REFRESH_TOKEN_EXPIRES_IN): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const decoded = verify(token, JWT_SECRET, { ignoreExpiration: false });
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  const decodedAny = decoded as any;
  return {
    userId: Number(decodedAny.userId),
    accountId: Number(decodedAny.accountId),
    userRole: String(decodedAny.userRole)
  };
};

/**
 * Cache de status de conta (accountId → {status, ts}).
 * Evita 1 DB query por request: a conta é checada no máx. a cada TTL_MS.
 * Cancelamentos/bloqueios refletem em até TTL_MS segundos.
 */
const ACCOUNT_STATUS_TTL_MS = 30_000;
const accountStatusCache = new Map<number, { status: string | null; ts: number }>();

async function isAccountActive(accountId: number): Promise<boolean> {
  const now = Date.now();
  const cached = accountStatusCache.get(accountId);
  if (cached && now - cached.ts < ACCOUNT_STATUS_TTL_MS) {
    return cached.status === 'active' || cached.status === 'trial';
  }
  const account = await prisma.accounts.findUnique({
    where: { id: accountId },
    select: { status: true }
  });
  const status = account?.status ?? null;
  accountStatusCache.set(accountId, { status, ts: now });
  return status === 'active' || status === 'trial';
}

export const authenticateJwt = (
  req: JwtRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.accountId = payload.accountId;
    req.userRole = payload.userRole;
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  // Gap 3: bloqueia contas canceladas/blocked mesmo com token JWT válido.
  // O token de acesso dura 1h, o de refresh 7d — sem isto, uma conta
  // cancelada continuaria acessando a API até expirar.
  isAccountActive(req.accountId!)
    .then((active) => {
      if (!active) {
        return res.status(403).json({ error: 'Conta inativa ou bloqueada' });
      }
      next();
    })
    .catch((error) => {
      console.error('[auth] Falha ao checar status da conta:', error);
      // Em caso de erro de DB, não trava o usuário legítimo (fail-open).
      next();
    });
};

export const requireAdmin = (
  req: JwtRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Acesso de administrador requerido' });
  }
  next();
};
