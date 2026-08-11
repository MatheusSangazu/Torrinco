import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_TIME_ZONE,
  addMonthsToYearMonth,
  addDaysToLocalDate,
  asLocalDate,
  asLocalTime,
  asYearMonth,
  daysInMonth,
  formatInstantDateTime,
  formatInstantDateLong,
  formatInstantTime,
  formatLocalDate,
  formatMonthLong,
  formatLocalDateLong,
  formatLocalDateShort,
  formatYearMonthLong,
  formatYearMonthShort,
  fromYearMonthParts,
  getLocalDateDayOfWeek,
  getMonthDateRange,
  isLocalDate,
  isLocalTime,
  isValidTimeZone,
  isYearMonth,
  localDateFromApi,
  parseLocalDate,
} from './local-date.ts';

test('valida data civil estritamente, inclusive ano bissexto', () => {
  assert.deepEqual(parseLocalDate('2028-02-29'), { year: 2028, month: 2, day: 29 });
  assert.equal(isLocalDate('2026-02-29'), false);
  assert.equal(isLocalDate('2026-02-30'), false);
  assert.equal(isLocalDate('2026-2-09'), false);
  assert.equal(isLocalDate('0000-01-01'), false);
  assert.throws(() => asLocalDate('2026-13-01'), /Data civil inválida/);
});

test('calcula dias e intervalos mensais sem extrapolar o período', () => {
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2026, 2), 28);
  assert.deepEqual(getMonthDateRange('2026-02'), {
    startDate: '2026-02-01',
    endDate: '2026-02-28',
  });
  assert.deepEqual(getMonthDateRange('2024-02'), {
    startDate: '2024-02-01',
    endDate: '2024-02-29',
  });
});

test('soma dias civis nas viradas de mês e ano', () => {
  assert.equal(addDaysToLocalDate('2026-08-31', 1), '2026-09-01');
  assert.equal(addDaysToLocalDate('2026-12-31', 1), '2027-01-01');
  assert.equal(addDaysToLocalDate('2024-03-01', -1), '2024-02-29');
});

test('calcula competências nas viradas de ano', () => {
  assert.equal(fromYearMonthParts(2026, 8), '2026-08');
  assert.equal(addMonthsToYearMonth('2026-01', -1), '2025-12');
  assert.equal(addMonthsToYearMonth('2026-12', 1), '2027-01');
  assert.equal(addMonthsToYearMonth('2026-08', -5), '2026-03');
});

test('formata data civil em pt-BR sem depender do fuso do processo', () => {
  assert.equal(formatLocalDateShort('2026-08-10'), '10/08/2026');
  assert.equal(formatLocalDateLong('2026-08-10'), '10 de agosto de 2026');
  assert.equal(formatYearMonthLong('2026-08'), 'agosto de 2026');
  assert.match(formatYearMonthShort('2026-08'), /^ago\.?$/i);
  assert.equal(formatMonthLong(8), 'agosto');
});

test('normaliza DATE legado da API e calcula dia da semana em UTC civil', () => {
  assert.equal(localDateFromApi('2026-08-10T00:00:00.000Z'), '2026-08-10');
  assert.equal(localDateFromApi('2026-08-10'), '2026-08-10');
  assert.equal(getLocalDateDayOfWeek('2026-08-10'), 1);
  assert.throws(() => localDateFromApi('10/08/2026'), /Data civil inválida/);
});

test('valida horário local e competência', () => {
  assert.equal(isLocalTime('00:00'), true);
  assert.equal(isLocalTime('23:59'), true);
  assert.equal(isLocalTime('24:00'), false);
  assert.equal(asLocalTime('08:30'), '08:30');
  assert.equal(isYearMonth('2026-08'), true);
  assert.equal(isYearMonth('2026-13'), false);
  assert.equal(asYearMonth('2026-08'), '2026-08');
});

test('formata o mesmo instante no fuso explícito', () => {
  const instant = '2026-08-10T21:25:00.000Z';
  assert.equal(formatInstantDateTime(instant, 'UTC'), '10/08/2026 às 21:25');
  assert.equal(formatInstantDateTime(instant, DEFAULT_TIME_ZONE), '10/08/2026 às 18:25');
  assert.equal(formatInstantDateTime(instant, 'Asia/Tokyo'), '11/08/2026 às 06:25');
  assert.equal(formatInstantTime(instant, DEFAULT_TIME_ZONE), '18:25');
  assert.equal(formatInstantDateLong(instant, DEFAULT_TIME_ZONE), '10 de agosto de 2026');
});

test('rejeita fuso e instante inválidos', () => {
  assert.equal(isValidTimeZone('America/Fortaleza'), true);
  assert.equal(isValidTimeZone('Fuso/Inexistente'), false);
  assert.throws(() => formatInstantDateTime('inválido'), /Instante inválido/);
  assert.throws(() => formatInstantDateTime(0, 'Fuso/Inexistente'), /Fuso horário inválido/);
});

test('mantém a mesma data civil sob fusos de processo negativos, UTC e positivos', () => {
  const originalTimeZone = process.env.TZ;
  try {
    for (const timeZone of ['UTC', 'America/Fortaleza', 'Asia/Tokyo']) {
      process.env.TZ = timeZone;
      const localMidnight = new Date(2026, 11, 31, 0, 0, 0);
      assert.equal(formatLocalDate(localMidnight), '2026-12-31', timeZone);
      assert.equal(formatLocalDateShort('2028-02-29'), '29/02/2028', timeZone);
      assert.equal(formatLocalDateLong('2026-01-01'), '1 de janeiro de 2026', timeZone);
    }
  } finally {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});

test('preserva o instante nas viradas de dia, mês, ano e horário de verão', () => {
  const yearBoundary = '2026-12-31T23:30:00.000Z';
  assert.equal(formatInstantDateTime(yearBoundary, 'UTC'), '31/12/2026 às 23:30');
  assert.equal(formatInstantDateTime(yearBoundary, 'America/Fortaleza'), '31/12/2026 às 20:30');
  assert.equal(formatInstantDateTime(yearBoundary, 'Asia/Tokyo'), '01/01/2027 às 08:30');

  // Em Nova York, 02:00 não existe na transição para o horário de verão de 2026.
  assert.equal(formatInstantDateTime('2026-03-08T06:30:00.000Z', 'America/New_York'), '08/03/2026 às 01:30');
  assert.equal(formatInstantDateTime('2026-03-08T07:30:00.000Z', 'America/New_York'), '08/03/2026 às 03:30');
});

test('preserva a data civil no fluxo importação, API e apresentação da UI', () => {
  const importedDate = '2028-02-29';
  const legacyApiPayload = JSON.parse(JSON.stringify({ transaction_date: new Date(`${importedDate}T00:00:00.000Z`) }));
  const transactionDate = localDateFromApi(legacyApiPayload.transaction_date);

  assert.equal(transactionDate, importedDate);
  assert.equal(formatLocalDateShort(transactionDate), '29/02/2028');
});
