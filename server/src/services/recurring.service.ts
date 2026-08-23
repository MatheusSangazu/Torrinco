import { prisma } from '../lib/prisma.js';
import { occurrenceAt, parseDate, todayUTC, type Frequency } from '../lib/date-utils.js';
import {
  firstOccurrenceOnOrAfter,
  isOccurrenceAllowed,
  normalizeRecurrenceEndRule,
  occurrenceIndexForDate,
  type RecurrenceEndRuleInput,
  type RecurrenceEndType,
} from '../lib/recurrence-rules.js';
import { getCategoryForAccount, getEntityForAccount, getIncomeSourceForUser } from './ownership.service.js';
import { assertAccountAccess } from './subscription.service.js';

export interface CreateRecurringInput extends RecurrenceEndRuleInput {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: Frequency;
  start_date: string | Date;
  category?: string;
  category_id?: number;
  income_source_id?: number;
  entity_id?: number;
  payment_method?: string;
  idempotency_key?: string;
}

export interface UpdateRecurringInput extends RecurrenceEndRuleInput {
  description?: string;
  amount?: number;
  category?: string | null;
  category_id?: number | null;
  income_source_id?: number | null;
  frequency?: Frequency;
  status?: 'active' | 'paused' | 'cancelled' | 'completed';
  entity_id?: number | null;
  payment_method?: string;
}

function sameCivilDate(left: Date, right: Date): boolean {
  return left.getUTCFullYear() === right.getUTCFullYear()
    && left.getUTCMonth() === right.getUTCMonth()
    && left.getUTCDate() === right.getUTCDate();
}

async function getAccountId(userId: number): Promise<number> {
  const user = await prisma.users.findUnique({ where: { id: userId }, select: { account_id: true } });
  if (!user) throw new Error('USER_NOT_FOUND');
  await assertAccountAccess(user.account_id);
  return user.account_id;
}

function ruleFromRecurring(recurring: any): RecurrenceEndRuleInput {
  return {
    end_type: (recurring.end_type ?? 'never') as RecurrenceEndType,
    occurrence_count: recurring.occurrence_count ?? null,
    end_date: recurring.end_date ?? null,
  };
}

async function materializeWithClient(
  db: any,
  userId: number,
  accountId: number,
  recurring: any,
  occurrenceDate: Date,
): Promise<{ transaction: any | null; created: boolean }> {
  const seriesStart = parseDate(recurring.start_date);
  const occurrenceIndex = occurrenceIndexForDate(seriesStart, recurring.frequency as Frequency, occurrenceDate);
  if (occurrenceIndex === null) throw new Error('INVALID_RECURRING_OCCURRENCE_DATE');

  if (!isOccurrenceAllowed(ruleFromRecurring(recurring), occurrenceDate, occurrenceIndex)) {
    if (recurring.status === 'active') {
      await db.recurring_transactions.update({ where: { id: recurring.id }, data: { status: 'completed' } });
    }
    return { transaction: null, created: false };
  }

  let transaction = await db.transactions.findFirst({
    where: {
      user_id: userId,
      recurring_transaction_id: recurring.id,
      recurring_occurrence_date: occurrenceDate,
    },
  });
  let created = false;

  if (!transaction) {
    try {
      transaction = await db.transactions.create({
        data: {
          account_id: accountId,
          user_id: userId,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          category_id: recurring.category_id,
          income_source_id: recurring.income_source_id,
          description: recurring.description,
          transaction_date: occurrenceDate,
          transaction_date_civil: occurrenceDate,
          status: 'paid',
          is_recurring: true,
          recurring_transaction_id: recurring.id,
          recurring_occurrence_at: occurrenceDate,
          recurring_occurrence_date: occurrenceDate,
          entity_id: recurring.entity_id,
          payment_method: recurring.payment_method,
        },
      });
      created = true;
    } catch (error: any) {
      if (error?.code !== 'P2002') throw error;
      transaction = await db.transactions.findFirst({
        where: { recurring_transaction_id: recurring.id, recurring_occurrence_date: occurrenceDate },
      });
      if (!transaction) throw error;
    }
  }

  // Materializar manualmente uma projeção futura não pode pular ocorrências
  // anteriores. O cursor só avança quando processamos a ocorrência devida.
  if (sameCivilDate(occurrenceDate, recurring.next_due_date)) {
    const nextIndex = occurrenceIndex + 1;
    const nextDueDate = occurrenceAt(seriesStart, recurring.frequency as Frequency, nextIndex);
    const nextStatus = isOccurrenceAllowed(ruleFromRecurring(recurring), nextDueDate, nextIndex) ? 'active' : 'completed';
    await db.recurring_transactions.update({
      where: { id: recurring.id },
      data: { next_due_date: nextDueDate, status: nextStatus },
    });
  }

  return { transaction, created };
}

