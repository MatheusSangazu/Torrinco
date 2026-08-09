import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
import { changeSubscriptionStatus, getSubscriptionOverview } from '../services/subscription.service.js';
export class SubscriptionController {
  static async overview(req: JwtRequest, res: Response, next: NextFunction) { try { res.json(await getSubscriptionOverview(req.accountId!)); } catch (e) { next(e); } }
  static async cancel(req: JwtRequest, res: Response, next: NextFunction) {
    try { if (req.userRole !== 'owner' && req.userRole !== 'admin') return res.status(403).json({ error: 'Admin requerido' }); res.json({ account: await changeSubscriptionStatus(req.accountId!, 'cancelled', 'cancelled_by_account_admin') }); } catch (e) { next(e); }
  }
  static async reactivate(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      if (req.userRole !== 'owner' && req.userRole !== 'admin') return res.status(403).json({ error: 'Admin requerido' });
      const o = await getSubscriptionOverview(req.accountId!);
      const until = o.dates.currentPeriodEndsAt ?? o.dates.trialEndsAt;
      if (!until || new Date(until).getTime() <= Date.now()) return res.status(409).json({ error: 'Pagamento necessario', code: 'PAYMENT_REQUIRED' });
      const status = o.dates.trialEndsAt && !o.dates.currentPeriodEndsAt ? 'trial' : 'active';
      res.json({ account: await changeSubscriptionStatus(req.accountId!, status, 'reactivated_by_account_admin') });
    } catch (e) { next(e); }
  }
}
