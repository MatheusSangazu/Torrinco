import { describe, expect, it } from 'vitest';
import { installmentCycleDate } from '../src/services/installments.service.js';
import { computeBillPeriod } from '../src/services/billing.service.js';

function date(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function ymd(value: Date): string {
  return value.toISOString().slice(0, 10);
}

describe('ciclo de compras parceladas', () => {
  it('leva compra de 30/03 para abril quando o cartão fecha dia 1 e vence dia 5', () => {
    const purchaseDate = date('2026-03-30');

    const firstInstallment = installmentCycleDate(purchaseDate, 1, 0);
    const secondInstallment = installmentCycleDate(purchaseDate, 1, 1);
    const thirdInstallment = installmentCycleDate(purchaseDate, 1, 2);

    expect(ymd(firstInstallment)).toBe('2026-04-01');
    expect(ymd(secondInstallment)).toBe('2026-05-01');
    expect(ymd(thirdInstallment)).toBe('2026-06-01');

    expect(ymd(computeBillPeriod(1, 5, firstInstallment).dueDate)).toBe('2026-04-05');
    expect(ymd(computeBillPeriod(1, 5, secondInstallment).dueDate)).toBe('2026-05-05');
    expect(ymd(computeBillPeriod(1, 5, thirdInstallment).dueDate)).toBe('2026-06-05');
  });
});
