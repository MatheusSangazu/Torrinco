import { prisma } from '../lib/prisma.js';
import { DEFAULT_ACCOUNT_TIMEZONE, parseLocalDate, zonedParts } from '../lib/reminder-time.js';
import { getBillDetails } from './billing.service.js';
import { enqueueReminder } from './reminder-delivery.service.js';

function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function buildCardBillDueMessage(input: {
  cardName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}): string {
  const paidLine = input.paidAmount > 0
    ? `\nJá registrado como pago: *${formatCurrencyBRL(input.paidAmount)}*.`
    : '';

  return `💳 A fatura do *${input.cardName}* vence hoje.\n`
    + `Total: *${formatCurrencyBRL(input.totalAmount)}*.${paidLine}\n`
    + `Saldo pendente: *${formatCurrencyBRL(input.remainingAmount)}*.\n\n`
    + 'Você já pagou? Responda “paguei tudo”, “paguei R$ 500” ou “ainda não”.';
}

/**
 * Enfileira uma pergunta no vencimento das faturas dos cartões que aderiram
 * ao lembrete. A chave única da fila garante no máximo um envio por fatura.
 */
export async function enqueueDueCardBillReminders(
  now = new Date(),
  timeZone = DEFAULT_ACCOUNT_TIMEZONE
) {
  const local = zonedParts(now, timeZone);
  const [hour, minute] = local.time.split(':').map(Number);
  if (minute !== 0) return { eligible: 0, queued: 0 };

  const bills = await prisma.card_bills.findMany({
    where: {
      due_date: parseLocalDate(local.date),
      status: { not: 'paid' },
      financial_entities: {
        due_reminder_enabled: true,
        due_reminder_hour: hour
      },
      users: {
        status: 'active',
        phone_number: { not: '' }
      }
    },
    include: {
      financial_entities: { select: { name: true } },
      users: { select: { id: true, account_id: true, phone_number: true } }
    }
  });

  let queued = 0;
  for (const bill of bills) {
    const details = await getBillDetails(bill.id, bill.user_id);
    const totalAmount = Number(details.bill.total_amount);
    const paidAmount = Number(details.bill.paid_amount);
    const remainingAmount = Number(details.bill.remaining_amount);
    if (totalAmount <= 0 || remainingAmount <= 0 || !bill.users.phone_number) continue;

    const delivery = await enqueueReminder({
      sourceType: 'card_bill_due',
      sourceId: String(bill.id),
      occurrenceKey: local.date,
      accountId: bill.users.account_id,
      userId: bill.users.id,
      destination: bill.users.phone_number,
      message: buildCardBillDueMessage({
        cardName: bill.financial_entities.name,
        totalAmount,
        paidAmount,
        remainingAmount
      })
    });
    if (delivery) queued++;
  }

  return { eligible: bills.length, queued };
}
