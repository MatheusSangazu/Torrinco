import { prisma } from '../lib/prisma.js';
import { parseDate, advanceDate, todayUTC, type Frequency } from '../lib/date-utils.js';

/**
 * Fonte única da lógica de transações recorrentes.
 *
 * Modelo: a recorrência é um TEMPLATE. Transações reais são materializadas
 * (geradas) a partir dela, vinculadas via `recurring_transaction_id` (FK).
 *
 * A deduplicação é feita por essa FK + data — confiável, ao contrário da
 * heurística antiga (descrição + valor). Se a recorrência tem
 * `next_due_date <= upToDate`, uma transação é criada naquela data e a
 * `next_due_date` avança.
 */

export interface CreateRecurringInput {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: Frequency;
  start_date: string | Date;
  category?: string;
  category_id?: number;
  entity_id?: number;
  payment_method?: string;
}

/**
 * Cria uma recorrência (template) e, se a data de início for hoje, já materializa
 * a primeira ocorrência e avança o `next_due_date`.
 */
export async function createRecurring(userId: number, input: CreateRecurringInput) {
  const {
    description, amount, type, frequency, category, category_id, entity_id, payment_method
  } = input;

  const startDate = typeof input.start_date === 'string' ? parseDate(input.start_date) : input.start_date;
  const today = todayUTC();

  // Resolve category_id/category name quando necessário.
  let finalCategoryId = category_id ?? null;
  let finalCategoryName = category ?? undefined;
  if (finalCategoryId && !finalCategoryName) {
    const cat = await prisma.categories.findUnique({ where: { id: finalCategoryId } });
    if (cat) finalCategoryName = cat.name;
  }

  const nextDueDate = startDate.getTime() >= today.getTime()
    ? startDate
    : advanceDate(frequency, startDate);

  const recurring = await prisma.recurring_transactions.create({
    data: {
      user_id: userId,
      description,
      amount,
      type,
      category: finalCategoryName ?? null,
      category_id: finalCategoryId,
      frequency,
      start_date: startDate,
      next_due_date: nextDueDate,
      status: 'active',
      entity_id: entity_id ?? null,
      payment_method: payment_method ?? 'cash'
    }
  });

  // Se a data de início for hoje, já gera a primeira ocorrência.
  const isToday = startDate.getUTCFullYear() === today.getUTCFullYear() &&
                  startDate.getUTCMonth() === today.getUTCMonth() &&
                  startDate.getUTCDate() === today.getUTCDate();

  if (isToday) {
    await materializeOne(userId, recurring.id, startDate);
  }

  return recurring;
}

/**
 * Materializa UMA ocorrência de uma recorrência, na data informada (default =
 * next_due_date). Avança o `next_due_date`. Deduplica por FK + data: se já
 * existe transação com esse `recurring_transaction_id` na mesma data, não cria.
 */
export async function materializeOne(userId: number, recurringId: number, date?: Date) {
  const recurring = await prisma.recurring_transactions.findFirst({
    where: { id: recurringId, user_id: userId, status: 'active' }
  });
  if (!recurring) throw new Error('RECURRING_NOT_FOUND');

  const account = await prisma.accounts.findFirst({
    where: { users: { some: { id: userId } } }
  });
  if (!account) throw new Error('ACCOUNT_NOT_FOUND');

  const txDate = date ?? recurring.next_due_date;

  // Deduplicação robusta por FK + data (mesma regra usada em materializeDue).
  const existing = await prisma.transactions.findFirst({
    where: {
      user_id: userId,
      recurring_transaction_id: recurringId,
      transaction_date: txDate
    }
  });
  if (existing) return existing;

  const created = await prisma.transactions.create({
    data: {
      account_id: account.id,
      user_id: userId,
      amount: recurring.amount,
      type: recurring.type,
      category: recurring.category,
      category_id: recurring.category_id,
      description: recurring.description,
      transaction_date: txDate,
      status: 'paid',
      is_recurring: true,
      recurring_transaction_id: recurring.id,
      entity_id: recurring.entity_id,
      payment_method: recurring.payment_method
    }
  });

  // Avança a próxima data de vencimento.
  const nextDueDate = advanceDate(recurring.frequency as Frequency, recurring.next_due_date);
  await prisma.recurring_transactions.update({
    where: { id: recurring.id },
    data: { next_due_date: nextDueDate }
  });

  return created;
}

/**
 * Materializa todas as ocorrências vencidas de um usuário (next_due_date <= upToDate).
 * Usada pelo cron diário (FASE 4) e pelo endpoint de gatilho.
 * Retorna as transações criadas.
 */
export async function materializeDue(userId: number, upToDate: Date = new Date()) {
  const due = await prisma.recurring_transactions.findMany({
    where: {
      user_id: userId,
      status: 'active',
      next_due_date: { lte: upToDate }
    },
    orderBy: { next_due_date: 'asc' }
  });

  const created = [];
  for (const recurring of due) {
    // Materializa enquanto houver vencimento passado (suporta mês atrasado, etc.).
    let current = recurring;
    while (current.next_due_date.getTime() <= upToDate.getTime()) {
      const tx = await materializeOne(userId, current.id);
      if (tx) created.push(tx);
      // Recarrega para obter o novo next_due_date.
      current = await prisma.recurring_transactions.findUnique({ where: { id: current.id } }) ?? current;
    }
  }
  return created;
}

/**
 * Lista as recorrências ativas de um usuário com vencimento até `days` dias à frente.
 */
export async function listDueSoon(userId: number, days: number = 7) {
  const limit = new Date();
  limit.setUTCDate(limit.getUTCDate() + days);
  limit.setUTCHours(23, 59, 59, 999);

  return prisma.recurring_transactions.findMany({
    where: {
      user_id: userId,
      status: 'active',
      next_due_date: { lte: limit }
    },
    orderBy: { next_due_date: 'asc' }
  });
}
