import { advanceDate, parseDate, type Frequency } from './date-utils.js';

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
  transactionsForCheck: any[]
): any[] {
  const projectedRecurring: any[] = [];

  // Normaliza o intervalo para UTC (início do dia / fim do dia)
  const utcStart = new Date(start);
  utcStart.setUTCHours(0, 0, 0, 0);
  const utcEnd = new Date(end);
  utcEnd.setUTCHours(23, 59, 59, 999);

  for (const rt of recurringTransactions) {
    const rtStartDate = parseDate(rt.start_date);
    const targetDay = rtStartDate.getUTCDate();
    let currentDate = new Date(rtStartDate);

    // Avança a data até a primeira ocorrência dentro/antes do intervalo,
    // usando a função única advanceDate (elimina os blocos while duplicados).
    while (currentDate < utcStart) {
      currentDate = advanceDate(rt.frequency as Frequency, currentDate);
      // Preserva o dia original em recorrências mensais/anuais (correção de virada de mês)
      if ((rt.frequency === 'monthly' || rt.frequency === 'yearly') &&
          currentDate.getUTCDate() !== targetDay) {
        currentDate.setUTCDate(0);
      }
    }

    while (currentDate <= utcEnd) {
      const existingTransaction = transactionsForCheck.find(t => {
        const tDate = new Date(t.transaction_date);
        return t.is_recurring &&
          t.type === rt.type &&
          t.description === rt.description &&
          Math.abs(Number(t.amount) - Number(rt.amount)) < 0.01 &&
          tDate.getUTCDate() === currentDate.getUTCDate() &&
          tDate.getUTCMonth() === currentDate.getUTCMonth() &&
          tDate.getUTCFullYear() === currentDate.getUTCFullYear();
      });

      if (!existingTransaction) {
        projectedRecurring.push({
          id: `rec-${rt.id}-${currentDate.getTime()}`,
          amount: rt.amount,
          type: rt.type,
          category: rt.category,
          category_id: rt.category_id,
          categories: rt.categories,
          description: rt.description,
          transaction_date: new Date(currentDate),
          status: 'pending',
          is_recurring: true,
          is_projected: true,
          payment_method: rt.payment_method || 'pix',
          entity_id: rt.entity_id,
          financial_entities: rt.financial_entities
        });
      }

      currentDate = advanceDate(rt.frequency as Frequency, currentDate);
      if ((rt.frequency === 'monthly' || rt.frequency === 'yearly') &&
          currentDate.getUTCDate() !== targetDay) {
        currentDate.setUTCDate(0);
      }
    }
  }

  return projectedRecurring;
}
