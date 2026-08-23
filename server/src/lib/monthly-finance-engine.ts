import { computeBillPeriod } from './card-billing-period.js';
import { endOfDay, startOfDay } from './date-utils.js';
import { toCents, type MoneyInput } from './money.js';
import { projectRecurringTransactions } from './transaction-projection.js';

export interface FinancialEntityLike {
  id?: number;
  type?: string | null;
  name?: string | null;
  closing_day?: number | null;
  due_day?: number | null;
}

export interface FinancialTransactionLike {
  id: number | string;
  amount: MoneyInput;
  type: 'income' | 'expense';
  transaction_date: string | Date;
  deleted_at?: string | Date | null;
  category?: string | null;
  description?: string | null;
  payment_method?: string | null;
  entity_id?: number | null;
  is_recurring?: boolean | null;
  recurring_transaction_id?: number | null;
  recurring_occurrence_at?: string | Date | null;
  recurring_occurrence_date?: string | Date | null;
  installment_id?: number | null;
  financial_entities?: FinancialEntityLike | null;
  card_bill_payment?: unknown | null;
  card_bill_paid?: unknown | null;
  is_projected?: boolean;
  [key: string]: unknown;
}

export interface RecurringTransactionLike {
  id: number;
  amount: MoneyInput;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string | Date;
  payment_method?: string | null;
  entity_id?: number | null;
  financial_entities?: FinancialEntityLike | null;
  [key: string]: unknown;
}

export interface FinancialBreakdown {
  registered: bigint;
  projected: bigint;
  total: bigint;
}

export interface MonthlyFinancialTotals {
  income: FinancialBreakdown;
  expense: FinancialBreakdown;
  balance: FinancialBreakdown;
}

export interface MonthlyFinancialItem {
  source: 'registered' | 'projected';
  kind: 'income' | 'expense';
  amountCents: bigint;
  competenceDate: Date;
  transaction: FinancialTransactionLike;
}

export interface AggregateFinancialPeriodInput {
  transactions: FinancialTransactionLike[];
  recurringTransactions?: RecurringTransactionLike[];
  start?: Date;
  end?: Date;
  includeProjected?: boolean;
}

function normalized(value: string | null | undefined): string {
  return (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

function isCardBillPayment(transaction: FinancialTransactionLike): boolean {
  if (transaction.card_bill_payment || transaction.card_bill_paid) return true;
  return normalized(transaction.category) === 'pagamento de cartao';
}

function isCreditCardTransaction(transaction: FinancialTransactionLike): boolean {
  return transaction.financial_entities?.type === 'credit_card'
    || transaction.payment_method === 'credit'
    || transaction.payment_method === 'credit_card';
}

/** Resolve a data de competência financeira de um lançamento. */
export function financialCompetenceDate(transaction: FinancialTransactionLike): Date | null {
  if (isCardBillPayment(transaction)) return null;

  const transactionDate = new Date(transaction.transaction_date);
  if (!isCreditCardTransaction(transaction) || !transaction.financial_entities) return transactionDate;

  return computeBillPeriod(
    transaction.financial_entities.closing_day ?? 1,
    transaction.financial_entities.due_day ?? 10,
    transactionDate,
  ).dueDate;
}

function withinRange(date: Date, start?: Date, end?: Date): boolean {
  if (start && date.getTime() < startOfDay(start).getTime()) return false;
  if (end && date.getTime() > endOfDay(end).getTime()) return false;
  return true;
}

function projectionLookback(start: Date): Date {
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 2, 1));
}

function emptyBreakdown(): FinancialBreakdown {
  return { registered: 0n, projected: 0n, total: 0n };
}

/**
 * Motor puro de agregação financeira. Todas as somas são feitas em centavos
 * com bigint; conversões para contratos legados acontecem apenas na borda.
 */
export function aggregateFinancialPeriod(input: AggregateFinancialPeriodInput): {
  totals: MonthlyFinancialTotals;
  items: MonthlyFinancialItem[];
} {
  const items: MonthlyFinancialItem[] = [];

  for (const transaction of input.transactions) {
    if (transaction.deleted_at) continue;
    const competenceDate = financialCompetenceDate(transaction);
    if (!competenceDate || !withinRange(competenceDate, input.start, input.end)) continue;
    items.push({
      source: 'registered',
      kind: transaction.type,
      amountCents: toCents(transaction.amount),
      competenceDate,
      transaction,
    });
  }

  if (input.includeProjected !== false && input.start && input.end) {
    const projected = projectRecurringTransactions(
      input.recurringTransactions ?? [],
      projectionLookback(input.start),
      input.end,
      input.transactions,
    ) as FinancialTransactionLike[];

    for (const transaction of projected) {
      const competenceDate = financialCompetenceDate(transaction);
      if (!competenceDate || !withinRange(competenceDate, input.start, input.end)) continue;
      items.push({
        source: 'projected',
        kind: transaction.type,
        amountCents: toCents(transaction.amount),
        competenceDate,
        transaction,
      });
    }
  }

  const income = emptyBreakdown();
  const expense = emptyBreakdown();
  for (const item of items) {
    const target = item.kind === 'income' ? income : expense;
    if (item.source === 'registered') target.registered += item.amountCents;
    else target.projected += item.amountCents;
  }
  income.total = income.registered + income.projected;
  expense.total = expense.registered + expense.projected;

  const balance: FinancialBreakdown = {
    registered: income.registered - expense.registered,
    projected: income.projected - expense.projected,
    total: income.total - expense.total,
  };

  return { totals: { income, expense, balance }, items };
}
