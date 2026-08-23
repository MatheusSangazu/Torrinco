import { describe, expect, it } from 'vitest';
import { projectRecurringTransactions } from '../src/lib/transaction-projection.js';

const date = (value: string) => new Date(`${value}T12:00:00.000Z`);

describe('projeção determinística de recorrências', () => {
  it('preserva a âncora mensal depois de um mês curto', () => {
    const projected = projectRecurringTransactions([
      { id: 1, amount: '10.00', type: 'expense', frequency: 'monthly', start_date: date('2026-01-31') },
    ], date('2026-02-01'), date('2026-03-31'), []);

    expect(projected.map(item => item.transaction_date.toISOString().slice(0, 10))).toEqual([
      '2026-02-28',
      '2026-03-31',
    ]);
    expect(projected.map(item => item.occurrence_index)).toEqual([1, 2]);
  });

  it('usa template e data civil para suprimir uma ocorrência materializada', () => {
    const projected = projectRecurringTransactions([
      { id: 7, amount: '10.00', description: 'Novo nome', type: 'expense', frequency: 'monthly', start_date: date('2026-08-10') },
    ], date('2026-08-01'), date('2026-08-31'), [{
      recurring_transaction_id: 7,
      recurring_occurrence_at: date('2026-08-10'),
      transaction_date: date('2026-08-10'),
      amount: '8.00',
      description: 'Nome antigo',
      type: 'expense',
      is_recurring: true,
    }]);

    expect(projected).toEqual([]);
  });
});
