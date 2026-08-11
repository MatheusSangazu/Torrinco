/**
 * Biblioteca temporal do client.
 *
 * Datas civis são strings YYYY-MM-DD e nunca sofrem conversão de fuso.
 * Instantes são formatados no fuso explícito da conta.
 * Consulte docs/TEMPORAL_CONTRACT.md antes de adicionar novas operações.
 */

export const DEFAULT_TIME_ZONE = 'America/Fortaleza';
export const PT_BR_LOCALE = 'pt-BR';

declare const localDateBrand: unique symbol;
declare const localTimeBrand: unique symbol;
declare const yearMonthBrand: unique symbol;

export type LocalDate = string & { readonly [localDateBrand]: true };
export type LocalTime = string & { readonly [localTimeBrand]: true };
export type YearMonth = string & { readonly [yearMonthBrand]: true };

export interface LocalDateParts {
  year: number;
  month: number;
  day: number;
}

export interface InclusiveDateRange {
  startDate: LocalDate;
  endDate: LocalDate;
}

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOCAL_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const YEAR_MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('Ano ou mês inválido.');
  }

  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function parseLocalDate(value: string): LocalDateParts | null {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;

  return { year, month, day };
}

export function isLocalDate(value: string): value is LocalDate {
  return parseLocalDate(value) !== null;
}

export function asLocalDate(value: string): LocalDate {
  if (!isLocalDate(value)) throw new RangeError(`Data civil inválida: ${value}`);
  return value;
}

export function isLocalTime(value: string): value is LocalTime {
  return LOCAL_TIME_PATTERN.test(value);
}

export function asLocalTime(value: string): LocalTime {
  if (!isLocalTime(value)) throw new RangeError(`Horário local inválido: ${value}`);
  return value;
}

export function isYearMonth(value: string): value is YearMonth {
  const match = YEAR_MONTH_PATTERN.exec(value);
  return Boolean(match && Number(match[2]) >= 1 && Number(match[2]) <= 12);
}

export function asYearMonth(value: string): YearMonth {
  if (!isYearMonth(value)) throw new RangeError(`Competência inválida: ${value}`);
  return value;
}

export function fromYearMonthParts(year: number, month: number): YearMonth {
  return asYearMonth(`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`);
}

export function addMonthsToYearMonth(value: string, amount: number): YearMonth {
  const month = asYearMonth(value);
  if (!Number.isInteger(amount)) throw new RangeError('A quantidade de meses deve ser inteira.');
  const [yearPart, monthPart] = month.split('-');
  const zeroBasedTotal = Number(yearPart) * 12 + Number(monthPart) - 1 + amount;
  const resultYear = Math.floor(zeroBasedTotal / 12);
  const resultMonth = ((zeroBasedTotal % 12) + 12) % 12 + 1;
  return fromYearMonthParts(resultYear, resultMonth);
}

/** Produz uma data civil usando componentes locais do Date, sem conversão para UTC. */
export function formatLocalDate(date: Date): LocalDate {
  if (Number.isNaN(date.getTime())) throw new RangeError('Date inválido.');
  return fromLocalDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function fromLocalDateParts(year: number, month: number, day: number): LocalDate {
  const value = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return asLocalDate(value);
}

/** Usa UTC apenas como mecanismo aritmético interno; a string civil não muda de fuso. */
export function addDaysToLocalDate(value: string, amount: number): LocalDate {
  const parts = parseLocalDate(value);
  if (!parts) throw new RangeError(`Data civil inválida: ${value}`);
  if (!Number.isInteger(amount)) throw new RangeError('A quantidade de dias deve ser inteira.');

  const result = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount));
  return fromLocalDateParts(result.getUTCFullYear(), result.getUTCMonth() + 1, result.getUTCDate());
}

export function getMonthDateRange(value: string): InclusiveDateRange {
  const month = asYearMonth(value);
  const [yearPart, monthPart] = month.split('-');
  const year = Number(yearPart);
  const monthNumber = Number(monthPart);
  return {
    startDate: fromLocalDateParts(year, monthNumber, 1),
    endDate: fromLocalDateParts(year, monthNumber, daysInMonth(year, monthNumber)),
  };
}

/** Compatibilidade temporária para APIs legadas que serializam DATE como ISO timestamp. */
export function localDateFromApi(value: string): LocalDate {
  const datePart = value.slice(0, 10);
  return asLocalDate(datePart);
}

export function getLocalDateDayOfWeek(value: string): number {
  const parts = parseLocalDate(value);
  if (!parts) throw new RangeError(`Data civil inválida: ${value}`);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)).getUTCDay();
}

function civilDateForIntl(value: string): Date {
  const parts = parseLocalDate(value);
  if (!parts) throw new RangeError(`Data civil inválida: ${value}`);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
}

export function formatLocalDateShort(value: string): string {
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(civilDateForIntl(value));
}

export function formatLocalDateLong(value: string): string {
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(civilDateForIntl(value));
}

export function formatYearMonthLong(value: string): string {
  const range = getMonthDateRange(value);
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(civilDateForIntl(range.startDate));
}

export function formatYearMonthShort(value: string): string {
  const range = getMonthDateRange(value);
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    month: 'short',
    timeZone: 'UTC',
  }).format(civilDateForIntl(range.startDate));
}

export function formatMonthLong(month: number): string {
  const value = fromYearMonthParts(2000, month);
  const range = getMonthDateRange(value);
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    month: 'long',
    timeZone: 'UTC',
  }).format(civilDateForIntl(range.startDate));
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(0);
    return true;
  } catch {
    return false;
  }
}

function validInstant(value: string | number | Date): Date {
  const instant = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(instant.getTime())) throw new RangeError('Instante inválido.');
  return instant;
}

function assertTimeZone(timeZone: string): void {
  if (!isValidTimeZone(timeZone)) throw new RangeError(`Fuso horário inválido: ${timeZone}`);
}

export function formatInstantDateTime(
  value: string | number | Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  assertTimeZone(timeZone);
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(validInstant(value)).replace(',', ' às');
}

export function formatInstantDateLong(
  value: string | number | Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  assertTimeZone(timeZone);
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(validInstant(value));
}

export function formatInstantTime(
  value: string | number | Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  assertTimeZone(timeZone);
  return new Intl.DateTimeFormat(PT_BR_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(validInstant(value));
}

export function getDashboardDateRanges(now: Date = new Date()) {
  const today = formatLocalDate(now);
  const firstDayOfMonth = fromLocalDateParts(now.getFullYear(), now.getMonth() + 1, 1);
  const chartMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  return {
    today,
    nextWeek: addDaysToLocalDate(today, 7),
    monthStart: firstDayOfMonth,
    chartStart: formatLocalDate(chartMonth),
    chartEnd: today,
  };
}
