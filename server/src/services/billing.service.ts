import { prisma } from '../lib/prisma.js';
import { projectRecurringTransactions } from '../lib/transaction-projection.js';

function lastDayOfMonthUTC(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function clampDayOfMonthUTC(year: number, monthIndex: number, day: number): number {
  return Math.min(day, lastDayOfMonthUTC(year, monthIndex));
}

function dateOnlyUTC(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
}

function asDateOnlyUTC(d: Date): Date {
  return dateOnlyUTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function endOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
}

function shiftMonth(year: number, monthIndex: number, offset: number): { year: number; monthIndex: number } {
  const m = monthIndex + offset;
  const y = year + Math.floor(m / 12);
  const mm = ((m % 12) + 12) % 12;
  return { year: y, monthIndex: mm };
}

async function getAccountIdByUserId(userId: number): Promise<number> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { account_id: true }
  });
  if (!user) throw new Error('USER_NOT_FOUND');
  return user.account_id;
}

/**
 * Fonte única da lógica de faturas de cartão de crédito.
 *
 * Toda regra de ciclo, status e pagamento vive aqui — controllers e outros
 * serviços não devem reimplementar cálculo de período nem detecção de
 * "fatura paga". O status e o vínculo de pagamento são persistidos na tabela
 * `card_bills`, eliminando a heurística por string matching.
 */

export interface BillPeriod {
  /** Início do período de compras (dia seguinte ao fechamento anterior). */
  periodStart: Date;
  /** Fim do período de compras = data de fechamento. */
  periodEnd: Date;
  /** Data de fechamento da fatura (= periodEnd). */
  closingDate: Date;
  /** Data de vencimento. */
  dueDate: Date;
}

/**
 * Calcula o período da fatura "atual/aberta" para uma data de referência.
 * Fonte única — não duplicar esta lógica em controllers.
 *
 * - Se refDate > fechamento do mês corrente, a fatura aberta fecha no mês seguinte.
 * - período de compras = [fechamento anterior + 1 dia, fechamento atual].
 */
export function computeBillPeriod(
  closingDay: number,
  dueDay: number,
  refDate: Date = new Date()
): BillPeriod {
  // Defensivo: se os dias chegarem null/undefined (cartão legado mal cadastrado),
  // lança em vez de gerar NaN silencioso que corrompe a fatura.
  if (!Number.isInteger(closingDay) || closingDay < 1 || closingDay > 31) {
    throw new Error(`closing_day inválido: ${closingDay}. Configure o cartão com dia de fechamento (1-31).`);
  }
  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) {
    throw new Error(`due_day inválido: ${dueDay}. Configure o cartão com dia de vencimento (1-31).`);
  }

  const ref = asDateOnlyUTC(refDate);
  const year = ref.getUTCFullYear();
  const month = ref.getUTCMonth();

  const closingThisMonth = dateOnlyUTC(year, month, clampDayOfMonthUTC(year, month, closingDay));

  let periodEnd: Date;
  if (ref.getTime() > closingThisMonth.getTime()) {
    const next = shiftMonth(year, month, 1);
    periodEnd = dateOnlyUTC(next.year, next.monthIndex, clampDayOfMonthUTC(next.year, next.monthIndex, closingDay));
  } else {
    periodEnd = closingThisMonth;
  }

  const prev = shiftMonth(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), -1);
  const prevClosing = dateOnlyUTC(prev.year, prev.monthIndex, clampDayOfMonthUTC(prev.year, prev.monthIndex, closingDay));
  const periodStart = new Date(prevClosing);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);
  periodStart.setUTCHours(0, 0, 0, 0);

  const dueBase = dueDay < closingDay
    ? shiftMonth(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), 1)
    : { year: periodEnd.getUTCFullYear(), monthIndex: periodEnd.getUTCMonth() };
  const dueDate = dateOnlyUTC(dueBase.year, dueBase.monthIndex, clampDayOfMonthUTC(dueBase.year, dueBase.monthIndex, dueDay));

  return { periodStart, periodEnd, closingDate: periodEnd, dueDate };
}

/**
 * Calcula o período de uma fatura histórica/futura por offset de ciclo.
 * offset 0 = ciclo atual, -1 = anterior, +1 = próximo, etc.
 */
