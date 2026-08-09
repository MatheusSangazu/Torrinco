import { describe, it, expect } from 'vitest';
import { computeBillPeriod, computeBillPeriodByOffset } from '../src/services/billing.service.js';

function d(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function ymd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

describe('billing.service — computeBillPeriod / computeBillPeriodByOffset', () => {
  it('fechamento 31 em fevereiro comum (clamp para 28)', () => {
    const p = computeBillPeriod(31, 30, d('2025-02-10'));
    expect(ymd(p.periodStart)).toBe('2025-02-01');
    expect(ymd(p.periodEnd)).toBe('2025-02-28');
    expect(ymd(p.dueDate)).toBe('2025-03-30');
  });

  it('fechamento 31 em fevereiro bissexto (clamp para 29)', () => {
    const p = computeBillPeriod(31, 30, d('2024-02-10'));
    expect(ymd(p.periodStart)).toBe('2024-02-01');
    expect(ymd(p.periodEnd)).toBe('2024-02-29');
    expect(ymd(p.dueDate)).toBe('2024-03-30');
  });

  it('fechamento 31 em mês de 30 dias (clamp para 30)', () => {
    const p = computeBillPeriod(31, 5, d('2026-04-15'));
    expect(ymd(p.periodStart)).toBe('2026-04-01');
    expect(ymd(p.periodEnd)).toBe('2026-04-30');
    expect(ymd(p.dueDate)).toBe('2026-05-05');
  });

  it('fechamento no dia 1 (periodStart = fechamento anterior + 1)', () => {
    const p = computeBillPeriod(1, 10, d('2026-05-01'));
    expect(ymd(p.periodEnd)).toBe('2026-05-01');
    expect(ymd(p.periodStart)).toBe('2026-04-02');
    expect(ymd(p.dueDate)).toBe('2026-05-10');
  });

  it('vencimento >= fechamento permanece no mesmo mês (com clamp)', () => {
    const p = computeBillPeriod(29, 31, d('2025-02-10'));
    expect(ymd(p.periodEnd)).toBe('2025-02-28');
    expect(ymd(p.dueDate)).toBe('2025-02-28');
  });

  it('vencimento < fechamento cai no mês seguinte (com clamp)', () => {
    const p = computeBillPeriod(31, 10, d('2025-02-10'));
    expect(ymd(p.periodEnd)).toBe('2025-02-28');
    expect(ymd(p.dueDate)).toBe('2025-03-10');
  });

  it('compra no dia anterior ao fechamento pertence ao ciclo atual', () => {
    const p = computeBillPeriod(10, 15, d('2026-03-09'));
    expect(ymd(p.periodEnd)).toBe('2026-03-10');
  });

  it('compra no dia do fechamento pertence ao ciclo atual', () => {
    const p = computeBillPeriod(10, 15, d('2026-03-10'));
    expect(ymd(p.periodEnd)).toBe('2026-03-10');
  });

  it('compra no dia posterior ao fechamento pertence ao próximo ciclo', () => {
    const p = computeBillPeriod(10, 15, d('2026-03-11'));
    expect(ymd(p.periodEnd)).toBe('2026-04-10');
    expect(ymd(p.periodStart)).toBe('2026-03-11');
  });

  it('offsets anteriores e posteriores com virada de ano', () => {
    const current = computeBillPeriodByOffset(31, 10, 0, d('2026-01-15'));
    expect(ymd(current.periodEnd)).toBe('2026-01-31');
    expect(ymd(current.dueDate)).toBe('2026-02-10');

    const prev = computeBillPeriodByOffset(31, 10, -1, d('2026-01-15'));
    expect(ymd(prev.periodEnd)).toBe('2025-12-31');
    expect(ymd(prev.periodStart)).toBe('2025-12-01');
    expect(ymd(prev.dueDate)).toBe('2026-01-10');

    const next = computeBillPeriodByOffset(31, 10, 1, d('2026-01-15'));
    expect(ymd(next.periodEnd)).toBe('2026-02-28');
    expect(ymd(next.periodStart)).toBe('2026-02-01');
    expect(ymd(next.dueDate)).toBe('2026-03-10');
  });
});

