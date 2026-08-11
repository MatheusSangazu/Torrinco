import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const distribution = await prisma.$queryRaw<Array<Record<string, bigint | string | null>>>`
  SELECT
    COUNT(*) AS total,
    SUM(TIME(transaction_date) = '00:00:00') AS at_midnight,
    SUM(TIME(transaction_date) = '12:00:00') AS at_noon,
    SUM(TIME(transaction_date) NOT IN ('00:00:00', '12:00:00')) AS at_other_time,
    MIN(transaction_date) AS oldest,
    MAX(transaction_date) AS newest
  FROM transactions
`;

const importedMismatches = await prisma.$queryRaw<Array<Record<string, bigint>>>`
  SELECT COUNT(*) AS mismatches
  FROM financial_import_items item
  INNER JOIN transactions tx ON tx.id = item.imported_transaction_id
  WHERE DATE(tx.transaction_date) <> item.transaction_date
`;

const recurringMismatches = await prisma.$queryRaw<Array<Record<string, bigint>>>`
  SELECT COUNT(*) AS mismatches
  FROM transactions
  WHERE recurring_occurrence_at IS NOT NULL
    AND DATE(recurring_occurrence_at) <> DATE(transaction_date)
`;

const recurringCivilDuplicates = await prisma.$queryRaw<Array<Record<string, bigint>>>`
  SELECT COUNT(*) AS duplicate_groups
  FROM (
    SELECT recurring_transaction_id, DATE(recurring_occurrence_at)
    FROM transactions
    WHERE recurring_transaction_id IS NOT NULL
      AND recurring_occurrence_at IS NOT NULL
    GROUP BY recurring_transaction_id, DATE(recurring_occurrence_at)
    HAVING COUNT(*) > 1
  ) duplicates
`;

const stringify = (_key: string, value: unknown) => typeof value === 'bigint' ? value.toString() : value;
console.log(JSON.stringify({
  distribution: distribution[0],
  importedMismatches: importedMismatches[0],
  recurringMismatches: recurringMismatches[0],
  recurringCivilDuplicates: recurringCivilDuplicates[0],
}, stringify, 2));
await prisma.$disconnect();
