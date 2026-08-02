import { prisma } from '../lib/prisma.js';
import { projectRecurringTransactions } from '../lib/transaction-projection.js';

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

  const year = refDate.getUTCFullYear();
  const month = refDate.getUTCMonth();

  // Fechamento do mês corrente (fim do dia, UTC).
  const closingThisMonth = new Date(Date.UTC(year, month, closingDay, 23, 59, 59, 999));

  let periodEnd: Date;
  if (refDate.getTime() > closingThisMonth.getTime()) {
    // Já passou do fechamento → a fatura aberta fecha no próximo mês.
    periodEnd = new Date(Date.UTC(year, month + 1, closingDay, 23, 59, 59, 999));
  } else {
    periodEnd = closingThisMonth;
  }

  // Início do período: dia seguinte ao fechamento do mês anterior ao periodEnd.
  const prevClosing = new Date(Date.UTC(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth() - 1, closingDay));
  const periodStart = new Date(prevClosing);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);
  periodStart.setUTCHours(0, 0, 0, 0);

  // Vencimento: se dueDay < closingDay, vence no mês seguinte ao fechamento.
  let dueDate: Date;
  if (dueDay < closingDay) {
    dueDate = new Date(Date.UTC(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth() + 1, dueDay));
  } else {
    dueDate = new Date(Date.UTC(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), dueDay));
  }

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

  // Desloca o periodEnd por `offset` meses mantendo o dia de fechamento.
  const baseEnd = new Date(current.periodEnd);
  const targetEnd = new Date(Date.UTC(baseEnd.getUTCFullYear(), baseEnd.getUTCMonth() + offset, closingDay, 23, 59, 59, 999));

  const prevClosing = new Date(Date.UTC(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth() - 1, closingDay));
  const periodStart = new Date(prevClosing);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);
  periodStart.setUTCHours(0, 0, 0, 0);

  let dueDate: Date;
  if (dueDay < closingDay) {
    dueDate = new Date(Date.UTC(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth() + 1, dueDay));
  } else {
    dueDate = new Date(Date.UTC(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth(), dueDay));
  }

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
  const autoStatus = now.getTime() > period.periodEnd.getTime() ? 'closed' : 'open';

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
async function getBillItems(cardId: number, userId: number, period: BillPeriod) {
  const transactions = await prisma.transactions.findMany({
    where: {
      user_id: userId,
      entity_id: cardId,
      type: 'expense',
      transaction_date: { gte: period.periodStart, lte: period.periodEnd },
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
    include: { financial_entities: true, transactions: true }
  });
  if (!bill) throw new Error('BILL_NOT_FOUND');

  const period: BillPeriod = {
    periodStart: bill.period_start,
    periodEnd: bill.period_end,
    closingDate: bill.closing_date,
    dueDate: bill.due_date
  };

  const { items, total } = await getBillItems(bill.card_id, userId, period);

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
  paymentDate?: Date
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

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error('USER_NOT_FOUND');

  const date = paymentDate ?? new Date();

  return prisma.$transaction(async (tx) => {
    const payment = await tx.transactions.create({
      data: {
        account_id: user.account_id,
        user_id: userId,
        amount: total,
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

    return tx.card_bills.update({
      where: { id: billId },
      data: {
        status: 'paid',
        payment_transaction_id: payment.id,
        paid_at: date
      }
    });
  });
}

/**
 * Desfaz o pagamento de uma fatura: soft-delete da transação vinculada e
 * restauração do status (via FK, não por string matching).
 */
export async function undoPayment(billId: number, userId: number) {
  const bill = await prisma.card_bills.findFirst({
    where: { id: billId, user_id: userId },
    include: { transactions: true }
  });
  if (!bill) throw new Error('BILL_NOT_FOUND');
  if (bill.status !== 'paid' || !bill.payment_transaction_id) throw new Error('BILL_NOT_PAID');

  const now = new Date();
  // status restaurado: se a fatura já fechou → closed, senão → open
  const restoredStatus = now.getTime() > bill.period_end.getTime() ? 'closed' : 'open';

  return prisma.$transaction(async (tx) => {
    await tx.transactions.update({
      where: { id: bill.payment_transaction_id! },
      data: { deleted_at: now }
    });

    return tx.card_bills.update({
      where: { id: billId },
      data: {
        status: restoredStatus,
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
      status: bill?.status ?? (new Date().getTime() > period.dueDate.getTime() ? 'closed' : 'open'),
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
  await prisma.card_bills.updateMany({
    where: {
      card_id: cardId,
      user_id: userId,
      status: 'open',
      period_end: { lt: new Date() }
    },
    data: { status: 'closed', closed_at: new Date() }
  });

  return bill;
}