export function computeBillPeriodByOffset(
  closingDay: number,
  dueDay: number,
  offset: number,
  refDate: Date = new Date()
): BillPeriod {
  const current = computeBillPeriod(closingDay, dueDay, refDate);
  if (offset === 0) return current;

  const baseEnd = asDateOnlyUTC(current.periodEnd);
  const target = shiftMonth(baseEnd.getUTCFullYear(), baseEnd.getUTCMonth(), offset);
  const targetEnd = dateOnlyUTC(target.year, target.monthIndex, clampDayOfMonthUTC(target.year, target.monthIndex, closingDay));

  const prev = shiftMonth(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth(), -1);
  const prevClosing = dateOnlyUTC(prev.year, prev.monthIndex, clampDayOfMonthUTC(prev.year, prev.monthIndex, closingDay));
  const periodStart = new Date(prevClosing);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);
  periodStart.setUTCHours(0, 0, 0, 0);

  const dueBase = dueDay < closingDay
    ? shiftMonth(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth(), 1)
    : { year: targetEnd.getUTCFullYear(), monthIndex: targetEnd.getUTCMonth() };
  const dueDate = dateOnlyUTC(dueBase.year, dueBase.monthIndex, clampDayOfMonthUTC(dueBase.year, dueBase.monthIndex, dueDay));

  return { periodStart, periodEnd: targetEnd, closingDate: targetEnd, dueDate };
}

/**
 * Busca ou cria a fatura do ciclo atual de um cartão.
 * Sincroniza o status (abre/fecha) conforme a data atual.
 */
export async function getOrCreateCurrentBill(cardId: number, userId: number) {
  const accountId = await getAccountIdByUserId(userId);
  const card = await prisma.financial_entities.findFirst({
    where: { id: cardId, account_id: accountId, type: 'credit_card' }
  });
  if (!card) throw new Error('CARD_NOT_FOUND');

  const closingDay = card.closing_day ?? 1;
  const dueDay = card.due_day ?? 10;
  const period = computeBillPeriod(closingDay, dueDay);

  // status automático: se passou do fechamento e não foi paga → closed
  const now = new Date();
  const today = asDateOnlyUTC(now);
  const autoStatus = today.getTime() > period.periodEnd.getTime() ? 'closed' : 'open';

  const bill = await prisma.card_bills.upsert({
    where: { card_id_period_start: { card_id: cardId, period_start: period.periodStart } },
    update: {}, // não sobrescreve status/pagamento já definidos
    create: {
      card_id: cardId,
      user_id: userId,
      period_start: period.periodStart,
      period_end: period.periodEnd,
      closing_date: period.closingDate,
      due_date: period.dueDate,
      status: autoStatus,
      closed_at: autoStatus === 'closed' ? now : null
    }
  });

  return { bill, card, period };
}

/**
 * Busca uma fatura por offset de ciclo, criando se for a atual e não existir.
 */
export async function getBillByOffset(cardId: number, userId: number, offset: number) {
  const accountId = await getAccountIdByUserId(userId);
  const card = await prisma.financial_entities.findFirst({
    where: { id: cardId, account_id: accountId, type: 'credit_card' }
  });
  if (!card) throw new Error('CARD_NOT_FOUND');

  const closingDay = card.closing_day ?? 1;
  const dueDay = card.due_day ?? 10;

  // Para a fatura atual (offset 0), garantir existência via getOrCreate.
  if (offset === 0) {
    return getOrCreateCurrentBill(cardId, userId);
  }

  const period = computeBillPeriodByOffset(closingDay, dueDay, offset);
  const bill = await prisma.card_bills.findUnique({
    where: { card_id_period_start: { card_id: cardId, period_start: period.periodStart } }
  });

  return { bill, card, period };
}

/**
 * Retorna os itens de uma fatura: transações reais no período + recorrências
 * projetadas (ainda não materializadas). Centraliza a composição da fatura.
 */
export async function getBillItems(cardId: number, userId: number, period: BillPeriod) {
  const periodEndForQuery = endOfDayUTC(period.periodEnd);
  const transactions = await prisma.transactions.findMany({
    where: {
      user_id: userId,
      entity_id: cardId,
      type: 'expense',
      transaction_date: { gte: period.periodStart, lte: periodEndForQuery },
      deleted_at: null
    },
    include: { categories: true, purchase_installments: true },
    orderBy: { transaction_date: 'desc' }
  });

  const recurring = await prisma.recurring_transactions.findMany({
    where: { user_id: userId, status: 'active', payment_method: 'credit', entity_id: cardId },
    include: { categories: true }
  });

  const projected = projectRecurringTransactions(recurring, period.periodStart, period.periodEnd, transactions);

  const items = [
    ...transactions.map(t => ({
      id: t.id,
      description: t.description,
      amount: Number(t.amount),
      transaction_date: t.transaction_date,
      type: t.type,
      category: t.categories?.name ?? t.category,
      installment_number: t.installment_number,
      installment_id: t.installment_id,
      purchase_installments: t.purchase_installments
        ? {
            description: t.purchase_installments.description,
            installment_count: t.purchase_installments.installment_count,
            installment_value: Number(t.purchase_installments.installment_value)
          }
        : null
    })),
    ...projected.map(pr => ({
      id: pr.id,
      description: pr.description,
      amount: Number(pr.amount),
      transaction_date: pr.transaction_date,
      type: pr.type,
      category: pr.categories?.name ?? pr.category,
      is_projected: true
    }))
  ];

  const total = items.reduce((sum, t) => sum + Number(t.amount), 0);
  return { items, total };
}

