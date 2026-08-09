import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { jobLog } from '../lib/job-log.js';

export const schedulerOwnerId = `${process.env.HOSTNAME ?? 'local'}:${process.pid}:${crypto.randomUUID()}`;
const health = { started: false, lastTickAt: null as Date|null, lastSuccessAt: null as Date|null, lastErrorAt: null as Date|null };
export function markSchedulerStarted() { health.started = true; health.lastTickAt = new Date(); }
export function schedulerHealthSnapshot() { return { ...health }; }

export async function acquireLease(jobName: string, leaseMs = 55_000, ownerId = schedulerOwnerId): Promise<boolean> {
  const until = new Date(Date.now() + leaseMs);
  await prisma.$executeRaw`
    INSERT INTO scheduler_locks (job_name, owner_id, locked_until, updated_at)
    VALUES (${jobName}, ${ownerId}, ${until}, NOW(3))
    ON DUPLICATE KEY UPDATE
      owner_id = IF(locked_until < NOW(3) OR owner_id = VALUES(owner_id), VALUES(owner_id), owner_id),
      locked_until = IF(locked_until < NOW(3) OR owner_id = VALUES(owner_id), VALUES(locked_until), locked_until),
      updated_at = IF(owner_id = VALUES(owner_id), NOW(3), updated_at)`;
  const rows = await prisma.scheduler_locks.findMany({ where: { job_name: jobName, owner_id: ownerId, locked_until: { gt: new Date() } }, take: 1 });
  return rows.length === 1;
}

export async function releaseLease(jobName: string, ownerId = schedulerOwnerId) {
  await prisma.scheduler_locks.updateMany({ where: { job_name: jobName, owner_id: ownerId }, data: { locked_until: new Date(0) } });
}

export async function runIdempotentJob<T>(jobName: string, executionKey: string, work: () => Promise<T>, leaseMs = 55_000): Promise<{executed:boolean;result?:T}> {
  health.lastTickAt = new Date();
  if (!(await acquireLease(jobName, leaseMs))) return { executed: false };
  const start = Date.now();
  let run: any;
  try {
    try { run = await prisma.scheduler_runs.create({ data: { job_name: jobName, execution_key: executionKey, owner_id: schedulerOwnerId } }); }
    catch (error: any) { if (error?.code === 'P2002') return { executed: false }; throw error; }
    const result = await work();
    const duration = Date.now() - start;
    await prisma.scheduler_runs.update({ where: { id: run.id }, data: { status: 'succeeded', finished_at: new Date(), duration_ms: duration, result: result as any } });
    health.lastSuccessAt = new Date();
    jobLog('info', { job: jobName, execution_key: executionKey, duration_ms: duration, result: 'succeeded' });
    return { executed: true, result };
  } catch (error: any) {
    const duration = Date.now() - start; health.lastErrorAt = new Date();
    if (run) await prisma.scheduler_runs.update({ where: { id: run.id }, data: { status: 'failed', finished_at: new Date(), duration_ms: duration, error_message: String(error?.message ?? error).slice(0, 2000) } });
    jobLog('error', { job: jobName, execution_key: executionKey, duration_ms: duration, result: 'failed', error: String(error?.message ?? error) });
    throw error;
  } finally { await releaseLease(jobName).catch(() => undefined); }
}

export function minuteExecutionKey(date = new Date()) { return date.toISOString().slice(0, 16); }
export function dayExecutionKey(date = new Date(), timezone = 'America/Sao_Paulo') { return date.toLocaleDateString('en-CA', { timeZone: timezone }); }
