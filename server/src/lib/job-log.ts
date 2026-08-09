import crypto from 'node:crypto';
export function maskedAccount(accountId?: number | null) {
  if (!accountId) return undefined;
  return `acc_${crypto.createHash('sha256').update(`torrinco:${accountId}`).digest('hex').slice(0, 10)}`;
}
export function jobLog(level: 'info'|'error', fields: Record<string, unknown>) {
  const line = JSON.stringify({ timestamp: new Date().toISOString(), component: 'scheduler', ...fields });
  (level === 'error' ? console.error : console.log)(line);
}
