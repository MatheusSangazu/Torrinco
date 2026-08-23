import { occurrenceAt, parseDate, type Frequency } from './date-utils.js';

export type RecurrenceEndType = 'occurrence_count' | 'end_date' | 'never';

export interface RecurrenceEndRuleInput {
  end_type?: RecurrenceEndType | null;
  occurrence_count?: number | null;
  end_date?: string | Date | null;
}

export interface NormalizedRecurrenceEndRule {
  end_type: RecurrenceEndType;
  occurrence_count: number | null;
  end_date: Date | null;
}

function civilTime(value: string | Date): number {
  const date = parseDate(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** Valida combinações e aplica `never` apenas para consumidores legados. */
export function normalizeRecurrenceEndRule(
  input: RecurrenceEndRuleInput,
  startDate: string | Date,
): NormalizedRecurrenceEndRule {
  const endType = input.end_type ?? 'never';

  if (endType === 'occurrence_count') {
    if (!Number.isInteger(input.occurrence_count) || Number(input.occurrence_count) <= 0) {
      throw new Error('INVALID_RECURRENCE_OCCURRENCE_COUNT');
    }
    if (input.end_date) throw new Error('CONTRADICTORY_RECURRENCE_END_RULE');
    return { end_type: endType, occurrence_count: Number(input.occurrence_count), end_date: null };
  }

  if (endType === 'end_date') {
    if (!input.end_date) throw new Error('INVALID_RECURRENCE_END_DATE');
    if (input.occurrence_count != null) throw new Error('CONTRADICTORY_RECURRENCE_END_RULE');
    const endDate = parseDate(input.end_date);
    if (civilTime(endDate) < civilTime(startDate)) throw new Error('RECURRENCE_END_BEFORE_START');
    return { end_type: endType, occurrence_count: null, end_date: endDate };
  }

  if (input.occurrence_count != null || input.end_date) throw new Error('CONTRADICTORY_RECURRENCE_END_RULE');
  return { end_type: 'never', occurrence_count: null, end_date: null };
}

export function isOccurrenceAllowed(
  rule: RecurrenceEndRuleInput,
  occurrenceDate: Date,
  occurrenceIndex: number,
): boolean {
  const endType = rule.end_type ?? 'never';
  if (endType === 'occurrence_count') return occurrenceIndex < Number(rule.occurrence_count ?? 0);
  if (endType === 'end_date') return !!rule.end_date && civilTime(occurrenceDate) <= civilTime(rule.end_date);
  return true;
}

/** Localiza o índice exato de uma data programada na série. */
export function occurrenceIndexForDate(start: Date, frequency: Frequency, target: Date): number | null {
  const targetTime = civilTime(target);
  let index = 0;
  let occurrence = occurrenceAt(start, frequency, index);
  while (civilTime(occurrence) < targetTime) {
    index += 1;
    occurrence = occurrenceAt(start, frequency, index);
  }
  return civilTime(occurrence) === targetTime ? index : null;
}

/** Primeira ocorrência programada igual ou posterior à data de referência. */
export function firstOccurrenceOnOrAfter(start: Date, frequency: Frequency, reference: Date) {
  let index = 0;
  let date = occurrenceAt(start, frequency, index);
  while (civilTime(date) < civilTime(reference)) {
    index += 1;
    date = occurrenceAt(start, frequency, index);
  }
  return { date, index };
}
