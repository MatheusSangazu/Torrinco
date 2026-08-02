import { prisma } from '../lib/prisma.js';
import { parseDate, addMonths, todayUTC, type Frequency } from '../lib/date-utils.js';

async function getAccountIdByUserId(userId: number): Promise<number> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { account_id: true }
  });
  if (!user) throw new Error('USER_NOT_FOUND');
  return user.account_id;
}

/**
 * Fonte única da lógica de parcelamento de compras no cartão.
 *
 * Regra de ouro: cada parcela cai na fatura cujo fechamento ocorre APÓS a
 * data-base da parcela, respeitando o `closing_day` do cartão. Assim uma
 * compra no dia 20 de um cartão que fecha no dia 10 vai para a fatura do
 * mês seguinte — e as parcelas seguintes avançam um ciclo de fatura por vez.
 *
 * Operações multi-step (criar compra + N transações) rodam em `$transaction`.
 */

export interface CreateInstallmentInput {
  entity_id: number;
  description: string;
  amount: number;
  installment_count: number;
  start_date: string | Date;
  category?: string;
  category_id?: number;
  first_installment?: number;
}

/**
 * Determina a data de fechamento da fatura em que uma compra cai.
 * - Compra feita ATÉ o dia de fechamento (inclusive) → fatura que fecha naquele mês.
 * - Compra feita DEPOIS do fechamento → fatura do mês seguinte.
 */
function closingDateForPurchase(purchaseDate: Date, closingDay: number): Date {
  const year = purchaseDate.getUTCFullYear();
  const month = purchaseDate.getUTCMonth();
  const day = purchaseDate.getUTCDate();

  if (day <= closingDay) {
    return new Date(Date.UTC(year, month, closingDay));
  }
  return new Date(Date.UTC(year, month + 1, closingDay));
}

/**
 * Para a parcela i (0-indexed), calcula a data da transação que garante que ela
 * caia no ciclo de fatura correto. A data usada é um dia dentro do período da
 * fatura alvo, preservando (quando possível) o dia da compra original.
 */
function dueDateForInstallment(
  purchaseDate: Date,
  closingDay: number,
  installmentIndex: number
): Date {
  // Fechamento da fatura onde a PRIMEIRA parcela cai.
  const firstClosing = closingDateForPurchase(purchaseDate, closingDay);
  // Fechamento da fatura desta parcela = firstClosing + i meses.
  const targetClosing = addMonths(firstClosing, installmentIndex);

  // Início do período dessa fatura (dia seguinte ao fechamento anterior).
  const periodStart = addMonths(targetClosing, -1);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);
  periodStart.setUTCHours(0, 0, 0, 0);

  // Tenta preservar o dia da compra no mês correspondente ao targetClosing.
  const candidate = new Date(Date.UTC(
    targetClosing.getUTCFullYear(),
    targetClosing.getUTCMonth(),
    Math.min(purchaseDate.getUTCDate(), 28) // evita overflow em meses curtos
  ));

  // Se o candidato está dentro do período, usa ele; senão usa o fechamento.
  if (candidate >= periodStart && candidate <= targetClosing) {
    return candidate;
  }
  return new Date(targetClosing);
}

/**
 * Cria uma compra parcelada no cartão: registra o `purchase_installments` e as
 * N transações (uma por ciclo de fatura), respeitando o `closing_day`.
 * Tudo em `$transaction` — falha no meio não deixa estado inconsistente.
 */
export async function createInstallmentPurchase(userId: number, input: CreateInstallmentInput) {
  const { entity_id, description, amount, installment_count, category, category_id, first_installment } = input;

  const accountId = await getAccountIdByUserId(userId);
  const card = await prisma.financial_entities.findFirst({
    where: { id: entity_id, account_id: accountId, type: 'credit_card' }
  });
  if (!card) throw new Error('CARD_NOT_FOUND');

  const account = await prisma.accounts.findFirst({
    where: { users: { some: { id: userId } } }
  });
  if (!account) throw new Error('ACCOUNT_NOT_FOUND');

  const closingDay = card.closing_day ?? 1;
  const startDate = typeof input.start_date === 'string' ? parseDate(input.start_date) : input.start_date;
  const installmentValue = amount / installment_count;
  const startInstallment = first_installment ?? 1;
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase_installments.create({
      data: {
        user_id: userId,
        entity_id,
        description,
        amount,
        installment_count,
        installment_value: installmentValue,
        start_date: startDate,
        first_installment: startInstallment,
        status: 'active'
      }
    });

    const transactions = [];
    for (let i = 0; i < installment_count; i++) {
      const installmentNumber = startInstallment + i;
      const txDate = dueDateForInstallment(startDate, closingDay, i);
      // Parcela só é "paid" quando seu ciclo de fatura já passou; futuras ficam pendentes.
      const status = txDate.getTime() <= now.getTime() ? 'paid' : 'pending';

      const t = await tx.transactions.create({
        data: {
          account_id: account.id,
          user_id: userId,
          entity_id,
          amount: installmentValue,
          type: 'expense',
          status,
          category: category ?? null,
          category_id: category_id ?? null,
          description: `${description} (${installmentNumber}/${installment_count})`,
          transaction_date: txDate,
          installment_id: purchase.id,
          installment_number: installmentNumber,
          payment_method: 'credit_card'
        }
      });
      transactions.push(t);
    }

    return {
      purchase: {
        id: purchase.id,
        description: purchase.description,
        amount: Number(purchase.amount),
        installment_count: purchase.installment_count,
        installment_value: Number(purchase.installment_value),
        start_date: purchase.start_date,
        status: purchase.status
      },
      transactions
    };
  });
}

/**
 * Cancela uma compra parcelada: marca o purchase como cancelled e soft-delete
 * apenas as parcelas cuja data ainda está no futuro (preserva histórico passado).
 * Em `$transaction`.
 */
export async function cancelInstallmentPurchase(userId: number, purchaseId: number) {
  const purchase = await prisma.purchase_installments.findFirst({
    where: { id: purchaseId, user_id: userId },
    include: { transactions: true }
  });
  if (!purchase) throw new Error('PURCHASE_NOT_FOUND');
  if (purchase.status === 'cancelled') throw new Error('PURCHASE_ALREADY_CANCELLED');

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    await tx.purchase_installments.update({
      where: { id: purchaseId },
      data: { status: 'cancelled' }
    });

    // Soft-delete apenas das parcelas futuras (preserva histórico das já vencidas/pagas).
    await Promise.all(purchase.transactions.map(t =>
      tx.transactions.update({
        where: { id: t.id },
        data: {
          deleted_at: t.transaction_date > now ? now : t.deleted_at
        }
      })
    ));

    return { success: true };
  });
}
