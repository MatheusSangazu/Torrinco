import { describe, expect, it } from 'vitest';
import {
  aggregateFinancialPeriod,
  financialCompetenceDate,
  type FinancialTransactionLike,
  type RecurringTransactionLike,
} from '../src/lib/monthly-finance-engine.js';

const date = (value: string) => new Date(`${value}T12:00:00.000Z`);
const augustStart = date('2026-08-01');
const augustEnd = date('2026-08-31');

function transaction(overrides: Partial<FinancialTransactionLike> = {}): FinancialTransactionLike {
  return {
    id: 1,
    amount: '100.00',
    type: 'expense',
    transaction_date: date('2026-08-10'),
    payment_method: 'pix',
    deleted_at: null,
    ...overrides,
  };
}

function recurring(overrides: Partial<RecurringTransactionLike> = {}): RecurringTransactionLike {
  return {
    id: 9,
    amount: '50.00',
    type: 'expense',
    frequency: 'monthly',
    start_date: date('2026-07-15'),
    payment_method: 'pix',
    ...overrides,
  };
}

describe('motor financeiro mensal', () => {
  it('produz balanço positivo para mês somente com receitas', () => {
    const result = aggregateFinancialPeriod({
      transactions: [transaction({ type: 'income', amount: '125.50' })],
      start: augustStart,
      end: augustEnd,
    });
    expect(result.totals.balance.total).toBe(12550n);
  });

  it('produz balanço negativo para mês somente com despesas', () => {
    const result = aggregateFinancialPeriod({
      transactions: [transaction({ type: 'expense', amount: '125.50' })],
      start: augustStart,
      end: augustEnd,
    });
    expect(result.totals.balance.total).toBe(-12550n);
  });

  it('separa registrado, projetado e total e deriva o balanço', () => {
    const result = aggregateFinancialPeriod({
      transactions: [
        transaction({ id: 1, type: 'income', amount: '3000.00' }),
        transaction({ id: 2, type: 'expense', amount: '700.00' }),
      ],
      recurringTransactions: [
        recurring({ id: 10, type: 'income', amount: '1000.00' }),
        recurring({ id: 11, type: 'expense', amount: '200.00' }),
      ],
      start: augustStart,
      end: augustEnd,
    });

    expect(result.totals).toEqual({
      income: { registered: 300000n, projected: 100000n, total: 400000n },
      expense: { registered: 70000n, projected: 20000n, total: 90000n },
      balance: { registered: 230000n, projected: 80000n, total: 310000n },
    });
  });

  it('retorna zero real quando o período não possui lançamentos', () => {
    const result = aggregateFinancialPeriod({ transactions: [], start: augustStart, end: augustEnd });
    expect(result.totals.balance).toEqual({ registered: 0n, projected: 0n, total: 0n });
    expect(result.items).toEqual([]);
  });

  it('soma valores monetários em centavos sem erro binário', () => {
    const result = aggregateFinancialPeriod({
      transactions: [
        transaction({ id: 1, type: 'income', amount: '0.10' }),
        transaction({ id: 2, type: 'income', amount: '0.20' }),
      ],
      start: augustStart,
      end: augustEnd,
    });
    expect(result.totals.income.total).toBe(30n);
  });

  it('atribui compra no cartão ao mês de vencimento da respectiva fatura', () => {
    const card = { id: 4, type: 'credit_card', closing_day: 20, due_day: 5 };
    const beforeClosing = transaction({ transaction_date: date('2026-08-18'), payment_method: 'credit', financial_entities: card });
    const afterClosing = transaction({ transaction_date: date('2026-08-21'), payment_method: 'credit', financial_entities: card });

    expect(financialCompetenceDate(beforeClosing)?.toISOString().slice(0, 10)).toBe('2026-09-05');
    expect(financialCompetenceDate(afterClosing)?.toISOString().slice(0, 10)).toBe('2026-10-05');
  });

  it('aplica a competência da fatura também à recorrência projetada no cartão', () => {
    const card = { id: 4, type: 'credit_card', closing_day: 20, due_day: 5 };
    const result = aggregateFinancialPeriod({
      transactions: [],
      recurringTransactions: [recurring({
        start_date: date('2026-08-21'),
        payment_method: 'credit',
        financial_entities: card,
      })],
      start: date('2026-10-01'),
      end: date('2026-10-31'),
    });
    expect(result.totals.expense).toEqual({ registered: 0n, projected: 5000n, total: 5000n });
  });

  it('contabiliza cada parcela no vencimento do ciclo em que foi registrada', () => {
    const card = { id: 4, type: 'credit_card', closing_day: 1, due_day: 5 };
    const result = aggregateFinancialPeriod({
      transactions: [transaction({
        installment_id: 3,
        transaction_date: date('2026-08-01'),
        payment_method: 'credit_card',
        financial_entities: card,
      })],
      start: date('2026-08-01'),
      end: date('2026-08-31'),
    });
    expect(result.totals.expense.total).toBe(10000n);
  });

  it('não conta pagamentos de fatura como nova despesa', () => {
    const result = aggregateFinancialPeriod({
      transactions: [
        transaction({ id: 1, amount: '400.00', card_bill_payment: { id: 8 } }),
        transaction({ id: 2, amount: '300.00', category: 'Pagamento de Cartão' }),
        transaction({ id: 3, amount: '50.00', category: 'Mercado' }),
      ],
      start: augustStart,
      end: augustEnd,
    });
    expect(result.totals.expense.total).toBe(5000n);
  });

  it('uma ocorrência materializada substitui sua projeção pela identidade', () => {
    const result = aggregateFinancialPeriod({
      transactions: [transaction({
        amount: '45.00',
        description: 'Valor ajustado',
        is_recurring: true,
        recurring_transaction_id: 9,
        recurring_occurrence_at: date('2026-08-15'),
        transaction_date: date('2026-08-15'),
      })],
      recurringTransactions: [recurring({ amount: '50.00', description: 'Valor original' })],
      start: augustStart,
      end: augustEnd,
    });

    expect(result.totals.expense).toEqual({ registered: 4500n, projected: 0n, total: 4500n });
  });

  it('uma ocorrência cancelada não soma e não reaparece como projeção', () => {
    const result = aggregateFinancialPeriod({
      transactions: [transaction({
        deleted_at: date('2026-08-10'),
        is_recurring: true,
        recurring_transaction_id: 9,
        recurring_occurrence_at: date('2026-08-15'),
        transaction_date: date('2026-08-15'),
      })],
      recurringTransactions: [recurring()],
      start: augustStart,
      end: augustEnd,
    });
    expect(result.totals.expense.total).toBe(0n);
  });
});
