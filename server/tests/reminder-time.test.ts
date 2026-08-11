import { describe, expect, it } from 'vitest';
import { formatDatabaseDate, formatDatabaseTime, isReminderDue, parseLocalDate, parseLocalTime, reminderOccurrenceKey, zonedParts } from '../src/lib/reminder-time.js';

const reminder = (overrides: Partial<Parameters<typeof isReminderDue>[0]> = {}) => ({
  trigger_time: parseLocalTime('08:30'), frequency: 'daily' as const,
  specific_date: null, weekday: null, ...overrides,
});

describe('contrato temporal de lembretes', () => {
  it('mantém HH:mm no round-trip com a coluna TIME', () => {
    expect(formatDatabaseTime(parseLocalTime('08:30'))).toBe('08:30');
    expect(() => parseLocalTime('24:00')).toThrow(/Horário local inválido/);
  });

  it('mantém YYYY-MM-DD no round-trip com a coluna DATE', () => {
    expect(formatDatabaseDate(parseLocalDate('2028-02-29'))).toBe('2028-02-29');
    expect(() => parseLocalDate('2026-02-29')).toThrow(/Data civil inválida/);
  });

  it('resolve data e hora no fallback America/Fortaleza', () => {
    expect(zonedParts(new Date('2026-08-10T11:30:00.000Z'))).toMatchObject({ date: '2026-08-10', time: '08:30', weekday: 'Monday' });
  });

  it('dispara lembrete diário somente no minuto configurado', () => {
    expect(isReminderDue(reminder(), new Date('2026-08-10T11:30:00.000Z'))).toBe(true);
    expect(isReminderDue(reminder(), new Date('2026-08-10T11:31:00.000Z'))).toBe(false);
  });

  it('aplica data, dia da semana e dia mensal por frequência', () => {
    const now = new Date('2026-08-10T11:30:00.000Z');
    expect(isReminderDue(reminder({ frequency: 'once', specific_date: parseLocalDate('2026-08-10') }), now)).toBe(true);
    expect(isReminderDue(reminder({ frequency: 'once', specific_date: parseLocalDate('2026-08-11') }), now)).toBe(false);
    expect(isReminderDue(reminder({ frequency: 'weekly', weekday: 'Monday' }), now)).toBe(true);
    expect(isReminderDue(reminder({ frequency: 'weekly', weekday: 'Tuesday' }), now)).toBe(false);
    expect(isReminderDue(reminder({ frequency: 'monthly', specific_date: parseLocalDate('2020-01-10') }), now)).toBe(true);
    expect(isReminderDue(reminder({ frequency: 'monthly', specific_date: parseLocalDate('2020-01-11') }), now)).toBe(false);
  });

  it('gera chave de ocorrência estável por dia, horário e fuso', () => {
    expect(reminderOccurrenceKey(reminder(), new Date('2026-08-10T11:30:00.000Z'))).toBe('2026-08-10T08:30@America/Fortaleza');
  });
});
