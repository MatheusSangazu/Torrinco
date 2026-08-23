import { beforeEach, describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => {
  const state: { recurring: any[]; transactions: any[]; nextId: number } = {
    recurring: [],
    transactions: [],
    nextId: 100,
  };
  const matches = (item: any, where: Record<string, any>) => Object.entries(where).every(([key, value]) => {
    if (value && typeof value === 'object' && 'lte' in value) return item[key].getTime() <= value.lte.getTime();
    return item[key] === value;
  });
  const db: any = {
    users: { findUnique: vi.fn(async () => ({ account_id: 1 })) },
    recurring_transactions: {
      findMany: vi.fn(async ({ where }: any) => state.recurring.filter(item => matches(item, where))),
      findFirst: vi.fn(async ({ where }: any) => state.recurring.find(item => matches(item, where)) ?? null),
      findUnique: vi.fn(async ({ where }: any) => state.recurring.find(item => matches(item, where)) ?? null),
      update: vi.fn(async ({ where, data }: any) => Object.assign(state.recurring.find(item => item.id === where.id), data)),
    },
    transactions: {
      findFirst: vi.fn(async ({ where }: any) => state.transactions.find(item => matches(item, where)) ?? null),
      create: vi.fn(async ({ data }: any) => {
        const transaction = { id: state.nextId++, deleted_at: null, ...data };
        state.transactions.push(transaction);
        return transaction;
      }),
    },
  };
  db.$transaction = vi.fn(async (work: any) => work(db));
  return { state, db };
});

vi.mock('../src/lib/prisma.js', () => ({ prisma: harness.db }));
vi.mock('../src/services/subscription.service.js', () => ({ assertAccountAccess: vi.fn(async () => ({})) }));
vi.mock('../src/services/ownership.service.js', () => ({
  getCategoryForAccount: vi.fn(),
  getEntityForAccount: vi.fn(),
  getIncomeSourceForUser: vi.fn(),
}));

import { materializeDue, materializeOne, truncateRecurringFrom } from '../src/services/recurring.service.js';

const date = (value: string) => new Date(`${value}T12:00:00.000Z`);
const recurring = (extra: Record<string, any> = {}) => ({
  id: 1,
  user_id: 1,
  description: 'Internet',
  amount: 100,
  type: 'expense',
  category: 'Contas',
  category_id: 2,
  income_source_id: null,
  entity_id: null,
  payment_method: 'pix',
  frequency: 'monthly',
  start_date: date('2026-08-10'),
  next_due_date: date('2026-08-10'),
  status: 'active',
  end_type: 'never',
  occurrence_count: null,
  end_date: null,
  ...extra,
});

describe('materialização limitada e idempotente', () => {
  beforeEach(() => {
    harness.state.recurring = [];
    harness.state.transactions = [];
    harness.state.nextId = 100;
    vi.clearAllMocks();
  });

  it('reexecutar o job não duplica a mesma ocorrência', async () => {
    harness.state.recurring.push(recurring());

    await materializeDue(1, date('2026-08-10'));
    await materializeDue(1, date('2026-08-10'));

    expect(harness.state.transactions).toHaveLength(1);
    expect(harness.state.transactions[0]).toMatchObject({
      recurring_transaction_id: 1,
      recurring_occurrence_date: date('2026-08-10'),
    });
  });

  it('marca como concluída ao materializar a última ocorrência', async () => {
    harness.state.recurring.push(recurring({ end_type: 'occurrence_count', occurrence_count: 1 }));

    await materializeDue(1, date('2026-08-10'));
    await materializeDue(1, date('2026-09-10'));

    expect(harness.state.transactions).toHaveLength(1);
    expect(harness.state.recurring[0]?.status).toBe('completed');
  });

  it('materializar uma projeção futura isolada não avança o cursor da série', async () => {
    harness.state.recurring.push(recurring());

    await materializeOne(1, 1, date('2026-10-10'));
    expect(harness.state.recurring[0]?.next_due_date).toEqual(date('2026-08-10'));

    await materializeDue(1, date('2026-08-10'));
    expect(harness.state.transactions.map(item => item.recurring_occurrence_date)).toEqual([
      date('2026-10-10'),
      date('2026-08-10'),
    ]);
  });

  it('cancelar esta e as próximas mantém as ocorrências anteriores pendentes', async () => {
    harness.state.recurring.push(recurring());

    await truncateRecurringFrom(1, 1, date('2026-10-10'));
    expect(harness.state.recurring[0]).toMatchObject({
      end_type: 'end_date',
      end_date: date('2026-10-09'),
      status: 'active',
    });

    await materializeDue(1, date('2026-12-31'));
    expect(harness.state.transactions.map(item => item.recurring_occurrence_date)).toEqual([
      date('2026-08-10'),
      date('2026-09-10'),
    ]);
    expect(harness.state.recurring[0]?.status).toBe('completed');
  });
});
