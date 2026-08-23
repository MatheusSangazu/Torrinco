import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyDetailToReportTransactions, monthlySummariesToTrend } from './reports-monthly.ts';
import type {
  MonthlyDetailItem,
  MonthlyDetailResponse,
  MonthlySummary,
} from '../services/monthly-overview.service.ts';

function item(overrides: Partial<MonthlyDetailItem>): MonthlyDetailItem {
  return {
    id: 1,
    description: 'Lançamento',
    amount: 100,
    source: 'registered',
    category: { id: 1, name: 'Categoria' },
    competence_date: '2026-09-10',
    transaction_date: '2026-08-20',
    status: 'paid',
    payment_method: 'pix',
    entity: null,
    income_source: null,
    recurring_transaction_id: null,
    resource_url: '/finance/transactions/1',
    ...overrides,
  };
}

test('relatório usa todos os itens canônicos uma única vez', () => {
  const normalCard = item({ id: 1, amount: 371_233, payment_method: 'credit_card' });
  const recurringCard = item({ id: 'rec-2', amount: 1_725, source: 'projected', status: 'pending' });
  const pix = item({ id: 3, amount: 208_910 });
  const detail = {
    month: '2026-09',
    status: 'projected',
    currency: 'BRL',
    unit: 'cents',
    totals: {
      income: { registered: 0, projected: 0, total: 0 },
      expense: { registered: 580_143, projected: 1_725, total: 581_868 },
      balance: { registered: -580_143, projected: -1_725, total: -581_868 },
    },
    item_count: 3,
    income_groups: [],
    expense_groups: [{
      key: 'card:1',
      type: 'credit_card',
      name: 'Cartão',
      subtotal: { registered: 580_143, projected: 1_725, total: 581_868 },
      count: 3,
      items: [normalCard, recurringCard, pix],
    }],
    projected_items: [recurringCard],
  } satisfies MonthlyDetailResponse;

  const transactions = monthlyDetailToReportTransactions(detail);
  assert.equal(transactions.length, 3);
  assert.equal(transactions.reduce((sum, transaction) => sum + transaction.amount, 0), 5_818.68);
  assert.equal(transactions.find(transaction => transaction.id === 'rec-2')?.status, 'pending');
  assert.ok(transactions.every(transaction => transaction.competence_date === '2026-09-10'));
});

test('tendência usa totais mensais em centavos inclusive entre anos', () => {
  const breakdown = (total: number) => ({ registered: total, projected: 0, total });
  const month = (period: string, income: number, expense: number): MonthlySummary => ({
    month: period,
    status: 'closed',
    income: breakdown(income),
    expense: breakdown(expense),
    balance: breakdown(income - expense),
    item_count: 1,
  });

  const trend = monthlySummariesToTrend([
    month('2025-12', 100_000, 40_000),
    month('2026-01', 120_000, 50_000),
  ], ['2025-12', '2026-01']);

  assert.deepEqual(trend.map(value => [value.income, value.expense]), [[1_000, 400], [1_200, 500]]);
});
