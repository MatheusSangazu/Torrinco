import dotenv from 'dotenv';
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { prisma } from '../lib/prisma.js';
import { assertAccountAccess } from '../services/subscription.service.js';

dotenv.config();

// ── Configuração hard-coded + env ────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const JWT_ISSUER = process.env.JWT_ISSUER || 'torrinco';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'torrinco-users';
const JWT_ALGORITHM = 'HS256';

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET não definido! O servidor não deve iniciar em produção.');
}

console.log('✅ JWT module loaded');
console.log('✅ JWT_SECRET exists:', !!JWT_SECRET);
console.log('✅ ACCESS_TOKEN_EXPIRES_IN:', ACCESS_TOKEN_EXPIRES_IN);
console.log('✅ REFRESH_TOKEN_EXPIRES_IN:', REFRESH_TOKEN_EXPIRES_IN);
console.log('✅ JWT_ISSUER:', JWT_ISSUER);
console.log('✅ JWT_AUDIENCE:', JWT_AUDIENCE);

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

/** Opções de assinatura compartilhadas (algoritmo, issuer, audience). */
const signOptions = {
  algorithm: JWT_ALGORITHM as 'HS256',
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

export const generateAccessToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(payload, JWT_SECRET, { ...signOptions, expiresIn: ACCESS_TOKEN_EXPIRES_IN as any });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  // jti garante unicidade mesmo para tokens gerados no mesmo segundo.
  return sign({ ...payload, jti: crypto.randomUUID() }, JWT_SECRET, { ...signOptions, expiresIn: REFRESH_TOKEN_EXPIRES_IN as any });
};

export const generateToken = (payload: JwtPayload, expiresIn: string | number = REFRESH_TOKEN_EXPIRES_IN): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(payload, JWT_SECRET, { ...signOptions, expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const decoded = verify(token, JWT_SECRET, {
    ignoreExpiration: false,
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
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
  try {
    await assertAccountAccess(accountId);
    return true;
  } catch (error: any) {
    if (error?.statusCode === 403) return false;
    throw error;
  }
}

/** Invalida o cache de status de conta para uma conta específica. */
export function invalidateAccountStatusCache(accountId: number): void {
  accountStatusCache.delete(accountId);
}

/** Invalida todo o cache de status de contas. */
export function invalidateAllAccountStatusCache(): void {
  accountStatusCache.clear();
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

  let payload: JwtPayload;
  try {
    payload = verifyToken(token);
    req.userId = payload.userId;
    req.accountId = payload.accountId;
    req.userRole = payload.userRole;
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  // Verifica status da conta: contas canceladas/blocked são bloqueadas.
  // Em caso de erro de DB, falha de forma SEGURA (fail-closed): nega acesso.
  isAccountActive(req.accountId!)
    .then((active) => {
      if (!active) {
        return res.status(403).json({ error: 'Conta inativa ou bloqueada' });
      }
      next();
    })
    .catch((error) => {
      console.error('[auth] Falha ao checar status da conta (fail-closed):', error);
      // FAIL-CLOSED: se não conseguimos verificar o status, negamos acesso.
      return res.status(503).json({ error: 'Não foi possível verificar o status da conta' });
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
