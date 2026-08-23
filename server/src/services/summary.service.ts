import { prisma } from '../lib/prisma.js';
import { getBillByOffset, getBillDetails, type BillPeriod } from './billing.service.js';
import { centsToLegacyNumber, toCents } from '../lib/money.js';
import { getAllTimeFinancialTotals, getFinancialPeriod } from './monthly-finance.service.js';
import type { MonthlyFinancialItem } from '../lib/monthly-finance-engine.js';

/**
 * Fonte única do resumo financeiro (dashboard) e da previsão (forecast).
 *
 * Antes esta lógica vivia dentro do FinanceController duplicada e com cálculo
 * de fatura inline + detecção de pagamento por string. Agora delega ao
 * billing.service para os totais/status das faturas, eliminando a duplicação.
 */

export interface SummaryResult {
  month_summary: {
    income: number;
    expense: number;
    balance: number;
    cash_balance: number;
  };
}

/** Adaptador do dashboard atual sobre o motor financeiro mensal único. */
export async function getSummary(userId: number, period: 'month' | 'all' = 'month'): Promise<SummaryResult> {
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  const [financial, cashIncome, cashExpense] = await Promise.all([
    period === 'all'
      ? getAllTimeFinancialTotals(userId)
      : getFinancialPeriod(userId, periodStart, periodEnd),
    prisma.transactions.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        payment_method: { in: ['cash', 'pix', 'debit'] },
        transaction_date: { lte: now },
        deleted_at: null,
      },
      _sum: { amount: true },
    }),
    prisma.transactions.aggregate({
      where: {
        user_id: userId,
        type: 'expense',
        payment_method: { in: ['cash', 'pix', 'debit'] },
        transaction_date: { lte: now },
        deleted_at: null,
      },
      _sum: { amount: true },
    }),
  ]);

  const { totals } = financial;
  const cashBalance = toCents(cashIncome._sum.amount ?? 0) - toCents(cashExpense._sum.amount ?? 0);
  return {
    month_summary: {
      income: centsToLegacyNumber(totals.income.total),
      expense: centsToLegacyNumber(totals.expense.total),
      balance: centsToLegacyNumber(totals.balance.total),
      cash_balance: centsToLegacyNumber(cashBalance),
    },
  };
}

export interface ForecastResult {
  period: string;
  forecast: {
    income: number;
    expenses: number;
    balance: number;
    breakdown: {
      recurring_income: any[];
      recurring_expenses: any[];
      normal_income: any[];
      normal_expenses: any[];
      installments: any[];
      credit_card_bills: any[];
    };
  };
}

/**
 * Coleta as faturas de cartão que VENCEM dentro de [start, end], via
 * billing.service (fonte única). Retorna totais e itens, já separando as pagas
 * das pendentes. Substitui o bloco inline antigo + string matching.
 */
async function getCardBillsInPeriod(userId: number, start: Date, end: Date) {
  // Busca o account_id do usuário pra filtrar cartões por conta.
  const userRow = await prisma.users.findUnique({
    where: { id: userId },
    select: { account_id: true }
  });
  if (!userRow) return { bills: [] };

  const cards = await prisma.financial_entities.findMany({
    where: { account_id: userRow.account_id, type: 'credit_card' },
    select: { id: true, name: true, color: true }
  });

  const bills: any[] = [];

  for (const card of cards) {
    // Varre alguns offsets até achar a(s) fatura(s) com due_date no período.
    for (let offset = -2; offset <= 2; offset++) {
      let result: { bill: any; card: any; period: BillPeriod };
      try {
        result = await getBillByOffset(card.id, userId, offset);
      } catch {
        continue;
      }
      if (!result.bill) continue;

      const { period, bill } = result;
      // due_date dentro do período do forecast?
      if (period.dueDate < start || period.dueDate > end) continue;

      const details = await getBillDetails(bill.id, userId);
      const isPaid = bill.status === 'paid';

      for (const item of details.bill.items) {
        bills.push({
          description: item.description,
          amount: item.amount,
          transaction_date: item.transaction_date,
          card_id: card.id,
          card_name: card.name,
          card_color: card.color,
          type: 'credit_card_bill',
          is_projected: !!(item as any).is_projected,
          due_date: period.dueDate,
          bill_id: bill.id,
          is_paid: isPaid,
          payment_id: bill.payment_transaction_id ?? null
        });
      }
    }
  }

  return { bills };
}

function isCreditExpense(item: MonthlyFinancialItem): boolean {
  const transaction = item.transaction;
  return item.kind === 'expense' && (
    transaction.financial_entities?.type === 'credit_card'
    || transaction.payment_method === 'credit'
    || transaction.payment_method === 'credit_card'
  );
}

async function getForecastBreakdown(
  userId: number,
  period: 'current_month' | 'next_month',
  start: Date,
  end: Date,
  items: MonthlyFinancialItem[],
): Promise<ForecastResult> {
  const { bills: creditCardBillTransactions } = await getCardBillsInPeriod(userId, start, end);
  const nonCardItems = items.filter(item => !isCreditExpense(item));
  const recurringIncomeList = nonCardItems.filter(item => item.source === 'projected' && item.kind === 'income').map(item => item.transaction);
  const recurringExpenseList = nonCardItems.filter(item => item.source === 'projected' && item.kind === 'expense').map(item => item.transaction);
  const normalIncomeList = nonCardItems.filter(item => item.source === 'registered' && item.kind === 'income').map(item => item.transaction);
  const normalExpensesList = nonCardItems.filter(item => item.source === 'registered' && item.kind === 'expense' && !item.transaction.installment_id).map(item => item.transaction);
  const installmentsList = nonCardItems.filter(item => item.source === 'registered' && item.kind === 'expense' && !!item.transaction.installment_id).map(item => item.transaction);

  return {
    period,
    forecast: {
      income: 0,
      expenses: 0,
      balance: 0,
      breakdown: {
        recurring_income: recurringIncomeList,
        recurring_expenses: recurringExpenseList,
        normal_income: normalIncomeList,
        normal_expenses: normalExpensesList,
        installments: installmentsList,
        credit_card_bills: creditCardBillTransactions
      }
    }
  };
}

/** Adaptador legado da previsão; os totais vêm do mesmo motor usado no resumo. */
export async function getForecast(userId: number, period: 'current_month' | 'next_month' = 'next_month'): Promise<ForecastResult> {
  const today = new Date();
  const monthOffset = period === 'next_month' ? 1 : 0;
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1));
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset + 1, 0, 23, 59, 59, 999));
  const financial = await getFinancialPeriod(userId, start, end);
  const legacy = await getForecastBreakdown(userId, period, start, end, financial.items);
  const { totals } = financial;

  return {
    ...legacy,
    forecast: {
      ...legacy.forecast,
      income: centsToLegacyNumber(totals.income.total),
      expenses: centsToLegacyNumber(totals.expense.total),
      balance: centsToLegacyNumber(totals.balance.total),
    },
  };
}
