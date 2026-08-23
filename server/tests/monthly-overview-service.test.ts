import { beforeEach, describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  transactions: {
    findMany: vi.fn(),
  },
  recurring_transactions: {
    findMany: vi.fn(),
  },
}));

vi.mock('../src/lib/prisma.js', () => ({ prisma: harness }));

import {
  getMonthlyOverview,
  getMonthlyOverviewDetail,
} from '../src/services/monthly-finance.service.js';

const date = (value: string) => new Date(`${value}T12:00:00.000Z`);

const transactions = [
  {
    id: 1,
    user_id: 7,
    amount: '1000.00',
    type: 'income',
    description: 'Receita de janeiro',
    transaction_date: date('2026-01-10'),
    payment_method: 'pix',
    deleted_at: null,
    financial_entities: null,
    income_sources: null,
  },
  {
    id: 2,
    user_id: 7,
    amount: '2500.00',
    type: 'income',
    description: 'Salário',
    transaction_date: date('2026-08-05'),
    payment_method: 'pix',
    deleted_at: null,
    financial_entities: null,
    income_source_id: 3,
    income_sources: { id: 3, name: 'Empresa' },
  },
  {
    id: 3,
    user_id: 7,
    amount: '300.00',
    type: 'expense',
    description: 'Compra no cartão',
    transaction_date: date('2026-07-10'),
    payment_method: 'credit',
    deleted_at: null,
    financial_entities: { id: 8, name: 'Nubank', type: 'credit_card', closing_day: 31, due_day: 10 },
    income_sources: null,
  },
];

const recurringTransactions = [{
  id: 9,
  user_id: 7,
  amount: '50.00',
  type: 'expense',
  description: 'Assinatura',
  frequency: 'monthly',
  start_date: date('2026-08-15'),
  payment_method: 'pix',
  status: 'active',
  financial_entities: null,
  income_sources: null,
}];

describe('serviço da Visão mensal sem N+1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    harness.transactions.findMany.mockResolvedValue(transactions);
    harness.recurring_transactions.findMany.mockResolvedValue(recurringTransactions);
  });

  it('retorna os 12 meses com somente duas consultas no ano inteiro', async () => {
    const result = await getMonthlyOverview(7, 2026, date('2026-08-20'));

    expect(result.months).toHaveLength(12);
    expect(result.months[0]).toMatchObject({
      month: '2026-01',
      status: 'closed',
      income: { registered: 100000, projected: 0, total: 100000 },
    });
    expect(result.months[7]).toMatchObject({
      month: '2026-08',
      status: 'current',
      income: { total: 250000 },
      expense: { registered: 30000, projected: 5000, total: 35000 },
    });
    expect(result.months[8]?.status).toBe('projected');
    expect(harness.transactions.findMany).toHaveBeenCalledTimes(1);
    expect(harness.recurring_transactions.findMany).toHaveBeenCalledTimes(1);
    expect(harness.transactions.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ user_id: 7 }),
    }));
  });

  it('detalha e agrupa o mês com os mesmos totais do resumo anual', async () => {
    const annual = await getMonthlyOverview(7, 2026, date('2026-08-20'));
    const detail = await getMonthlyOverviewDetail(7, '2026-08', date('2026-08-20'));
    const august = annual.months[7];

    expect(detail.totals).toEqual({
      income: august?.income,
      expense: august?.expense,
      balance: august?.balance,
    });
    expect(detail.income_groups.map(group => group.name)).toEqual(['Empresa']);
    expect(detail.expense_groups.map(group => group.name)).toEqual(['Nubank', 'Pix']);
    expect(detail.projected_items).toHaveLength(1);
    expect(harness.transactions.findMany).toHaveBeenCalledTimes(2);
    expect(harness.recurring_transactions.findMany).toHaveBeenCalledTimes(2);
  });

  it('não projeta recorrências em meses fechados', async () => {
    const detail = await getMonthlyOverviewDetail(7, '2026-01', date('2026-08-20'));
    expect(detail.status).toBe('closed');
    expect(detail.projected_items).toEqual([]);
    expect(detail.totals.income.total).toBe(100000);
  });
});
