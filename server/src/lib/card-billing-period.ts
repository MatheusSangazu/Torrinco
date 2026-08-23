function lastDayOfMonthUTC(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function clampDayOfMonthUTC(year: number, monthIndex: number, day: number): number {
  return Math.min(day, lastDayOfMonthUTC(year, monthIndex));
}

function dateOnlyUTC(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
}

export function asDateOnlyUTC(date: Date): Date {
  return dateOnlyUTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function endOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function shiftMonth(year: number, monthIndex: number, offset: number): { year: number; monthIndex: number } {
  const month = monthIndex + offset;
  const shiftedYear = year + Math.floor(month / 12);
  const shiftedMonth = ((month % 12) + 12) % 12;
  return { year: shiftedYear, monthIndex: shiftedMonth };
}

export interface BillPeriod {
  periodStart: Date;
  periodEnd: Date;
  closingDate: Date;
  dueDate: Date;
}

/** Fonte única do ciclo ao qual uma compra no cartão pertence. */
export function computeBillPeriod(
  closingDay: number,
  dueDay: number,
  refDate: Date = new Date(),
): BillPeriod {
  if (!Number.isInteger(closingDay) || closingDay < 1 || closingDay > 31) {
    throw new Error(`closing_day inválido: ${closingDay}. Configure o cartão com dia de fechamento (1-31).`);
  }
  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) {
    throw new Error(`due_day inválido: ${dueDay}. Configure o cartão com dia de vencimento (1-31).`);
  }

  const ref = asDateOnlyUTC(refDate);
  const year = ref.getUTCFullYear();
  const month = ref.getUTCMonth();
  const closingThisMonth = dateOnlyUTC(year, month, clampDayOfMonthUTC(year, month, closingDay));

  let periodEnd: Date;
  if (ref.getTime() > closingThisMonth.getTime()) {
    const next = shiftMonth(year, month, 1);
    periodEnd = dateOnlyUTC(next.year, next.monthIndex, clampDayOfMonthUTC(next.year, next.monthIndex, closingDay));
  } else {
    periodEnd = closingThisMonth;
  }

  const previous = shiftMonth(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), -1);
  const previousClosing = dateOnlyUTC(previous.year, previous.monthIndex, clampDayOfMonthUTC(previous.year, previous.monthIndex, closingDay));
  const periodStart = new Date(previousClosing);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);

  const dueBase = dueDay < closingDay
    ? shiftMonth(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), 1)
    : { year: periodEnd.getUTCFullYear(), monthIndex: periodEnd.getUTCMonth() };
  const dueDate = dateOnlyUTC(dueBase.year, dueBase.monthIndex, clampDayOfMonthUTC(dueBase.year, dueBase.monthIndex, dueDay));

  return { periodStart, periodEnd, closingDate: periodEnd, dueDate };
}

export function computeBillPeriodByOffset(
  closingDay: number,
  dueDay: number,
  offset: number,
  refDate: Date = new Date(),
): BillPeriod {
  const current = computeBillPeriod(closingDay, dueDay, refDate);
  if (offset === 0) return current;

  const baseEnd = asDateOnlyUTC(current.periodEnd);
  const target = shiftMonth(baseEnd.getUTCFullYear(), baseEnd.getUTCMonth(), offset);
  const targetEnd = dateOnlyUTC(target.year, target.monthIndex, clampDayOfMonthUTC(target.year, target.monthIndex, closingDay));
  const previous = shiftMonth(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth(), -1);
  const previousClosing = dateOnlyUTC(previous.year, previous.monthIndex, clampDayOfMonthUTC(previous.year, previous.monthIndex, closingDay));
  const periodStart = new Date(previousClosing);
  periodStart.setUTCDate(periodStart.getUTCDate() + 1);

  const dueBase = dueDay < closingDay
    ? shiftMonth(targetEnd.getUTCFullYear(), targetEnd.getUTCMonth(), 1)
    : { year: targetEnd.getUTCFullYear(), monthIndex: targetEnd.getUTCMonth() };
  const dueDate = dateOnlyUTC(dueBase.year, dueBase.monthIndex, clampDayOfMonthUTC(dueBase.year, dueBase.monthIndex, dueDay));

  return { periodStart, periodEnd: targetEnd, closingDate: targetEnd, dueDate };
}
