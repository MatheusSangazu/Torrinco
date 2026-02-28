import { prisma } from '../lib/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../middleware/jwt.js';
export class RefreshTokenService {
    static async createRefreshToken(userId, accountId, userRole) {
        try {
            const cleanPayload = { userId, accountId, userRole };
            const token = generateRefreshToken(cleanPayload);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            const result = await prisma.refresh_tokens.create({
                data: {
                    token,
                    user_id: userId,
                    expires_at: expiresAt
                }
            });
            return token;
        }
        catch (error) {
            console.error('❌ Erro em createRefreshToken:', error);
            throw error;
        }
    }
    static async verifyRefreshToken(token) {
        try {
            const payload = verifyToken(token);
            const storedToken = await prisma.refresh_tokens.findUnique({
                where: { token },
                include: { users: true }
            });
            if (!storedToken) {
                return { valid: false, error: 'Refresh token não encontrado' };
            }
            if (storedToken.revoked_at) {
                return { valid: false, error: 'Refresh token revogado' };
            }
            if (new Date() > storedToken.expires_at) {
                await prisma.refresh_tokens.update({
                    where: { token },
                    data: { revoked_at: new Date() }
                });
                return { valid: false, error: 'Refresh token expirado' };
            }
            return { valid: true, payload };
        }
        catch (error) {
            console.error('❌ Erro em verifyRefreshToken:', error);
            return { valid: false, error: 'Refresh token inválido' };
        }
    }
    static async revokeRefreshToken(token) {
        await prisma.refresh_tokens.updateMany({
            where: { token, revoked_at: null },
            data: { revoked_at: new Date() }
        });
    }
    static async revokeAllUserTokens(userId) {
        await prisma.refresh_tokens.updateMany({
            where: { user_id: userId, revoked_at: null },
            data: { revoked_at: new Date() }
        });
    }
    static async rotateRefreshToken(oldToken) {
        const { valid, payload, error } = await this.verifyRefreshToken(oldToken);
        if (!valid || !payload) {
            throw new Error(error || 'Refresh token inválido');
        }
        await this.revokeRefreshToken(oldToken);
        const cleanPayload = { userId: payload.userId, accountId: payload.accountId, userRole: payload.userRole };
        const newAccessToken = generateAccessToken(cleanPayload);
        const newRefreshToken = await this.createRefreshToken(payload.userId, payload.accountId, payload.userRole);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    static async cleanupExpiredTokens() {
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
//# sourceMappingURL=refresh-token.service.js.map