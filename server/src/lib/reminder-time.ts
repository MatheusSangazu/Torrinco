export const DEFAULT_ACCOUNT_TIMEZONE = 'America/Fortaleza';

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export interface ReminderSchedule {
  trigger_time: Date;
  frequency: ReminderFrequency | null;
  specific_date: Date | null;
  weekday: string | null;
}

const LOCAL_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseLocalTime(value: string): Date {
  const match = LOCAL_TIME_PATTERN.exec(value);
  if (!match) throw new RangeError(`Horário local inválido: ${value}`);
  return new Date(Date.UTC(1970, 0, 1, Number(match[1]), Number(match[2]), 0, 0));
}

export function formatDatabaseTime(value: Date): string {
  if (Number.isNaN(value.getTime())) throw new RangeError('Horário persistido inválido.');
  return `${String(value.getUTCHours()).padStart(2, '0')}:${String(value.getUTCMinutes()).padStart(2, '0')}`;
}

export function parseLocalDate(value: string): Date {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) throw new RangeError(`Data civil inválida: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const result = new Date(Date.UTC(year, month - 1, day));
  if (result.getUTCFullYear() !== year || result.getUTCMonth() !== month - 1 || result.getUTCDate() !== day) {
    throw new RangeError(`Data civil inválida: ${value}`);
  }
  return result;
}

export function formatDatabaseDate(value: Date | null): string | null {
  if (!value) return null;
  if (Number.isNaN(value.getTime())) throw new RangeError('Data persistida inválida.');
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}-${String(value.getUTCDate()).padStart(2, '0')}`;
}

export function zonedParts(instant: Date, timeZone = DEFAULT_ACCOUNT_TIMEZONE) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'long', hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(instant).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}`, day: Number(parts.day), weekday: parts.weekday };
}

export function isReminderDue(reminder: ReminderSchedule, instant: Date, timeZone = DEFAULT_ACCOUNT_TIMEZONE): boolean {
  const current = zonedParts(instant, timeZone);
  if (formatDatabaseTime(reminder.trigger_time) !== current.time) return false;
  const frequency = reminder.frequency ?? 'once';
  const specificDate = formatDatabaseDate(reminder.specific_date);
  if (frequency === 'daily') return true;
  if (frequency === 'once') return specificDate === current.date;
  if (frequency === 'weekly') return reminder.weekday === current.weekday;
  if (frequency === 'monthly') return Boolean(specificDate && Number(specificDate.slice(8, 10)) === current.day);
  return false;
}

export function reminderOccurrenceKey(reminder: Pick<ReminderSchedule, 'trigger_time'>, instant: Date, timeZone = DEFAULT_ACCOUNT_TIMEZONE): string {
  const current = zonedParts(instant, timeZone);
  return `${current.date}T${formatDatabaseTime(reminder.trigger_time)}@${timeZone}`;
}
