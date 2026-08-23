import type {
  MonthlyDetailItem,
  MonthlyDetailResponse,
  MonthlySummary,
} from '../services/monthly-overview.service';
import { formatYearMonthShort } from './local-date.ts';

export interface ReportTransaction {
  id: number | string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  competence_date: string;
  transaction_date: string;
  status?: 'paid' | 'pending';
  categories?: {
    name: string;
    color?: string;
  };
}

function toReportTransaction(
  item: MonthlyDetailItem,
  type: ReportTransaction['type'],
): ReportTransaction {
  const category = item.category.name ?? 'Outros';
  const status = item.source === 'projected'
    ? 'pending'
    : item.status === 'paid' || item.status === 'pending'
      ? item.status
      : undefined;

  return {
    id: item.id,
    amount: item.amount / 100,
    type,
    category,
    categories: { name: category },
    competence_date: item.competence_date,
    transaction_date: item.transaction_date,
    status,
  };
}

/** Converte o detalhamento canônico sem repetir a lista separada de projetados. */
export function monthlyDetailToReportTransactions(detail: MonthlyDetailResponse): ReportTransaction[] {
  return [
    ...detail.income_groups.flatMap(group => group.items.map(item => toReportTransaction(item, 'income'))),
    ...detail.expense_groups.flatMap(group => group.items.map(item => toReportTransaction(item, 'expense'))),
  ];
}

export function monthlySummariesToTrend(months: MonthlySummary[], periods: string[]) {
  return periods.map(period => {
    const month = months.find(candidate => candidate.month === period);
    return {
      label: formatYearMonthShort(period),
      income: (month?.income.total ?? 0) / 100,
      expense: (month?.expense.total ?? 0) / 100,
    };
  });
}
