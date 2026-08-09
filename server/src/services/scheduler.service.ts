import { prisma } from '../lib/prisma.js';
import { materializeDue } from './recurring.service.js';
import { syncBillCycle } from './billing.service.js';
import { assertAccountAccess } from './subscription.service.js';
import { jobLog, maskedAccount } from '../lib/job-log.js';
import { runPrivacyRetentionJob } from './retention.service.js';

export async function runRecurringJob() {
  const users = await prisma.users.findMany({ where: { status: 'active' }, select: { id: true, account_id: true } });
  const summary: { userId: number; created: number }[] = [];
  for (const user of users) {
    const started = Date.now();
    try {
      await assertAccountAccess(user.account_id);
      const created = await materializeDue(user.id);
      if (created.length) summary.push({ userId: user.id, created: created.length });
      jobLog('info', { job: 'recurring', account: maskedAccount(user.account_id), duration_ms: Date.now()-started, result: 'succeeded', created: created.length });
    } catch (error: any) {
      jobLog('error', { job: 'recurring', account: maskedAccount(user.account_id), duration_ms: Date.now()-started, result: error?.statusCode===403?'ineligible':'failed', error: String(error?.message ?? error) });
    }
  }
  return summary;
}

export async function runBillCycleJob() {
  const cards = await prisma.financial_entities.findMany({ where: { type: 'credit_card' }, select: { id: true, account_id: true, created_by_user_id: true } });
  const summary: { cardId: number; synced: boolean }[] = [];
  for (const card of cards) {
    const started = Date.now();
    try {
      await assertAccountAccess(card.account_id);
      const creator = card.created_by_user_id ? await prisma.users.findFirst({ where: { id: card.created_by_user_id, account_id: card.account_id, status: 'active' }, select: { id: true } }) : null;
      const user = creator ?? await prisma.users.findFirst({ where: { account_id: card.account_id, status: 'active' }, orderBy: { id: 'asc' }, select: { id: true } });
      if (!user) throw new Error('NO_ACTIVE_USER_FOR_CARD');
      await syncBillCycle(card.id, user.id);
      summary.push({ cardId: card.id, synced: true });
      jobLog('info', { job: 'bill_cycle', account: maskedAccount(card.account_id), duration_ms: Date.now()-started, result: 'succeeded' });
    } catch (error: any) {
      summary.push({ cardId: card.id, synced: false });
      jobLog('error', { job: 'bill_cycle', account: maskedAccount(card.account_id), duration_ms: Date.now()-started, result: error?.statusCode===403?'ineligible':'failed', error: String(error?.message ?? error) });
    }
  }
  return summary;
}

export async function runDailyJobs() { return { recurring: await runRecurringJob(), bills: await runBillCycleJob(), privacy: await runPrivacyRetentionJob() }; }