/** Cria o template e mantém `never` como compatibilidade para consumidores antigos. */
export async function createRecurring(userId: number, input: CreateRecurringInput) {
  const accountId = await getAccountId(userId);
  const startDate = typeof input.start_date === 'string' ? parseDate(input.start_date) : new Date(input.start_date);
  const endRule = normalizeRecurrenceEndRule(input, startDate);
  const today = todayUTC();

  if (input.idempotency_key) {
    const existing = await prisma.recurring_transactions.findFirst({
      where: { creation_key: input.idempotency_key, user_id: userId },
    });
    if (existing) return existing;
  }

  let finalCategoryId = input.category_id ?? null;
  let finalCategoryName = input.category;
  if (finalCategoryId && !finalCategoryName) {
    const category = await getCategoryForAccount(finalCategoryId, accountId);
    if (!category) throw Object.assign(new Error('CATEGORY_FORBIDDEN'), { statusCode: 403 });
    finalCategoryName = category.name;
  }
  if (input.entity_id && !await getEntityForAccount(input.entity_id, accountId)) {
    throw Object.assign(new Error('ENTITY_FORBIDDEN'), { statusCode: 403 });
  }
  if (input.income_source_id && !await getIncomeSourceForUser(input.income_source_id, userId)) {
    throw Object.assign(new Error('INCOME_SOURCE_FORBIDDEN'), { statusCode: 403 });
  }

  const firstPending = firstOccurrenceOnOrAfter(startDate, input.frequency, today);
  const initialStatus = isOccurrenceAllowed(endRule, firstPending.date, firstPending.index) ? 'active' : 'completed';

  try {
    return await prisma.$transaction(async tx => {
      const recurring = await tx.recurring_transactions.create({
        data: {
          user_id: userId,
          description: input.description,
          amount: input.amount,
          type: input.type,
          category: finalCategoryName ?? null,
          category_id: finalCategoryId,
          income_source_id: input.income_source_id ?? null,
          creation_key: input.idempotency_key ?? null,
          frequency: input.frequency,
          start_date: startDate,
          next_due_date: firstPending.date,
          status: initialStatus,
          entity_id: input.entity_id ?? null,
          payment_method: input.payment_method ?? 'cash',
          ...endRule,
        },
      });

      if (initialStatus === 'active' && sameCivilDate(firstPending.date, today)) {
        await materializeWithClient(tx, userId, accountId, recurring, firstPending.date);
      }
      return await tx.recurring_transactions.findUnique({ where: { id: recurring.id } }) ?? recurring;
    });
  } catch (error: any) {
    if (error?.code === 'P2002' && input.idempotency_key) {
      const existing = await prisma.recurring_transactions.findFirst({
        where: { creation_key: input.idempotency_key, user_id: userId },
      });
      if (existing) return existing;
    }
    throw error;
  }
}

export async function updateRecurring(userId: number, recurringId: number, input: UpdateRecurringInput) {
  const existing = await prisma.recurring_transactions.findFirst({ where: { id: recurringId, user_id: userId } });
  if (!existing) throw new Error('RECURRING_NOT_FOUND');
  const accountId = await getAccountId(userId);

  if (input.category_id && !await getCategoryForAccount(input.category_id, accountId)) throw new Error('CATEGORY_FORBIDDEN');
  if (input.entity_id && !await getEntityForAccount(input.entity_id, accountId)) throw new Error('ENTITY_FORBIDDEN');
  if (input.income_source_id && !await getIncomeSourceForUser(input.income_source_id, userId)) throw new Error('INCOME_SOURCE_FORBIDDEN');

  const changesEndRule = input.end_type !== undefined || input.occurrence_count !== undefined || input.end_date !== undefined;
  const endRule = changesEndRule
    ? normalizeRecurrenceEndRule(input, existing.start_date)
    : normalizeRecurrenceEndRule(ruleFromRecurring(existing), existing.start_date);
  const frequency = input.frequency ?? existing.frequency as Frequency;
  const next = input.frequency
    ? firstOccurrenceOnOrAfter(existing.start_date, frequency, todayUTC())
    : {
        date: existing.next_due_date,
        index: occurrenceIndexForDate(existing.start_date, frequency, existing.next_due_date) ?? 0,
      };
  const ruleAllowsNext = isOccurrenceAllowed(endRule, next.date, next.index);
  const requestedStatus = input.status;
  const status = ruleAllowsNext
    ? (requestedStatus ?? (existing.status === 'completed' ? 'active' : existing.status))
    : 'completed';

  return prisma.recurring_transactions.update({
    where: { id: recurringId },
    data: {
      description: input.description,
      amount: input.amount,
      category: input.category,
      category_id: input.category_id,
      income_source_id: input.income_source_id,
      frequency: input.frequency,
      status,
      entity_id: input.entity_id,
      payment_method: input.payment_method,
      next_due_date: input.frequency ? next.date : undefined,
      ...endRule,
    },
  });
}

