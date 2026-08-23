import { describe, expect, it } from 'vitest';
import { aggregateFinancialPeriod, type FinancialTransactionLike } from '../src/lib/monthly-finance-engine.js';
import { buildMonthlyDetail, monthStatus } from '../src/lib/monthly-overview.js';

const date = (value: string) => new Date(`${value}T12:00:00.000Z`);
const transaction = (overrides: Partial<FinancialTransactionLike>): FinancialTransactionLike => ({
  id: 1,
  amount: '100.00',
  type: 'expense',
  description: 'Lançamento',
  transaction_date: date('2026-08-10'),
  payment_method: 'pix',
  deleted_at: null,
  ...overrides,
});

describe('contrato da Visão mensal', () => {
  it('classifica o mês no fuso oficial mesmo próximo da virada UTC', () => {
    const instant = new Date('2026-09-01T01:30:00.000Z'); // 31/08 em Fortaleza
    expect(monthStatus('2026-08', instant)).toBe('current');
    expect(monthStatus('2026-07', instant)).toBe('closed');
    expect(monthStatus('2026-09', instant)).toBe('projected');
  });

  it('agrupa despesas por cartão, conta e forma de pagamento', () => {
    const financial = aggregateFinancialPeriod({
      transactions: [
        transaction({
          id: 1,
          amount: '300.00',
          description: 'Mercado',
          transaction_date: date('2026-07-10'),
          payment_method: 'credit',
          financial_entities: { id: 8, name: 'Nubank', type: 'credit_card', closing_day: 31, due_day: 10 },
        }),
        transaction({
          id: 2,
          amount: '80.00',
          description: 'Energia',
          entity_id: 4,
          financial_entities: { id: 4, name: 'Conta principal', type: 'bank' },
        }),
        transaction({ id: 3, amount: '20.00', description: 'Feira', payment_method: 'cash' }),
        transaction({ id: 4, amount: '10.00', description: 'Transferência', payment_method: 'pix' }),
      ],
      start: date('2026-08-01'),
      end: date('2026-08-31'),
    });
    const detail = buildMonthlyDetail('2026-08', financial, date('2026-08-15'));

    expect(detail.expense_groups.map(group => [group.name, group.subtotal.total])).toEqual([
      ['Conta principal', 8000],
      ['Dinheiro', 2000],
      ['Nubank', 30000],
      ['Pix', 1000],
    ]);
    expect(detail.expense_groups.reduce((sum, group) => sum + group.subtotal.total, 0))
      .toBe(detail.totals.expense.total);
  });

  it('agrupa receitas sem fonte em Outras receitas e preserva o total', () => {
    const financial = aggregateFinancialPeriod({
      transactions: [
        transaction({
          id: 5,
          type: 'income',
          amount: '2500.00',
          description: 'Salário',
          income_source_id: 2,
          income_sources: { id: 2, name: 'Empresa' },
        }),
        transaction({ id: 6, type: 'income', amount: '150.00', description: 'Venda' }),
      ],
      start: date('2026-08-01'),
      end: date('2026-08-31'),
    });
    const detail = buildMonthlyDetail('2026-08', financial, date('2026-08-15'));

    expect(detail.income_groups.map(group => [group.name, group.subtotal.total])).toEqual([
      ['Empresa', 250000],
      ['Outras receitas', 15000],
    ]);
    expect(detail.income_groups.reduce((sum, group) => sum + group.subtotal.total, 0))
      .toBe(detail.totals.income.total);
  });

  it('expõe itens projetados com identidade e acesso à recorrência original', () => {
    const financial = aggregateFinancialPeriod({
      transactions: [],
      recurringTransactions: [{
        id: 9,
        amount: '49.90',
        type: 'expense',
        description: 'Assinatura',
        frequency: 'monthly',
        start_date: date('2026-08-10'),
        payment_method: 'pix',
      }],
      start: date('2026-08-01'),
      end: date('2026-08-31'),
    });
    const detail = buildMonthlyDetail('2026-08', financial, date('2026-08-15'));

    expect(detail.projected_items).toHaveLength(1);
    expect(detail.projected_items[0]).toMatchObject({
      amount: 4990,
      source: 'projected',
      status: 'pending',
      recurring_transaction_id: 9,
      resource_url: '/recurring/9',
      competence_date: '2026-08-10',
    });
  });
});
