import { api } from './api';

export type MonthStatus = 'closed' | 'current' | 'projected';
export type ItemSource = 'registered' | 'projected';

export interface FinancialBreakdown {
  registered: number;
  projected: number;
  total: number;
}

export interface MonthlySummary {
  month: string;
  status: MonthStatus;
  income: FinancialBreakdown;
  expense: FinancialBreakdown;
  balance: FinancialBreakdown;
  item_count: number;
}

export interface MonthlyOverviewResponse {
  year: number;
  currency: 'BRL';
  unit: 'cents';
  months: MonthlySummary[];
}

export interface MonthlyDetailItem {
  id: number | string;
  description: string;
  amount: number;
  source: ItemSource;
  category: { id: number | null; name: string | null };
  competence_date: string;
  transaction_date: string;
  status: string | null;
  payment_method: string | null;
  entity: { id: number; name: string; type: string | null } | null;
  income_source: { id: number; name: string } | null;
  recurring_transaction_id: number | null;
  resource_url: string;
}

export interface MonthlyDetailGroup {
  key: string;
  type: 'credit_card' | 'account' | 'payment_method' | 'income_source' | 'other';
  name: string;
  subtotal: FinancialBreakdown;
  count: number;
  items: MonthlyDetailItem[];
}

export interface MonthlyDetailResponse {
  month: string;
  status: MonthStatus;
  currency: 'BRL';
  unit: 'cents';
  totals: {
    income: FinancialBreakdown;
    expense: FinancialBreakdown;
    balance: FinancialBreakdown;
  };
  item_count: number;
  income_groups: MonthlyDetailGroup[];
  expense_groups: MonthlyDetailGroup[];
  projected_items: MonthlyDetailItem[];
}

export const monthlyOverviewService = {
  async getYear(year: number): Promise<MonthlyOverviewResponse> {
    const response = await api.get('/finance/monthly-overview', { params: { year } });
    return response.data;
  },

  async getMonth(month: string): Promise<MonthlyDetailResponse> {
    const response = await api.get(`/finance/monthly-overview/${month}`);
    return response.data;
  },
};
