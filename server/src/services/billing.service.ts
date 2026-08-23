import { prisma } from '../lib/prisma.js';
import { projectRecurringTransactions } from '../lib/transaction-projection.js';
import { asDateOnlyUTC, computeBillPeriod, computeBillPeriodByOffset, endOfDayUTC, type BillPeriod } from '../lib/card-billing-period.js';
import { centsToLegacyNumber, toCents } from '../lib/money.js';

export { computeBillPeriod, computeBillPeriodByOffset } from '../lib/card-billing-period.js';
export type { BillPeriod } from '../lib/card-billing-period.js';

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

  const totalCents = transactions.reduce((sum, item) => sum + toCents(item.amount), 0n)
    + projected.reduce((sum, item) => sum + toCents(item.amount), 0n);
  const total = centsToLegacyNumber(totalCents);
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
  const totalCents = toCents(total);
  const paidCents = bill.payments.reduce((sum, payment) => sum + toCents(payment.amount), 0n);
  const remainingCents = totalCents > paidCents ? totalCents - paidCents : 0n;

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
      paid_amount: centsToLegacyNumber(paidCents),
      remaining_amount: centsToLegacyNumber(remainingCents),
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
  const totalCents = toCents(total);
  const alreadyPaidCents = toCents(activePayments._sum.amount ?? 0);
  const remainingBeforePaymentCents = totalCents > alreadyPaidCents ? totalCents - alreadyPaidCents : 0n;
  const amountCents = requestedAmount === undefined ? remainingBeforePaymentCents : toCents(requestedAmount);
  if (amountCents <= 0n) throw new Error('INVALID_PAYMENT_AMOUNT');
  if (amountCents > remainingBeforePaymentCents) throw new Error('PAYMENT_EXCEEDS_REMAINING');
  const amount = centsToLegacyNumber(amountCents);

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

    const paidAmountCents = alreadyPaidCents + amountCents;
    const fullyPaid = paidAmountCents >= totalCents;
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
      paid_amount: centsToLegacyNumber(paidAmountCents),
      remaining_amount: centsToLegacyNumber(totalCents > paidAmountCents ? totalCents - paidAmountCents : 0n),
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
    const stillPaidCents = toCents(remainingPayments._sum.amount ?? 0);
    const baseStatus = stillPaidCents > 0n
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