/**
 * Detalhe completo de uma fatura (por id).
 */
export async function getBillDetails(billId: number, userId: number) {
  const bill = await prisma.card_bills.findFirst({
    where: { id: billId, user_id: userId },
    include: {
      financial_entities: true,
      transactions: true,
      payments: { where: { reversed_at: null }, orderBy: { paid_at: 'asc' } }
    }
  });
  if (!bill) throw new Error('BILL_NOT_FOUND');

  const period: BillPeriod = {
    periodStart: bill.period_start,
    periodEnd: bill.period_end,
    closingDate: bill.closing_date,
    dueDate: bill.due_date
  };

  const { items, total } = await getBillItems(bill.card_id, userId, period);
  const paidAmount = bill.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const remainingAmount = Math.max(0, total - paidAmount);

  return {
    bill: {
      id: bill.id,
      status: bill.status,
      period_start: bill.period_start,
      period_end: bill.period_end,
      closing_date: bill.closing_date,
      due_date: bill.due_date,
      payment_transaction_id: bill.payment_transaction_id,
      paid_at: bill.paid_at,
      closed_at: bill.closed_at,
      total_amount: total,
      paid_amount: paidAmount,
      remaining_amount: remainingAmount,
      payments: bill.payments.map(payment => ({
        id: payment.id,
        amount: Number(payment.amount),
        paid_at: payment.paid_at,
        transaction_id: payment.transaction_id
      })),
      items
    },
    card: bill.financial_entities
  };
}

/**
 * Fecha uma fatura (open → closed).
 */
export async function closeBill(billId: number, userId: number) {
  const bill = await prisma.card_bills.findFirst({ where: { id: billId, user_id: userId } });
  if (!bill) throw new Error('BILL_NOT_FOUND');
  if (bill.status !== 'open') throw new Error('BILL_NOT_OPEN');

  return prisma.card_bills.update({
    where: { id: billId },
    data: { status: 'closed', closed_at: new Date() }
  });
}

/**
 * Registra o pagamento de uma fatura: cria a transação de "Pagamento de
 * Cartão" e a vincula via FK (payment_transaction_id). Tudo em transação.
 */
export async function registerPayment(
  billId: number,
  userId: number,
  paymentMethod: string = 'pix',
  paymentDate?: Date,
  requestedAmount?: number
) {
  const bill = await prisma.card_bills.findFirst({
    where: { id: billId, user_id: userId },
    include: { financial_entities: true }
  });
  if (!bill) throw new Error('BILL_NOT_FOUND');
  if (bill.status === 'paid') throw new Error('BILL_ALREADY_PAID');

  const { total } = await getBillItems(bill.card_id, userId, {
    periodStart: bill.period_start,
    periodEnd: bill.period_end,
    closingDate: bill.closing_date,
    dueDate: bill.due_date
  });
  const activePayments = await prisma.card_bill_payments.aggregate({
    where: { bill_id: billId, user_id: userId, reversed_at: null },
    _sum: { amount: true }
  });
  const alreadyPaid = Number(activePayments._sum.amount ?? 0);
  const remainingBeforePayment = Math.max(0, total - alreadyPaid);
  const amount = requestedAmount ?? remainingBeforePayment;
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('INVALID_PAYMENT_AMOUNT');
  if (amount > remainingBeforePayment + 0.005) throw new Error('PAYMENT_EXCEEDS_REMAINING');

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error('USER_NOT_FOUND');

  const date = paymentDate ?? new Date();

  return prisma.$transaction(async (tx) => {
    const payment = await tx.transactions.create({
      data: {
        account_id: user.account_id,
        user_id: userId,
        amount,
        type: 'expense',
        status: 'paid',
        category: 'Pagamento de Cartão',
        category_id: null,
        description: `Pagamento Fatura ${bill.financial_entities.name}`,
        transaction_date: date,
        payment_method: paymentMethod,
        card_bill_paid: { connect: { id: billId } }
      }
    });

    await tx.card_bill_payments.create({
      data: {
        bill_id: billId,
        user_id: userId,
        transaction_id: payment.id,
        amount,
        paid_at: date
      }
    });

    const paidAmount = alreadyPaid + amount;
    const fullyPaid = paidAmount + 0.005 >= total;
    const updatedBill = await tx.card_bills.update({
      where: { id: billId },
      data: {
        status: fullyPaid ? 'paid' : 'partially_paid',
        payment_transaction_id: fullyPaid ? payment.id : null,
        paid_at: fullyPaid ? date : null
      }
    });
    return {
      ...updatedBill,
      total_amount: total,
      paid_amount: paidAmount,
      remaining_amount: Math.max(0, total - paidAmount),
      payment_id: payment.id
    };
  });
}

