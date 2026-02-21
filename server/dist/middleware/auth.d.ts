import type { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: number;
    accountId?: number;
    userRole?: string;
}
export declare const authenticateUser: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map