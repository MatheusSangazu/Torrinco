import type { Request, Response, NextFunction } from 'express';
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
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const generateToken: (payload: JwtPayload, expiresIn?: string | number) => string;
export declare const verifyToken: (token: string) => JwtPayload;
export declare const authenticateJwt: (req: JwtRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: JwtRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=jwt.d.ts.map