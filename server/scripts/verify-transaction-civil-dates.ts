import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const [integrity, triggers] = await Promise.all([
  prisma.$queryRaw<Array<Record<string, bigint>>>`
    SELECT
      SUM(transaction_date_civil IS NULL) AS missing_civil_dates,
      SUM(transaction_date_civil <> DATE(transaction_date)) AS transaction_mismatches,
      SUM(
        recurring_occurrence_at IS NOT NULL
        AND recurring_occurrence_date <> DATE(recurring_occurrence_at)
      ) AS recurring_mismatches
    FROM transactions
  `,
  prisma.$queryRaw<Array<{ TRIGGER_NAME: string }>>`
    SELECT TRIGGER_NAME
    FROM information_schema.TRIGGERS
    WHERE TRIGGER_SCHEMA = DATABASE()
      AND TRIGGER_NAME IN ('transactions_civil_date_bi', 'transactions_civil_date_bu')
    ORDER BY TRIGGER_NAME
  `,
]);

const result = {
  integrity: Object.fromEntries(Object.entries(integrity[0] ?? {}).map(([key, value]) => [key, String(value ?? 0)])),
  triggers: triggers.map(trigger => trigger.TRIGGER_NAME),
};
console.log(JSON.stringify(result, null, 2));

const valid = result.integrity.missing_civil_dates === '0'
  && result.integrity.transaction_mismatches === '0'
  && result.integrity.recurring_mismatches === '0'
  && result.triggers.length === 2;

await prisma.$disconnect();
if (!valid) process.exitCode = 1;
