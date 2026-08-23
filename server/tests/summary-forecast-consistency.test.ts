import { beforeEach, describe, expect, it, vi } from 'vitest';

const { financial, getFinancialPeriod } = vi.hoisted(() => {
  const result = {
    totals: {
      income: { registered: 300_000n, projected: 100_000n, total: 400_000n },
      expense: { registered: 70_000n, projected: 20_000n, total: 90_000n },
      balance: { registered: 230_000n, projected: 80_000n, total: 310_000n },
    },
    items: [],
  };
  return { financial: result, getFinancialPeriod: vi.fn(async () => result) };
});

vi.mock('../src/services/monthly-finance.service.js', () => ({
  getFinancialPeriod,
  getAllTimeFinancialTotals: vi.fn(async () => financial),
}));

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    transactions: {
      aggregate: vi.fn(async () => ({ _sum: { amount: 0 } })),
    },
    users: {
      findUnique: vi.fn(async () => ({ account_id: 11 })),
    },
    financial_entities: {
      findMany: vi.fn(async () => []),
    },
  },
}));

const { getForecast, getSummary } = await import('../src/services/summary.service.js');

describe('consistência entre resumo do dashboard e previsão', () => {
  beforeEach(() => {
    getFinancialPeriod.mockClear();
  });

  it('expõe os mesmos totais quando os adaptadores recebem o mesmo período do motor', async () => {
    const summary = await getSummary(7, 'month');
    const forecast = await getForecast(7, 'current_month');

    expect(summary.month_summary).toMatchObject({
      income: forecast.forecast.income,
      expense: forecast.forecast.expenses,
      balance: forecast.forecast.balance,
    });
    expect(getFinancialPeriod).toHaveBeenCalledTimes(2);
  });
});
