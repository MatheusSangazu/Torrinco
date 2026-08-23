import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getMonthlyOverview: vi.fn(),
  getMonthlyOverviewDetail: vi.fn(),
  requireUserInAccount: vi.fn(),
}));

vi.mock('../src/services/monthly-finance.service.js', () => ({
  getMonthlyOverview: mocks.getMonthlyOverview,
  getMonthlyOverviewDetail: mocks.getMonthlyOverviewDetail,
}));
vi.mock('../src/services/ownership.service.js', () => {
  class OwnershipError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 403) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  return {
    OwnershipError,
    requireUserInAccount: mocks.requireUserInAccount,
    getCategoryForAccount: vi.fn(),
    getEntityForAccount: vi.fn(),
  };
});
vi.mock('../src/lib/prisma.js', () => ({ prisma: {} }));

import { FinanceController } from '../src/controllers/finance.controller.js';
import { financeSchemas } from '../src/schemas/index.js';

function response() {
  const res: any = {};
  res.json = vi.fn(() => res);
  res.status = vi.fn(() => res);
  return res;
}

describe('autorização e validação da Visão mensal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getMonthlyOverview.mockResolvedValue({ year: 2026, months: [] });
    mocks.getMonthlyOverviewDetail.mockResolvedValue({ month: '2026-08' });
    mocks.requireUserInAccount.mockResolvedValue({ id: 9, account_id: 4 });
  });

  it('um membro não consulta a visão de outro usuário', async () => {
    const req: any = {
      userId: 7,
      accountId: 4,
      userRole: 'member',
      validated: { query: { year: 2026, target_user_id: 9 } },
    };
    const next = vi.fn();

    await FinanceController.getMonthlyOverview(req, response(), next);

    expect(mocks.getMonthlyOverview).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('owner consulta apenas membro validado dentro da mesma conta', async () => {
    const req: any = {
      userId: 7,
      accountId: 4,
      userRole: 'owner',
      validated: { query: { year: 2026, target_user_id: 9 } },
    };
    const res = response();

    await FinanceController.getMonthlyOverview(req, res, vi.fn());

    expect(mocks.requireUserInAccount).toHaveBeenCalledWith(9, 4);
    expect(mocks.getMonthlyOverview).toHaveBeenCalledWith(9, 2026);
    expect(res.json).toHaveBeenCalledWith({ year: 2026, months: [] });
  });

  it('detalhamento usa o próprio usuário quando não há alvo', async () => {
    const req: any = {
      userId: 7,
      accountId: 4,
      userRole: 'member',
      params: { month: '2026-08' },
      validated: { query: {} },
    };

    await FinanceController.getMonthlyOverviewDetail(req, response(), vi.fn());

    expect(mocks.getMonthlyOverviewDetail).toHaveBeenCalledWith(7, '2026-08');
  });

  it('rejeita ano fora da faixa e mês civil inválido', () => {
    expect(financeSchemas.monthlyOverviewQuery.safeParse({ year: 1800 }).success).toBe(false);
    expect(financeSchemas.monthlyOverviewQuery.safeParse({ year: '2026' }).success).toBe(true);
    expect(financeSchemas.monthlyOverviewParams.safeParse({ month: '2026-13' }).success).toBe(false);
    expect(financeSchemas.monthlyOverviewParams.safeParse({ month: '2026-02' }).success).toBe(true);
  });
});
