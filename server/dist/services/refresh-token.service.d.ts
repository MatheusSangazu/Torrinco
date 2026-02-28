import type { JwtPayload } from '../middleware/jwt.js';
export declare class RefreshTokenService {
    static createRefreshToken(userId: number, accountId: number, userRole: string): Promise<string>;
    static verifyRefreshToken(token: string): Promise<{
        valid: boolean;
        payload?: JwtPayload;
        error?: string;
    }>;
    static revokeRefreshToken(token: string): Promise<void>;
    static revokeAllUserTokens(userId: number): Promise<void>;
    static rotateRefreshToken(oldToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static cleanupExpiredTokens(): Promise<void>;
}
//# sourceMappingURL=refresh-token.service.d.ts.map