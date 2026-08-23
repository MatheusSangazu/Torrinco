import { occurrenceAt, parseDate, type Frequency } from './date-utils.js';
import { toCents } from './money.js';
import { isOccurrenceAllowed } from './recurrence-rules.js';

function civilDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function sameMoney(left: unknown, right: unknown): boolean {
  try {
    return toCents(left as any) === toCents(right as any);
  } catch {
    return false;
  }
}

/**
 * Projeção de transações recorrentes para um intervalo de datas.
 * Retorna as ocorrências virtuais que ainda não foram materializadas em
 * transações reais (para visualização no front e no forecast).
 *
 * Observação: esta lib existe enquanto a materialização automática
 * (cron) não é a fonte única. Funções de avanço de data vêm de
 * date-utils — não duplicar aqui.
 */
export function projectRecurringTransactions(
  recurringTransactions: any[],
  start: Date,
  end: Date,
  transactionsForCheck: any[],
): any[] {
  const projectedRecurring: any[] = [];

  // Normaliza o intervalo para UTC (início do dia / fim do dia)
  const utcStart = new Date(start);
  utcStart.setUTCHours(0, 0, 0, 0);
  const utcEnd = new Date(end);
  utcEnd.setUTCHours(23, 59, 59, 999);

  for (const rt of recurringTransactions) {
    const rtStartDate = parseDate(rt.start_date);
    let occurrenceIndex = 0;
    let currentDate = occurrenceAt(rtStartDate, rt.frequency as Frequency, occurrenceIndex);

    // Localiza a primeira ocorrência do intervalo sem perder a âncora da série.
    while (currentDate < utcStart && isOccurrenceAllowed(rt, currentDate, occurrenceIndex)) {
      occurrenceIndex += 1;
      currentDate = occurrenceAt(rtStartDate, rt.frequency as Frequency, occurrenceIndex);
    }

    while (currentDate <= utcEnd && isOccurrenceAllowed(rt, currentDate, occurrenceIndex)) {
      const occurrenceKey = civilDateKey(currentDate);
      const existingTransaction = transactionsForCheck.find(t => {
        const identityDate = t.recurring_occurrence_date ?? t.recurring_occurrence_at ?? t.transaction_date;
        if (Number(t.recurring_transaction_id) === Number(rt.id)) {
          return civilDateKey(identityDate) === occurrenceKey;
        }

        return !t.recurring_transaction_id && t.is_recurring &&
          t.type === rt.type &&
          t.description === rt.description &&
          sameMoney(t.amount, rt.amount) &&
          civilDateKey(identityDate) === occurrenceKey;
      });

      if (!existingTransaction) {
        projectedRecurring.push({
          id: `rec-${rt.id}-${currentDate.getTime()}`,
          amount: rt.amount,
          type: rt.type,
          category: rt.category,
          category_id: rt.category_id,
          categories: rt.categories,
          income_source_id: rt.income_source_id,
          income_sources: rt.income_sources,
          description: rt.description,
          transaction_date: new Date(currentDate),
          status: 'pending',
          is_recurring: true,
          is_projected: true,
          recurring_transaction_id: rt.id,
          recurring_transactions: rt,
          recurring_occurrence_at: new Date(currentDate),
          occurrence_index: occurrenceIndex,
          frequency: rt.frequency,
          end_type: rt.end_type ?? 'never',
          occurrence_count: rt.occurrence_count ?? null,
          end_date: rt.end_date ?? null,
          payment_method: rt.payment_method || 'pix',
          entity_id: rt.entity_id,
          financial_entities: rt.financial_entities,
        });
      }

      occurrenceIndex += 1;
      currentDate = occurrenceAt(rtStartDate, rt.frequency as Frequency, occurrenceIndex);
    }
  }

  return projectedRecurring;
}
