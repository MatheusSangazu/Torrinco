import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  accountId?: number;
  userRole?: string;
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const phoneNumber = req.headers['x-phone-number'] as string;
  
  if (!phoneNumber) {
    return res.status(401).json({ error: 'Phone number required' });
  }

  const prisma = (req as any).prisma;
  
  prisma.users.findUnique({
    where: { phone_number: phoneNumber }
  }).then((users: any) => {
    if (!users) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (users.status !== 'active') {
      return res.status(403).json({ error: 'User account is not active' });
    }

    (req as AuthRequest).userId = users.id;
    (req as AuthRequest).accountId = users.account_id;
    (req as AuthRequest).userRole = users.role;

    next();
  }).catch((error: any) => {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
