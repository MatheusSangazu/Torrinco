import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
declare global {
    namespace Express {
        interface Request {
            prisma?: typeof prisma;
        }
    }
}
export declare const prismaMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map