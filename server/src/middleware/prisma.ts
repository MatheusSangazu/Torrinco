import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

declare global {
  namespace Express {
    interface Request {
      prisma?: typeof prisma;
    }
  }
}

export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.prisma = prisma;
  next();
};

export default prisma;