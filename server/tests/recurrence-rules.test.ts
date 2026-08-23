import { describe, expect, it } from 'vitest';
import { projectRecurringTransactions } from '../src/lib/transaction-projection.js';
import {
  isOccurrenceAllowed,
  normalizeRecurrenceEndRule,
} from '../src/lib/recurrence-rules.js';

const date = (value: string) => new Date(`${value}T12:00:00.000Z`);

describe('regras de término de recorrências', () => {
  it('mantém recorrências legadas sem campos de término como never', () => {
    expect(normalizeRecurrenceEndRule({}, date('2026-08-10'))).toEqual({
      end_type: 'never',
      occurrence_count: null,
      end_date: null,
    });
    expect(isOccurrenceAllowed({}, date('2036-08-10'), 120)).toBe(true);
  });

  it('rejeita combinações contraditórias ou inválidas', () => {
    expect(() => normalizeRecurrenceEndRule({
      end_type: 'occurrence_count',
      occurrence_count: 0,
    }, date('2026-08-10'))).toThrow('INVALID_RECURRENCE_OCCURRENCE_COUNT');
    expect(() => normalizeRecurrenceEndRule({
      end_type: 'end_date',
      end_date: '2026-08-09',
    }, date('2026-08-10'))).toThrow('RECURRENCE_END_BEFORE_START');
    expect(() => normalizeRecurrenceEndRule({
      end_type: 'never',
      occurrence_count: 6,
    }, date('2026-08-10'))).toThrow('CONTRADICTORY_RECURRENCE_END_RULE');
  });

  it('projeta exatamente seis ocorrências, incluindo a primeira', () => {
    const projected = projectRecurringTransactions([{
      id: 1,
      amount: '49.90',
      type: 'expense',
      frequency: 'monthly',
      start_date: date('2026-08-10'),
      end_type: 'occurrence_count',
      occurrence_count: 6,
    }], date('2026-01-01'), date('2027-12-31'), []);

    expect(projected.map(item => item.transaction_date.toISOString().slice(0, 10))).toEqual([
      '2026-08-10',
      '2026-09-10',
      '2026-10-10',
      '2026-11-10',
      '2026-12-10',
      '2027-01-10',
    ]);
  });

  it('não projeta depois da data final', () => {
    const projected = projectRecurringTransactions([{
      id: 2,
      amount: '100.00',
      type: 'income',
      frequency: 'monthly',
      start_date: date('2026-08-15'),
      end_type: 'end_date',
      end_date: date('2026-10-20'),
    }], date('2026-08-01'), date('2027-12-31'), []);

    expect(projected.map(item => item.transaction_date.toISOString().slice(0, 10))).toEqual([
      '2026-08-15',
      '2026-09-15',
      '2026-10-15',
    ]);
  });

  it('uma série sem data final respeita somente o horizonte solicitado', () => {
    const projected = projectRecurringTransactions([{
      id: 3,
      amount: '10.00',
      type: 'expense',
      frequency: 'daily',
      start_date: date('2026-08-01'),
      end_type: 'never',
    }], date('2026-08-10'), date('2026-08-12'), []);

    expect(projected).toHaveLength(3);
    expect(projected.at(-1)?.transaction_date.toISOString().slice(0, 10)).toBe('2026-08-12');
  });
});