export async function materializeOne(userId: number, recurringId: number, date?: Date) {
  const recurring = await prisma.recurring_transactions.findFirst({
    where: { id: recurringId, user_id: userId, status: 'active' },
  });
  if (!recurring) throw new Error('RECURRING_NOT_FOUND');
  const accountId = await getAccountId(userId);
  const result = await prisma.$transaction(tx => materializeWithClient(
    tx,
    userId,
    accountId,
    recurring,
    date ?? recurring.next_due_date,
  ));
  if (!result.transaction) throw new Error('RECURRING_COMPLETED');
  return result.transaction;
}

export async function materializeDue(userId: number, upToDate: Date = new Date()) {
  const accountId = await getAccountId(userId);
  const materializeUntil = new Date(upToDate);
  materializeUntil.setUTCHours(23, 59, 59, 999);
  const due = await prisma.recurring_transactions.findMany({
    where: { user_id: userId, status: 'active', next_due_date: { lte: materializeUntil } },
    orderBy: { next_due_date: 'asc' },
  });

  const created: any[] = [];
  for (const item of due) {
    let current: any = item;
    while (current.status === 'active' && current.next_due_date.getTime() <= materializeUntil.getTime()) {
      const result = await prisma.$transaction(tx => materializeWithClient(
        tx,
        userId,
        accountId,
        current,
        current.next_due_date,
      ));
      if (result.created && result.transaction) created.push(result.transaction);
      current = await prisma.recurring_transactions.findUnique({ where: { id: current.id } }) ?? current;
    }
  }
  return created;
}

export async function listDueSoon(userId: number, days: number = 7) {
  const limit = new Date();
  limit.setUTCDate(limit.getUTCDate() + days);
  limit.setUTCHours(23, 59, 59, 999);
  return prisma.recurring_transactions.findMany({
    where: { user_id: userId, status: 'active', next_due_date: { lte: limit } },
    orderBy: { next_due_date: 'asc' },
  });
}

/** Encerra a série antes da ocorrência escolhida, preservando tudo que veio antes. */
export async function truncateRecurringFrom(userId: number, recurringId: number, effectiveDate: Date) {
  const recurring = await prisma.recurring_transactions.findFirst({ where: { id: recurringId, user_id: userId } });
  if (!recurring) throw new Error('RECURRING_NOT_FOUND');
  if (effectiveDate.getTime() < recurring.start_date.getTime() || sameCivilDate(effectiveDate, recurring.start_date)) {
    return prisma.recurring_transactions.update({ where: { id: recurringId }, data: { status: 'cancelled' } });
  }

  const endDate = new Date(effectiveDate);
  endDate.setUTCDate(endDate.getUTCDate() - 1);
  const nextIndex = occurrenceIndexForDate(
    recurring.start_date,
    recurring.frequency as Frequency,
    recurring.next_due_date,
  );
  const hasRemainingOccurrence = nextIndex !== null && isOccurrenceAllowed(
    { end_type: 'end_date', end_date: endDate },
    recurring.next_due_date,
    nextIndex,
  );
  const status = hasRemainingOccurrence
    ? (recurring.status === 'active' ? 'active' : recurring.status)
    : 'completed';
  return prisma.recurring_transactions.update({
    where: { id: recurringId },
    data: { end_type: 'end_date', occurrence_count: null, end_date: endDate, status },
  });
}

export async function cancelRecurring(userId: number, recurringId: number) {
  const result = await prisma.recurring_transactions.updateMany({
    where: { id: recurringId, user_id: userId },
    data: { status: 'cancelled' },
  });
  if (result.count === 0) throw new Error('RECURRING_NOT_FOUND');
}
