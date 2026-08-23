import type { FinancialBreakdown, MonthStatus } from '../services/monthly-overview.service';

export const MONTH_STATUS_LABELS: Record<MonthStatus, string> = {
  closed: 'Fechado',
  current: 'Mês atual',
  projected: 'Projetado',
};

export function formatCents(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
}

export function hasProjection(value: FinancialBreakdown): boolean {
  return value.projected !== 0;
}

export function sumGroupTotals(groups: Array<{ subtotal: FinancialBreakdown }>): number {
  return groups.reduce((total, group) => total + group.subtotal.total, 0);
}
