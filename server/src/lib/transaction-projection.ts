import { addMonths } from './date-utils.js';

/**
 * Projeção de transações recorrentes
 */
export function projectRecurringTransactions(
  recurringTransactions: any[],
  start: Date,
  end: Date,
  transactionsForCheck: any[]
): any[] {
  const projectedRecurring: any[] = [];
  
  for (const rt of recurringTransactions) {
    const rtStartDate = new Date(rt.start_date);

    let currentDate = new Date(rtStartDate);

    if (rt.frequency === 'monthly') {
      const monthsDiff = (start.getFullYear() - rtStartDate.getFullYear()) * 12 + (start.getMonth() - rtStartDate.getMonth());
      if (monthsDiff > 0) {
        currentDate = addMonths(rtStartDate, monthsDiff);
      }
    } else if (rt.frequency === 'yearly') {
      const yearsDiff = start.getFullYear() - rtStartDate.getFullYear();
      if (yearsDiff > 0) {
        currentDate.setFullYear(rtStartDate.getFullYear() + yearsDiff);
      }
    } else {
      while (currentDate < start) {
        if (rt.frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
        else if (rt.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
      }
    }

    while (currentDate < start) {
      if (rt.frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
      else if (rt.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
      else if (rt.frequency === 'monthly') currentDate = addMonths(currentDate, 1);
      else if (rt.frequency === 'yearly') currentDate.setFullYear(currentDate.getFullYear() + 1);
    }

    while (currentDate <= end) {
      const existingTransaction = transactionsForCheck.find(t => 
        t.is_recurring && 
        t.type === rt.type &&
        t.description === rt.description && 
        Math.abs(Number(t.amount) - Number(rt.amount)) < 0.01 &&
        new Date(t.transaction_date).getDate() === currentDate.getDate() &&
        new Date(t.transaction_date).getMonth() === currentDate.getMonth() &&
        new Date(t.transaction_date).getFullYear() === currentDate.getFullYear()
      );

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
      
      if (rt.frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
      else if (rt.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
      else if (rt.frequency === 'monthly') currentDate = addMonths(currentDate, 1);
      else if (rt.frequency === 'yearly') currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }
  
  return projectedRecurring;
}
