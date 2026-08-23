import { centsToSafeInteger } from './money.js';
import { DEFAULT_ACCOUNT_TIMEZONE, zonedParts } from './reminder-time.js';
import type {
  FinancialBreakdown,
  MonthlyFinancialItem,
  MonthlyFinancialTotals,
} from './monthly-finance-engine.js';

export type MonthStatus = 'closed' | 'current' | 'projected';

export interface ApiFinancialBreakdown {
  registered: number;
  projected: number;
  total: number;
}

export interface MonthlyOverviewItem {
  id: number | string;
  description: string;
  amount: number;
  source: 'registered' | 'projected';
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

export interface MonthlyOverviewGroup {
  key: string;
  type: 'credit_card' | 'account' | 'payment_method' | 'income_source' | 'other';
  name: string;
  subtotal: ApiFinancialBreakdown;
  count: number;
  items: MonthlyOverviewItem[];
}

function civilDate(value: unknown): string {
  const date = new Date(value as string | Date);
  if (Number.isNaN(date.getTime())) throw new Error('INVALID_MONTHLY_OVERVIEW_DATE');
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function serializeBreakdown(value: FinancialBreakdown): ApiFinancialBreakdown {
  return {
    registered: centsToSafeInteger(value.registered),
    projected: centsToSafeInteger(value.projected),
    total: centsToSafeInteger(value.total),
  };
}

export function serializeTotals(totals: MonthlyFinancialTotals) {
  return {
    income: serializeBreakdown(totals.income),
    expense: serializeBreakdown(totals.expense),
    balance: serializeBreakdown(totals.balance),
  };
}

export function monthStatus(
  month: string,
  now = new Date(),
  timeZone = DEFAULT_ACCOUNT_TIMEZONE,
): MonthStatus {
  const current = zonedParts(now, timeZone).date.slice(0, 7);
  if (month < current) return 'closed';
  if (month > current) return 'projected';
  return 'current';
}

function apiItem(item: MonthlyFinancialItem): MonthlyOverviewItem {
  const transaction = item.transaction as any;
  const entity = transaction.financial_entities;
  const incomeSource = transaction.income_sources;
  const recurringId = transaction.recurring_transaction_id == null
    ? null
    : Number(transaction.recurring_transaction_id);
  const id = transaction.id;

  return {
    id,
    description: transaction.description || 'Sem descrição',
    amount: centsToSafeInteger(item.amountCents),
    source: item.source,
    category: {
      id: transaction.category_id == null ? null : Number(transaction.category_id),
      name: transaction.categories?.name ?? transaction.category ?? null,
    },
    competence_date: civilDate(item.competenceDate),
    transaction_date: civilDate(transaction.transaction_date),
    status: transaction.status ?? (item.source === 'projected' ? 'pending' : null),
    payment_method: transaction.payment_method ?? null,
    entity: entity ? { id: Number(entity.id), name: entity.name, type: entity.type ?? null } : null,
    income_source: incomeSource ? { id: Number(incomeSource.id), name: incomeSource.name } : null,
    recurring_transaction_id: recurringId,
    resource_url: item.source === 'projected' && recurringId
      ? `/recurring/${recurringId}`
      : `/finance/transactions/${id}`,
  };
}

function expenseGroup(item: MonthlyFinancialItem) {
  const transaction = item.transaction as any;
  const entity = transaction.financial_entities;
  if (entity?.type === 'credit_card') {
    return { key: `credit-card:${entity.id}`, type: 'credit_card' as const, name: entity.name };
  }
  if (entity) {
    return { key: `account:${entity.id}`, type: 'account' as const, name: entity.name };
  }

  const method = String(transaction.payment_method ?? 'other');
  const names: Record<string, string> = {
    cash: 'Dinheiro',
    pix: 'Pix',
    debit: 'Débito',
    debit_card: 'Débito',
    transfer: 'Transferência',
    bank_slip: 'Boleto',
    credit: 'Crédito',
    credit_card: 'Crédito',
    other: 'Outras despesas',
  };
  return {
    key: `payment-method:${method}`,
    type: method === 'other' ? 'other' as const : 'payment_method' as const,
    name: names[method] ?? 'Outras despesas',
  };
}

function incomeGroup(item: MonthlyFinancialItem) {
  const source = (item.transaction as any).income_sources;
  if (source) {
    return { key: `income-source:${source.id}`, type: 'income_source' as const, name: source.name };
  }
  return { key: 'income-source:other', type: 'other' as const, name: 'Outras receitas' };
}

function groupItems(
  items: MonthlyFinancialItem[],
  resolve: (item: MonthlyFinancialItem) => { key: string; type: MonthlyOverviewGroup['type']; name: string },
): MonthlyOverviewGroup[] {
  const groups = new Map<string, {
    key: string;
    type: MonthlyOverviewGroup['type'];
    name: string;
    registered: bigint;
    projected: bigint;
    items: MonthlyOverviewItem[];
  }>();

  for (const item of items) {
    const identity = resolve(item);
    const group = groups.get(identity.key) ?? {
      ...identity,
      registered: 0n,
      projected: 0n,
      items: [],
    };
    group[item.source] += item.amountCents;
    group.items.push(apiItem(item));
    groups.set(identity.key, group);
  }

  return [...groups.values()]
    .map(group => ({
      key: group.key,
      type: group.type,
      name: group.name,
      subtotal: serializeBreakdown({
        registered: group.registered,
        projected: group.projected,
        total: group.registered + group.projected,
      }),
      count: group.items.length,
      items: group.items.sort((left, right) =>
        left.competence_date.localeCompare(right.competence_date)
        || left.description.localeCompare(right.description, 'pt-BR')),
    }))
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

export function buildMonthlyDetail(
  month: string,
  financial: { totals: MonthlyFinancialTotals; items: MonthlyFinancialItem[] },
  now = new Date(),
) {
  const incomeItems = financial.items.filter(item => item.kind === 'income');
  const expenseItems = financial.items.filter(item => item.kind === 'expense');
  const projectedItems = financial.items.filter(item => item.source === 'projected').map(apiItem);

  return {
    month,
    status: monthStatus(month, now),
    currency: 'BRL' as const,
    unit: 'cents' as const,
    totals: serializeTotals(financial.totals),
    item_count: financial.items.length,
    income_groups: groupItems(incomeItems, incomeGroup),
    expense_groups: groupItems(expenseItems, expenseGroup),
    projected_items: projectedItems,
  };
}