/**
 * Desfaz o pagamento de uma fatura: soft-delete da transação vinculada e
 * restauração do status (via FK, não por string matching).
 */
export async function undoPayment(billId: number, userId: number, paymentId?: number) {
  const bill = await prisma.card_bills.findFirst({
    where: { id: billId, user_id: userId },
    include: {
      payments: {
        where: { reversed_at: null, ...(paymentId ? { id: paymentId } : {}) },
        orderBy: { paid_at: 'desc' },
        take: 1
      }
    }
  });
  if (!bill) throw new Error('BILL_NOT_FOUND');
  const payment = bill.payments[0];
  if (!payment) throw new Error('BILL_NOT_PAID');

  const now = new Date();
  return prisma.$transaction(async (tx) => {
    await tx.transactions.update({
      where: { id: payment.transaction_id },
      data: { deleted_at: now }
    });

    await tx.card_bill_payments.update({
      where: { id: payment.id },
      data: { reversed_at: now }
    });

    const remainingPayments = await tx.card_bill_payments.aggregate({
      where: { bill_id: billId, reversed_at: null },
      _sum: { amount: true }
    });
    const stillPaid = Number(remainingPayments._sum.amount ?? 0);
    const baseStatus = stillPaid > 0
      ? 'partially_paid'
      : (asDateOnlyUTC(now).getTime() > bill.due_date.getTime() ? 'overdue'
        : asDateOnlyUTC(now).getTime() > bill.period_end.getTime() ? 'closed' : 'open');

    return tx.card_bills.update({
      where: { id: billId },
      data: {
        status: baseStatus,
        payment_transaction_id: null,
        paid_at: null
      }
    });
  });
}

/**
 * Histórico de faturas de um cartão (das mais recentes para as mais antigas).
 */
export async function getHistory(cardId: number, userId: number, months: number = 6) {
  const accountId = await getAccountIdByUserId(userId);
  const card = await prisma.financial_entities.findFirst({
    where: { id: cardId, account_id: accountId, type: 'credit_card' }
  });
  if (!card) throw new Error('CARD_NOT_FOUND');

  const closingDay = card.closing_day ?? 1;
  const dueDay = card.due_day ?? 10;
  const historyLength = Math.min(months, 24);

  const result = [];
  const today = asDateOnlyUTC(new Date());
  for (let i = 0; i < historyLength; i++) {
    const period = computeBillPeriodByOffset(closingDay, dueDay, -i);

    let bill = await prisma.card_bills.findUnique({
      where: { card_id_period_start: { card_id: cardId, period_start: period.periodStart } }
    });

    // Se for o ciclo atual e não existir, cria.
    if (!bill && i === 0) {
      const created = await getOrCreateCurrentBill(cardId, userId);
      bill = created.bill;
    }

    const { items, total } = await getBillItems(cardId, userId, period);

    result.push({
      period_start: period.periodStart,
      period_end: period.periodEnd,
      closing_date: period.closingDate,
      due_date: period.dueDate,
      bill_id: bill?.id ?? null,
      status: bill?.status ?? (today.getTime() > period.dueDate.getTime() ? 'closed' : 'open'),
      total_amount: total,
      item_count: items.length,
      items
    });
  }

  return result;
}

/**
 * Sincroniza o ciclo de faturas de um cartão: garante que a fatura do ciclo
 * atual exista e que faturas cujo fechamento passou estejam como "closed".
 * Usado pelo job de ciclo (Fase 4) e antes de consultas críticas.
 */
export async function syncBillCycle(cardId: number, userId: number) {
  const { bill } = await getOrCreateCurrentBill(cardId, userId);

  // Fecha faturas abertas cujo período já encerrou.
  const today = asDateOnlyUTC(new Date());
  await prisma.card_bills.updateMany({
    where: {
      card_id: cardId,
      user_id: userId,
      status: 'open',
      period_end: { lt: today }
    },
    data: { status: 'closed', closed_at: new Date() }
  });

  await prisma.card_bills.updateMany({
    where: {
      card_id: cardId,
      user_id: userId,
      status: { in: ['closed', 'partially_paid'] },
      due_date: { lt: today }
    },
    data: { status: 'overdue' }
  });

  return bill;
}
