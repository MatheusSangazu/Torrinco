import type { Response, NextFunction } from 'express';
import type { JwtRequest } from './jwt.js';
import { assertFeature, type PlanFeature } from '../services/subscription.service.js';
export const requireFeature = (feature: PlanFeature) => (req: JwtRequest, res: Response, next: NextFunction) => {
  assertFeature(req.accountId!, feature).then(() => next()).catch((error: any) =>
    res.status(error.statusCode ?? 500).json({ error: 'Funcionalidade nao incluida no plano', code: error.code, feature }));
};
