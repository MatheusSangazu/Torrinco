import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, getBillDetails, enqueueReminder } = vi.hoisted(() => ({
  findMany: vi.fn(),
  getBillDetails: vi.fn(),
  enqueueReminder: vi.fn()
}));

vi.mock('../src/lib/prisma.js', () => ({
  prisma: { card_bills: { findMany } }
}));
vi.mock('../src/services/billing.service.js', () => ({ getBillDetails }));
vi.mock('../src/services/reminder-delivery.service.js', () => ({ enqueueReminder }));

import { buildCardBillDueMessage, enqueueDueCardBillReminders } from '../src/services/card-bill-reminder.service.js';

describe('lembrete de vencimento de fatura', () => {
  beforeEach(() => vi.clearAllMocks());

  it('monta uma pergunta com total, pagamentos e saldo pendente', () => {
    const message = buildCardBillDueMessage({ cardName: 'Nubank', totalAmount: 800, paidAmount: 300, remainingAmount: 500 });
    expect(message).toContain('Nubank');
    expect(message).toContain('R$ 800,00');
    expect(message).toContain('R$ 300,00');
    expect(message).toContain('R$ 500,00');
    expect(message).toContain('paguei tudo');
  });

  it('só consulta faturas na hora cheia configurada', async () => {
    await expect(enqueueDueCardBillReminders(new Date('2026-08-17T12:01:00.000Z'))).resolves.toEqual({ eligible: 0, queued: 0 });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('enfileira uma única ocorrência identificada pela fatura e vencimento', async () => {
    findMany.mockResolvedValue([{
      id: 31,
      user_id: 7,
      financial_entities: { name: 'Nubank' },
      users: { id: 7, account_id: 4, phone_number: '5585999999999' }
    }]);
    getBillDetails.mockResolvedValue({ bill: { total_amount: 800, paid_amount: 300, remaining_amount: 500 } });
    enqueueReminder.mockResolvedValue({ id: 1 });

    await expect(enqueueDueCardBillReminders(new Date('2026-08-17T12:00:00.000Z'))).resolves.toEqual({ eligible: 1, queued: 1 });
    expect(enqueueReminder).toHaveBeenCalledWith(expect.objectContaining({
      sourceType: 'card_bill_due',
      sourceId: '31',
      occurrenceKey: '2026-08-17',
      userId: 7
    }));
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ financial_entities: { due_reminder_enabled: true, due_reminder_hour: 9 } })
    }));
  });

  it('não envia fatura vazia ou já sem saldo', async () => {
    findMany.mockResolvedValue([{
      id: 32,
      user_id: 7,
      financial_entities: { name: 'Nubank' },
      users: { id: 7, account_id: 4, phone_number: '5585999999999' }
    }]);
    getBillDetails.mockResolvedValue({ bill: { total_amount: 800, paid_amount: 800, remaining_amount: 0 } });

    await expect(enqueueDueCardBillReminders(new Date('2026-08-17T12:00:00.000Z'))).resolves.toEqual({ eligible: 1, queued: 0 });
    expect(enqueueReminder).not.toHaveBeenCalled();
  });
});
