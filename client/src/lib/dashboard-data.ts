import { getDashboardDateRanges } from './local-date';

export type DashboardPeriod = 'month' | 'all';

export function getDashboardRequestParams(period: DashboardPeriod, now: Date = new Date()) {
  const range = getDashboardDateRanges(now);
  return {
    summary: { period },
    transactions: {
      start_date: period === 'month' ? range.monthStart : '1970-01-01',
      end_date: range.today,
    },
    chart: { start_date: range.chartStart, end_date: range.chartEnd },
    calendar: { start_date: range.today, end_date: range.nextWeek },
    currentForecast: { period: 'current_month' as const },
    nextForecast: { period: 'next_month' as const },
  };
}

/** Executa os carregadores sem permitir que a falha de um widget interrompa os demais. */
export async function settleDashboardWidgets(loaders: Array<() => Promise<unknown>>) {
  return Promise.allSettled(loaders.map((load) => load()));
}

