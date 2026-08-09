/**
 * Testes de fortalecimento de autenticação.
 *
 * Cobre:
 *  - JWT com algorithm/issuer/audience explícitos.
 *  - Refresh token rotation.
 *  - Detecção de reutilização (reuse) → revogação de família.
 *  - Hash SHA-256 do refresh token (texto plano nunca persistido).
 *  - Logout revoga sessão.
 *  - Usuário inativo / conta cancelada bloqueia acesso.
 *  - Exclusão de conta revoga sessões.
 */
import { describe, it, expect, vi } from 'vitest';
import { sign as jwtSign } from 'jsonwebtoken';
import crypto from 'node:crypto';

// ── vi.hoisted: cria o mock ANTES de qualquer import do código real ──
const { prismaMock, db } = vi.hoisted(() => {
  const refreshTokens: any[] = [];
  const users = [
    { id: 1, account_id: 1, name: 'Admin A', role: 'admin', status: 'active', phone_number: '5511900000001', password_hash: '$2b$10$x', accounts: { id: 1, status: 'active' } },
    { id: 2, account_id: 2, name: 'Admin B', role: 'admin', status: 'active', phone_number: '5512900000002', password_hash: '$2b$10$x', accounts: { id: 2, status: 'active' } },
  ];
  const accounts = [
    { id: 1, status: 'active' },
    { id: 2, status: 'active' },
  ];

  function matchRec(rec: any, where: any): boolean {
    if (!where) return true;
    for (const [key, val] of Object.entries(where)) {
      if (val === undefined || val === null) continue;
      if (rec[key] !== val) return false;
    }
    return true;
  }

  function mockTable(table: any[]) {
    return {
      findUnique: vi.fn(async ({ where }: any) => {
        const base = table.find(r => matchRec(r, where));
        if (base && table === refreshTokens) {
          const user = users.find(u => u.id === base.user_id);
          return { ...base, users: user ? { ...user, accounts: accounts.find(a => a.id === user.account_id) } : null };
        }
        return base ?? null;
      }),
      findFirst: vi.fn(async ({ where }: any) => table.find(r => matchRec(r, where)) ?? null),
      findMany: vi.fn(async ({ where }: any) => table.filter(r => matchRec(r, where))),
      create: vi.fn(async ({ data }: any) => { const r = { id: table.length + 1, ...data }; table.push(r); return r; }),
      update: vi.fn(async ({ where, data }: any) => {
        const i = table.findIndex(r => matchRec(r, where));
        if (i === -1) throw Object.assign(new Error('P2025'), { code: 'P2025' });
        table[i] = { ...table[i], ...data };
        return table[i];
      }),
      delete: vi.fn(async ({ where }: any) => {
        const i = table.findIndex(r => matchRec(r, where));
        if (i === -1) throw Object.assign(new Error('P2025'), { code: 'P2025' });
        return table.splice(i, 1)[0];
      }),
      count: vi.fn(async ({ where }: any) => table.filter(r => matchRec(r, where)).length),
      updateMany: vi.fn(async ({ where, data }: any) => {
        let c = 0;
        for (let i = 0; i < table.length; i++) {
          if (matchRec(table[i], where)) { table[i] = { ...table[i], ...data }; c++; }
        }
        return { count: c };
      }),
    };
  }

  const prismaMock = {
    users: mockTable(users),
    accounts: mockTable(accounts),
    refresh_tokens: mockTable(refreshTokens),
    $disconnect: vi.fn(async () => {}),
  };

  return { prismaMock, db: { refreshTokens, users, accounts } };
});

// ── Mock Prisma module ───────────────────────────────────────────
vi.mock('../src/lib/prisma.js', () => ({ prisma: prismaMock }));

// Set env vars BEFORE importing jwt module.
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-xxxxxx';
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.JWT_ISSUER = 'torrinco-test';
process.env.JWT_AUDIENCE = 'torrinco-users-test';

// Import AFTER mock + env.
import { generateAccessToken, generateRefreshToken, verifyToken } from '../src/middleware/jwt.js';
import { RefreshTokenService } from '../src/services/refresh-token.service.js';

const PAYLOAD = { userId: 1, accountId: 1, userRole: 'admin' };

function hash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─────────────────────────────────────────────────────────────────

describe('1. JWT — algorithm, issuer, audience', () => {
  it('gera access token válido com issuer e audience', () => {
    const token = generateAccessToken(PAYLOAD);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(1);
    expect(decoded.accountId).toBe(1);
    expect(decoded.userRole).toBe('admin');
  });

  it('rejeita token sem issuer (forjado)', () => {
    const forged = jwtSign(PAYLOAD, process.env.JWT_SECRET!, { expiresIn: '1h', algorithm: 'HS256' });
    expect(() => verifyToken(forged)).toThrow();
  });

  it('rejeita token sem audience (forjado)', () => {
    const forged = jwtSign(PAYLOAD, process.env.JWT_SECRET!, { expiresIn: '1h', algorithm: 'HS256', issuer: 'torrinco-test' });
    expect(() => verifyToken(forged)).toThrow();
  });

  it('rejeita token com secret errado', () => {
    const forged = jwtSign(PAYLOAD, 'wrong-secret', { expiresIn: '1h', algorithm: 'HS256', issuer: 'torrinco-test', audience: 'torrinco-users-test' });
    expect(() => verifyToken(forged)).toThrow();
  });
});

