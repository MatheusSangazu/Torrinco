import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../middleware/jwt.js';
import type { JwtPayload } from '../middleware/jwt.js';

/**
 * Serviço de refresh tokens com:
 *  - Hash SHA-256 armazenado no banco (token em texto plano nunca é persistido).
 *  - Rotação automática a cada uso.
 *  - Detecção de reutilização: se um token já rotacionado é apresentado novamente,
 *    TODA a família é revogada (proteção contra token roubado).
 */

/** Hash SHA-256 de um token. */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Gera um ID de família aleatório. */
function generateFamilyId(): string {
  return crypto.randomUUID();
}

export class RefreshTokenReuseError extends Error {
  constructor() {
    super('Reutilização de refresh token detectada. Todas as sessões foram revogadas.');
    this.name = 'RefreshTokenReuseError';
  }
}

export class RefreshTokenService {
  /**
   * Cria um novo refresh token. Retorna o token em texto plano (para enviar
   * ao cliente) e armazena apenas o hash no banco.
   */
  static async createRefreshToken(
    userId: number,
    accountId: number,
    userRole: string,
    familyId?: string,
  ): Promise<string> {
    const cleanPayload: JwtPayload = { userId, accountId, userRole };
    const token = generateRefreshToken(cleanPayload);
    const tokenHash = hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refresh_tokens.create({
      data: {
        token_hash: tokenHash,
        token: '', // não persistir o token em texto plano
        family_id: familyId ?? generateFamilyId(),
        user_id: userId,
        expires_at: expiresAt,
      },
    });
    return token;
  }

  /**
   * Verifica se um refresh token é válido:
   *  - Assinatura JWT correta.
   *  - Hash existe no banco.
   *  - Não está revogado.
   *  - Não está expirado.
   *  - Conta ativa.
   */
  static async verifyRefreshToken(token: string): Promise<{ valid: boolean; payload?: JwtPayload; error?: string; tokenHash?: string }> {
    try {
      const payload = verifyToken(token);
      const tokenHash = hashToken(token);
      const storedToken = await prisma.refresh_tokens.findUnique({
        where: { token_hash: tokenHash },
        include: { users: { include: { accounts: true } } }
      });

      if (!storedToken) {
        return { valid: false, error: 'Refresh token não encontrado' };
      }

      // Contas canceladas/blocked não renovam.
      const acctStatus = storedToken.users?.accounts?.status;
      if (acctStatus && acctStatus !== 'active' && acctStatus !== 'trial') {
        await this.revokeRefreshToken(token);
        return { valid: false, error: 'Conta inativa ou bloqueada' };
      }

      if (storedToken.revoked_at) {
        // DETECÇÃO DE REUTILIZAÇÃO: token já revogado foi apresentado.
        // Revoga TODA a família para proteger a sessão.
        await this.revokeFamily(storedToken.family_id);
        return { valid: false, error: 'Refresh token revogado', tokenHash };
      }

      if (new Date() > storedToken.expires_at) {
        await prisma.refresh_tokens.update({
          where: { token_hash: tokenHash },
          data: { revoked_at: new Date() }
        });
        return { valid: false, error: 'Refresh token expirado' };
      }

      return { valid: true, payload, tokenHash };
    } catch (error) {
      console.error('❌ Erro em verifyRefreshToken:', error);
      return { valid: false, error: 'Refresh token inválido' };
    }
  }

  /** Revoga um único token pelo seu hash. */
  static async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    await prisma.refresh_tokens.updateMany({
      where: { token_hash: tokenHash, revoked_at: null },
      data: { revoked_at: new Date() }
    });
  }

  /** Revoga TODOS os tokens de uma família (para detecção de reutilização). */
  static async revokeFamily(familyId: string): Promise<void> {
    await prisma.refresh_tokens.updateMany({
      where: { family_id: familyId, revoked_at: null },
      data: { revoked_at: new Date() }
    });
  }

  /** Revoga todos os tokens ativos de um usuário. */
  static async revokeAllUserTokens(userId: number): Promise<void> {
    await prisma.refresh_tokens.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() }
    });
  }

  /**
   * Rotação: verifica → revoga token atual → emite novo par.
   * O novo refresh token pertence à MESMA família do anterior.
   *
   * Se o token apresentado já foi revogado (reutilização), revoga toda a família
   * e lança RefreshTokenReuseError.
   */
  static async rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { valid, payload, error } = await this.verifyRefreshToken(oldToken);

    if (!valid || !payload) {
      throw new Error(error || 'Refresh token inválido');
    }

    // Pegar o family_id do token atual antes de revogar.
    const oldHash = hashToken(oldToken);
    const storedToken = await prisma.refresh_tokens.findUnique({
      where: { token_hash: oldHash },
      select: { family_id: true, revoked_at: true }
    });

    // Se o token já estava revogado, verifyRefreshToken já revogou a família.
    if (storedToken?.revoked_at) {
      throw new RefreshTokenReuseError();
    }

    // Revoga o token atual.
    await this.revokeRefreshToken(oldToken);

    // Cria novo token na MESMA família.
    const cleanPayload: JwtPayload = {
      userId: payload.userId,
      accountId: payload.accountId,
      userRole: payload.userRole,
    };
    const newAccessToken = generateAccessToken(cleanPayload);
    const newRefreshToken = await this.createRefreshToken(
      payload.userId, payload.accountId, payload.userRole,
      storedToken?.family_id,
    );
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await prisma.refresh_tokens.updateMany({
      where: {
        expires_at: { lt: now },
        revoked_at: null
      },
      data: { revoked_at: now }
    });
  }
}
