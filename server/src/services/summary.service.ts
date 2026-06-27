import { prisma } from '../lib/prisma.js';
import { projectRecurringTransactions } from '../lib/transaction-projection.js';
import { getBillByOffset, getBillDetails, type BillPeriod } from './billing.service.js';

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

/**
 * Resumo financeiro do mês atual (ou "all" para todo o histórico).
 * income/expense incluem projeção de recorrências ainda não materializadas.
 * cash_balance = receitas - despesas em dinheiro/pix/débito até hoje.
 */
export async function getSummary(userId: number, period: 'month' | 'all' = 'month'): Promise<SummaryResult> {
  const now = new Date();
  let dateFilter: { gte?: Date; lte?: Date } | undefined = undefined;

  if (period !== 'all') {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    dateFilter = { gte: firstDayOfMonth, lte: lastDayOfMonth };
  }

  const [
    income,
    expense,
    totalIncomeUntilNow,
    totalExpenseCashUntilNow,
    realTransactionsForPeriod,
    recurringTransactions
  ] = await Promise.all([
    prisma.transactions.aggregate({
      where: { user_id: userId, type: 'income', transaction_date: dateFilter, deleted_at: null },
      _sum: { amount: true }
    }),
    // Despesas do mês EXCETO pagamento de cartão (evita dupla contagem com a fatura).
    prisma.transactions.aggregate({
      where: {
        user_id: userId,
        type: 'expense',
        transaction_date: dateFilter,
        deleted_at: null,
        category: { not: 'Pagamento de Cartão' }
      },
      _sum: { amount: true }
    }),
    prisma.transactions.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        payment_method: { in: ['cash', 'pix', 'debit'] },
        transaction_date: { lte: now },
        deleted_at: null
      },
      _sum: { amount: true }
    }),
    prisma.transactions.aggregate({
      where: {
        user_id: userId,
        type: 'expense',
        payment_method: { in: ['cash', 'pix', 'debit'] },
        transaction_date: { lte: now },
        deleted_at: null
      },
      _sum: { amount: true }
    }),
    prisma.transactions.findMany({
      where: { user_id: userId, transaction_date: dateFilter, deleted_at: null }
    }),
    prisma.recurring_transactions.findMany({
      where: { user_id: userId, status: 'active' }
    })
  ]);

  let recurringIncomeTotal = 0;
  let recurringExpenseTotal = 0;

  if (dateFilter?.gte && dateFilter?.lte) {
    const projections = projectRecurringTransactions(
      recurringTransactions,
      dateFilter.gte,
      dateFilter.lte,
      realTransactionsForPeriod
    );
    recurringIncomeTotal = projections
      .filter(p => p.type === 'income')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    recurringExpenseTotal = projections
      .filter(p => p.type === 'expense')
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }

  const totalIncomePeriod = (Number(income._sum.amount) || 0) + recurringIncomeTotal;
  const totalExpensePeriod = (Number(expense._sum.amount) || 0) + recurringExpenseTotal;
  const cashBalance =
    (Number(totalIncomeUntilNow._sum.amount) || 0) -
    (Number(totalExpenseCashUntilNow._sum.amount) || 0);

  return {
    month_summary: {
      income: totalIncomePeriod,
      expense: totalExpensePeriod,
      balance: totalIncomePeriod - totalExpensePeriod,
      cash_balance: cashBalance
    }
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
  const cards = await prisma.financial_entities.findMany({
    where: { user_id: userId, type: 'credit_card' },
    select: { id: true, name: true, color: true }
  });

  const bills: any[] = [];
  let pendingTotal = 0;

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
      if (!isPaid) pendingTotal += details.bill.total_amount;

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

  return { bills, pendingTotal };
}

/**
 * Previsão financeira de um período (mês atual ou próximo mês).
 * Soma: receitas/despesas normais + recorrências projetadas (não crédito) +
 * parcelas + faturas de cartão pendentes que vencem no período.
 */
export async function getForecast(userId: number, period: 'current_month' | 'next_month' = 'next_month'): Promise<ForecastResult> {
  const today = new Date();
  let forecastStart: Date;
  let forecastEnd: Date;

  if (period === 'next_month') {
    forecastStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1, 0, 0, 0));
    forecastEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 2, 0, 23, 59, 59, 999));
  } else {
    forecastStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1, 0, 0, 0));
    forecastEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  }

  // Faturas de cartão que vencem no período (via billing.service).
  const { bills: creditCardBillTransactions, pendingTotal: creditCardBillExpenses } =
    await getCardBillsInPeriod(userId, forecastStart, forecastEnd);

  const [normalIncomeList, normalExpensesList, installmentsList, recurringTransactionsForForecast] = await Promise.all([
    prisma.transactions.findMany({
      where: {
        user_id: userId,
        type: 'income',
        transaction_date: { gte: forecastStart, lte: forecastEnd },
        deleted_at: null
      },
      select: { id: true, description: true, amount: true, transaction_date: true }
    }),
    prisma.transactions.findMany({
      where: {
        user_id: userId,
        type: 'expense',
        transaction_date: { gte: forecastStart, lte: forecastEnd },
        deleted_at: null,
        installment_id: null,
        category: { not: 'Pagamento de Cartão' },
        payment_method: { notIn: ['credit', 'credit_card'] }
      },
      select: { id: true, description: true, amount: true, transaction_date: true, installment_number: true }
    }),
    prisma.transactions.findMany({
      where: {
        user_id: userId,
        type: 'expense',
        transaction_date: { gte: forecastStart, lte: forecastEnd },
        deleted_at: null,
        installment_id: { not: null },
        payment_method: { notIn: ['credit', 'credit_card'] }
      },
      select: { id: true, description: true, amount: true, transaction_date: true, installment_number: true }
    }),
    prisma.recurring_transactions.findMany({
      where: { user_id: userId, status: 'active' },
      include: { categories: true, financial_entities: true }
    })
  ]);

  // Recorrências projetadas (exclui crédito — já contabilizadas na fatura).
  const allProjected = projectRecurringTransactions(
    recurringTransactionsForForecast.filter(rt => rt.payment_method !== 'credit'),
    new Date(forecastStart),
    new Date(forecastEnd),
    [...normalIncomeList, ...normalExpensesList, ...installmentsList]
  );
  const recurringIncomeList = allProjected.filter(p => p.type === 'income');
  const recurringExpenseList = allProjected.filter(p => p.type === 'expense');

  const forecastIncomeTotal =
    recurringIncomeList.reduce((s, i) => s + Number(i.amount), 0) +
    normalIncomeList.reduce((s, i) => s + Number(i.amount), 0);
  const forecastExpensesTotal =
    recurringExpenseList.reduce((s, i) => s + Number(i.amount), 0) +
    normalExpensesList.reduce((s, i) => s + Number(i.amount), 0) +
    installmentsList.reduce((s, i) => s + Number(i.amount), 0) +
    creditCardBillExpenses;
  const forecastBalance = forecastIncomeTotal - forecastExpensesTotal;

  return {
    period,
    forecast: {
      income: forecastIncomeTotal,
      expenses: forecastExpensesTotal,
      balance: forecastBalance,
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