describe('2. Refresh Token — criação e hashing', () => {
  it('cria refresh token e armazena apenas o hash', async () => {
    const token = await RefreshTokenService.createRefreshToken(1, 1, 'admin');
    expect(token).toBeTruthy();

    const stored = db.refreshTokens.find(r => r.token_hash === hash(token));
    expect(stored).toBeTruthy();
    expect(stored.token).toBe('');
    expect(stored.token_hash).not.toBe(token);
  });

  it('verifica refresh token válido', async () => {
    const token = await RefreshTokenService.createRefreshToken(1, 1, 'admin');
    const result = await RefreshTokenService.verifyRefreshToken(token);
    expect(result.valid).toBe(true);
    expect(result.payload?.userId).toBe(1);
  });

  it('rejeita refresh token inexistente', async () => {
    const result = await RefreshTokenService.verifyRefreshToken('nonexistent-token');
    expect(result.valid).toBe(false);
  });
});

describe('3. Refresh Token — rotação', () => {
  it('rotaciona token: antigo revogado, novo emitido', async () => {
    const oldToken = await RefreshTokenService.createRefreshToken(1, 1, 'admin');

    const { accessToken, refreshToken } = await RefreshTokenService.rotateRefreshToken(oldToken);

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    expect(refreshToken).not.toBe(oldToken);

    // Verificar o NOVO token ANTES do velho: verificar o velho dispara
    // revokeFamily() que também revoga o novo (mesma família).
    const newResult = await RefreshTokenService.verifyRefreshToken(refreshToken);
    expect(newResult.valid).toBe(true);

    const oldResult = await RefreshTokenService.verifyRefreshToken(oldToken);
    expect(oldResult.valid).toBe(false);
  });
});

describe('4. Refresh Token — detecção de reutilização', () => {
  it('usar token já rotacionado revoga TODA a família', async () => {
    const token1 = await RefreshTokenService.createRefreshToken(1, 1, 'admin');
    const { refreshToken: token2 } = await RefreshTokenService.rotateRefreshToken(token1);

    // token1 já foi rotacionado. Tentar rotacionar novamente deve falhar.
    await expect(RefreshTokenService.rotateRefreshToken(token1)).rejects.toThrow();

    // token2 também deve estar revogado (família inteira).
    const result2 = await RefreshTokenService.verifyRefreshToken(token2);
    expect(result2.valid).toBe(false);
  });

  it('token expirado não pode ser rotacionado', async () => {
    const token = await RefreshTokenService.createRefreshToken(1, 1, 'admin');
    const stored = db.refreshTokens.find(r => r.token_hash === hash(token));
    if (stored) stored.expires_at = new Date(Date.now() - 1000);

    await expect(RefreshTokenService.rotateRefreshToken(token)).rejects.toThrow();
  });
});

describe('5. Logout — revoga sessão', () => {
  it('logout revoga o refresh token', async () => {
    const token = await RefreshTokenService.createRefreshToken(1, 1, 'admin');
    await RefreshTokenService.revokeRefreshToken(token);

    const result = await RefreshTokenService.verifyRefreshToken(token);
    expect(result.valid).toBe(false);
  });

  it('revokeAllUserTokens revoga todos os tokens do usuário', async () => {
    await RefreshTokenService.createRefreshToken(2, 2, 'admin');
    await RefreshTokenService.createRefreshToken(2, 2, 'admin');

    await RefreshTokenService.revokeAllUserTokens(2);

    const active = db.refreshTokens.filter(r => r.user_id === 2 && r.revoked_at === null);
    expect(active.length).toBe(0);
  });
});

describe('6. Conta inativa — bloqueia acesso', () => {
  it('refresh token de conta cancelada é rejeitado', async () => {
    const token = await RefreshTokenService.createRefreshToken(1, 1, 'admin');

    // O mock findUnique busca o status da conta no array accounts, não em user.accounts.
    const account = db.accounts.find(a => a.id === 1)!;
    account.status = 'cancelled';

    const result = await RefreshTokenService.verifyRefreshToken(token);
    expect(result.valid).toBe(false);

    account.status = 'active';
  });
});

describe('7. Cookie helpers', () => {
  it('setRefreshTokenCookie define cookie HttpOnly', async () => {
    const { setRefreshTokenCookie, REFRESH_COOKIE_NAME } = await import('../src/lib/cookie.js');
    const mockRes = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    };

    setRefreshTokenCookie(mockRes as any, 'test-token');

    expect(mockRes.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      'test-token',
      expect.objectContaining({
        httpOnly: true,
        maxAge: expect.any(Number),
        path: '/api/auth',
      })
    );
  });
});
