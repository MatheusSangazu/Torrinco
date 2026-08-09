import { prisma } from '../lib/prisma.js';
import { EvolutionService } from './evolution.service.js';
import { assertAccountAccess } from './subscription.service.js';
import { schedulerOwnerId } from './job-runtime.service.js';
import { jobLog, maskedAccount } from '../lib/job-log.js';

export async function enqueueReminder(input: {sourceType:string;sourceId:string;occurrenceKey:string;accountId:number;userId:number;destination:string;message:string}) {
  try { return await prisma.reminder_deliveries.create({ data: { source_type: input.sourceType, source_id: input.sourceId, occurrence_key: input.occurrenceKey, account_id: input.accountId, user_id: input.userId, destination: input.destination, message: input.message } }); }
  catch (error:any) { if (error?.code === 'P2002') return null; throw error; }
}

function permanentError(error:any) { const code = error?.response?.status ?? error?.statusCode ?? error?.status; return code === 400 || code === 401 || code === 403 || code === 404; }
export function retryDelayMs(attempt:number) { return Math.min(60 * 60_000, 30_000 * 2 ** Math.max(0, attempt - 1)); }

export async function processReminderQueue(limit = 50, now = new Date()) {
  const candidates = await prisma.reminder_deliveries.findMany({ where: { status: { in: ['pending','retry'] }, next_attempt_at: { lte: now }, OR: [{ locked_until: null }, { locked_until: { lt: now } }] }, orderBy: { next_attempt_at: 'asc' }, take: limit });
  const results = { sent: 0, retry: 0, permanentFailure: 0, skipped: 0 };
  for (const item of candidates) {
    const leaseUntil = new Date(Date.now() + 60_000);
    const claimed = await prisma.reminder_deliveries.updateMany({ where: { id: item.id, status: { in: ['pending','retry'] }, OR: [{ locked_until: null }, { locked_until: { lt: now } }] }, data: { status: 'processing', locked_by: schedulerOwnerId, locked_until: leaseUntil, attempts: { increment: 1 } } });
    if (claimed.count !== 1) { results.skipped++; continue; }
    const started = Date.now();
    try {
      await assertAccountAccess(item.account_id);
      const user = await prisma.users.findFirst({ where: { id: item.user_id, account_id: item.account_id, status: 'active' }, select: { id: true } });
      if (!user) throw Object.assign(new Error('USER_INACTIVE'), { permanent: true });
      const providerResult = await EvolutionService.sendText(item.destination, item.message);
      await prisma.reminder_deliveries.update({ where: { id: item.id }, data: { status: 'sent', sent_at: new Date(), locked_by: null, locked_until: null, last_error: null, provider_result: providerResult as any } });
      results.sent++; jobLog('info', { job: 'reminder_delivery', account: maskedAccount(item.account_id), duration_ms: Date.now()-started, result: 'sent' });
    } catch (error:any) {
      const attempts = item.attempts + 1; const permanent = error?.permanent || permanentError(error) || attempts >= item.max_attempts;
      await prisma.reminder_deliveries.update({ where: { id: item.id }, data: permanent
        ? { status: 'permanent_failure', failed_at: new Date(), locked_by: null, locked_until: null, last_error: String(error?.message ?? error).slice(0,2000) }
        : { status: 'retry', next_attempt_at: new Date(Date.now()+retryDelayMs(attempts)), locked_by: null, locked_until: null, last_error: String(error?.message ?? error).slice(0,2000) } });
      permanent ? results.permanentFailure++ : results.retry++;
      jobLog('error', { job: 'reminder_delivery', account: maskedAccount(item.account_id), duration_ms: Date.now()-started, result: permanent?'permanent_failure':'retry', attempt: attempts });
    }
  }
  return results;
}
