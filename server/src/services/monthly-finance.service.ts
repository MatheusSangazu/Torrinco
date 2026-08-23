import { prisma } from '../lib/prisma.js';
import {
  aggregateFinancialPeriod,
  type FinancialTransactionLike,
  type RecurringTransactionLike,
} from '../lib/monthly-finance-engine.js';
import { buildMonthlyDetail, monthStatus, serializeTotals } from '../lib/monthly-overview.js';

function transactionLookback(start: Date): Date {
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 2, 1));
}

const transactionInclude = {
  financial_entities: true,
  categories: true,
  income_sources: true,
  purchase_installments: true,
  card_bill_payment: true,
  card_bill_paid: true,
} as const;

async function loadFinancialData(userId: number, start: Date, end: Date) {
  const [transactions, recurringTransactions] = await Promise.all([
    prisma.transactions.findMany({
      where: {
        user_id: userId,
        transaction_date: { gte: transactionLookback(start), lte: end },
      },
      include: transactionInclude,
    }),
    prisma.recurring_transactions.findMany({
      where: { user_id: userId, status: 'active', start_date: { lte: end } },
      include: { financial_entities: true, categories: true, income_sources: true },
    }),
  ]);

  return {
    transactions: transactions as unknown as FinancialTransactionLike[],
    recurringTransactions: recurringTransactions as unknown as RecurringTransactionLike[],
  };
}

/** Carrega os dados e delega toda classificação e soma ao motor puro mensal. */
export async function getFinancialPeriod(userId: number, start: Date, end: Date) {
  const { transactions, recurringTransactions } = await loadFinancialData(userId, start, end);

  return aggregateFinancialPeriod({
    transactions,
    recurringTransactions,
    start,
    end,
  });
}

function monthRange(year: number, zeroBasedMonth: number) {
  return {
    start: new Date(Date.UTC(year, zeroBasedMonth, 1)),
    end: new Date(Date.UTC(year, zeroBasedMonth + 1, 0, 23, 59, 59, 999)),
  };
}

/** Retorna os 12 meses usando somente duas consultas, sem N+1 por mês. */
export async function getMonthlyOverview(userId: number, year: number, now = new Date()) {
  const yearStart = monthRange(year, 0).start;
  const yearEnd = monthRange(year, 11).end;
  const data = await loadFinancialData(userId, yearStart, yearEnd);

  const months = Array.from({ length: 12 }, (_, zeroBasedMonth) => {
    const range = monthRange(year, zeroBasedMonth);
    const month = `${year}-${String(zeroBasedMonth + 1).padStart(2, '0')}`;
    const status = monthStatus(month, now);
    const financial = aggregateFinancialPeriod({
      ...data,
      start: range.start,
      end: range.end,
      includeProjected: status !== 'closed',
    });
    return {
      month,
      status,
      ...serializeTotals(financial.totals),
      item_count: financial.items.length,
    };
  });

  return { year, currency: 'BRL' as const, unit: 'cents' as const, months };
}

/** Detalhamento agrupado de um único mês, também carregado em duas consultas. */
export async function getMonthlyOverviewDetail(userId: number, month: string, now = new Date()) {
  const [yearPart, monthPart] = month.split('-');
  const year = Number(yearPart);
  const zeroBasedMonth = Number(monthPart) - 1;
  const range = monthRange(year, zeroBasedMonth);
  const data = await loadFinancialData(userId, range.start, range.end);
  const financial = aggregateFinancialPeriod({
    ...data,
    start: range.start,
    end: range.end,
    includeProjected: monthStatus(month, now) !== 'closed',
  });
  return buildMonthlyDetail(month, financial, now);
}

/** Totais históricos registrados; séries abertas não são projetadas sem horizonte. */
export async function getAllTimeFinancialTotals(userId: number) {
  const transactions = await prisma.transactions.findMany({
    where: { user_id: userId },
    include: transactionInclude,
  });

  return aggregateFinancialPeriod({
    transactions: transactions as unknown as FinancialTransactionLike[],
    includeProjected: false,
  });
}
