import type { Response } from 'express';

/**
 * Helpers para o cookie HttpOnly do refresh token.
 *
 * Em produção: Secure + SameSite=strict.
 * Em desenvolvimento: sem Secure, SameSite=strict (funciona em HTTP local).
 */

const COOKIE_NAME = 'rt';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

const isProduction = process.env.NODE_ENV === 'production';

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/api/auth',
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/api/auth',
  });
}

export function getRefreshTokenFromCookies(req: { cookies: Record<string, string | undefined> }): string | null {
  return req.cookies?.[COOKIE_NAME] ?? null;
}

export const REFRESH_COOKIE_NAME = COOKIE_NAME;
