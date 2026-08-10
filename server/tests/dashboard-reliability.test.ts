import { describe, expect, it, vi } from 'vitest';
import { getDashboardDateRanges, formatLocalDate } from '../../client/src/lib/local-date.js';
import { getDashboardRequestParams, settleDashboardWidgets } from '../../client/src/lib/dashboard-data.js';

describe('contrato de carregamento do dashboard', () => {
  const now = new Date(2026, 7, 9, 21, 30);

  it('envia inicio e fim em todas as consultas de transacoes', () => {
    const month = getDashboardRequestParams('month', now);
    const all = getDashboardRequestParams('all', now);

    expect(month.transactions).toEqual({ start_date: '2026-08-01', end_date: '2026-08-09' });
    expect(all.transactions).toEqual({ start_date: '1970-01-01', end_date: '2026-08-09' });
    expect(month.chart).toEqual({ start_date: '2026-03-01', end_date: '2026-08-09' });
  });

  it('usa os periodos explicitos para as duas previsoes', () => {
    const requests = getDashboardRequestParams('month', now);
    expect(requests.currentForecast.period).toBe('current_month');
    expect(requests.nextForecast.period).toBe('next_month');
  });

  it('mantem a data local depois das 21h sem converter para UTC', () => {
    expect(formatLocalDate(now)).toBe('2026-08-09');
    expect(getDashboardDateRanges(now)).toMatchObject({
      today: '2026-08-09',
      nextWeek: '2026-08-16',
    });
  });

  it('termina os carregamentos e isola falhas entre widgets', async () => {
    const summary = vi.fn().mockResolvedValue('resumo');
    const calendar = vi.fn().mockRejectedValue(new Error('403'));
    const recurring = vi.fn().mockRejectedValue(new Error('falha'));
    const chart = vi.fn().mockResolvedValue('grafico');

    const result = await settleDashboardWidgets([summary, calendar, recurring, chart]);

    expect(result.map((item) => item.status)).toEqual(['fulfilled', 'rejected', 'rejected', 'fulfilled']);
    expect(summary).toHaveBeenCalledOnce();
    expect(chart).toHaveBeenCalledOnce();
  });

  it('permite tentar novamente somente o carregador escolhido', async () => {
    const summary = vi.fn().mockResolvedValue(undefined);
    const chart = vi.fn().mockResolvedValue(undefined);
    const retry = { summary, chart };

    await retry.chart();

    expect(chart).toHaveBeenCalledOnce();
    expect(summary).not.toHaveBeenCalled();
  });
});

