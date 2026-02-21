import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

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

export const generateToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const decoded = verify(token, JWT_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as JwtPayload;
};

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
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
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
