import { useEffect, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import {
  monthlyOverviewService,
  type FinancialBreakdown,
  type MonthStatus,
  type MonthlyDetailGroup,
  type MonthlyDetailItem,
  type MonthlyDetailResponse,
  type MonthlyOverviewResponse,
  type MonthlySummary,
} from '../services/monthly-overview.service';
import { formatCents, hasProjection, MONTH_STATUS_LABELS } from '../lib/monthly-overview';
import { formatLocalDateShort, formatYearMonthLong } from '../lib/local-date';

type LoadStatus = 'loading' | 'loaded' | 'error';
type DetailState = { status: LoadStatus; data?: MonthlyDetailResponse };

const statusStyles: Record<MonthStatus, string> = {
  closed: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  current: 'bg-torrinco-100 text-torrinco-700 dark:bg-torrinco-900/40 dark:text-torrinco-300',
  projected: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

function monthLabel(month: string) {
  const label = formatYearMonthLong(month);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function BreakdownComposition({ value }: { value: FinancialBreakdown }) {
  if (!hasProjection(value)) {
    return <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">Registrado {formatCents(value.registered)}</p>;
  }
  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-slate-400">
      <span>Registrado {formatCents(value.registered)}</span>
      <span>Projetado {formatCents(value.projected)}</span>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: FinancialBreakdown;
  tone: 'income' | 'expense' | 'balance';
}) {
  const Icon = tone === 'income' ? ArrowDownLeft : tone === 'expense' ? ArrowUpRight : Scale;
  const toneClasses = {
    income: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    expense: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    balance: value.total > 0
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : value.total < 0
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  }[tone];

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="flex items-center gap-3">
        <span className={clsx('rounded-xl p-2.5', toneClasses)}><Icon aria-hidden="true" size={20} /></span>
        <h3 className="font-medium text-gray-600 dark:text-slate-300">{label}</h3>
      </div>
      <p className={clsx(
        'mt-5 text-2xl font-bold tracking-tight sm:text-3xl',
        tone === 'income' && 'text-green-700 dark:text-green-300',
        tone === 'expense' && 'text-red-700 dark:text-red-300',
        tone === 'balance' && (value.total > 0
          ? 'text-blue-700 dark:text-blue-300'
          : value.total < 0
            ? 'text-amber-700 dark:text-amber-300'
            : 'text-gray-700 dark:text-slate-300'),
      )}>
        {formatCents(value.total)}
      </p>
      <BreakdownComposition value={value} />
    </article>
  );
}

function SourceBadge({ source }: { source: MonthlyDetailItem['source'] }) {
  return (
    <span className={clsx(
      'rounded-full px-2 py-0.5 text-[11px] font-semibold',
      source === 'registered'
        ? 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    )}>
      {source === 'registered' ? 'Registrado' : 'Projetado'}
    </span>
  );
}

function DetailItem({ item }: { item: MonthlyDetailItem }) {
  return (
    <li className="flex flex-col gap-2 border-t border-gray-100 py-3 first:border-t-0 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium text-gray-800 dark:text-white">{item.description}</span>
          <SourceBadge source={item.source} />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
          Competência {formatLocalDateShort(item.competence_date)}
          {item.category.name ? ` · ${item.category.name}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-semibold text-gray-800 dark:text-white">{formatCents(item.amount)}</span>
        <Link to="/transactions" className="rounded-lg px-2 py-1 text-xs font-semibold text-torrinco-700 hover:bg-torrinco-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 dark:text-torrinco-300 dark:hover:bg-torrinco-950/30">Gerenciar</Link>
      </div>
    </li>
  );
}

function DetailGroups({ title, groups }: { title: string; groups: MonthlyDetailGroup[] }) {
  return (
    <section>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">{title}</h4>
      {groups.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-slate-900/50 dark:text-slate-400">Nenhum lançamento neste grupo.</p>
      ) : (
        <div className="space-y-3">
          {groups.map((group, index) => (
            <details key={group.key} open={index === 0} className="group rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500">
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-gray-800 dark:text-white">{group.name}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{group.count} {group.count === 1 ? 'lançamento' : 'lançamentos'}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-bold text-gray-800 dark:text-white">{formatCents(group.subtotal.total)}</span>
                  <ChevronDown aria-hidden="true" size={18} className="text-gray-400 transition group-open:rotate-180" />
                </span>
              </summary>
              <ul className="border-t border-gray-100 px-4 dark:border-slate-700">
                {group.items.map(item => <DetailItem key={`${item.source}-${item.id}`} item={item} />)}
              </ul>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

function MonthDetail({ state, retry }: { state?: DetailState; retry: () => void }) {
  if (!state || state.status === 'loading') {
    return <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-5 text-sm text-gray-500 dark:bg-slate-900/50 dark:text-slate-400"><Loader2 size={17} className="animate-spin" /> Carregando detalhes do mês…</div>;
  }
  if (state.status === 'error' || !state.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <p>Não foi possível carregar o detalhamento deste mês.</p>
        <button onClick={retry} className="mt-3 rounded-lg border border-red-300 px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-800">Tentar novamente</button>
      </div>
    );
  }
  if (state.data.item_count === 0) {
    return <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-slate-900/50 dark:text-slate-400">Nenhum lançamento registrado ou projetado neste mês.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-3 dark:bg-green-950/30"><span className="text-xs text-gray-500 dark:text-slate-400">Receitas</span><strong className="mt-1 block text-green-700 dark:text-green-300">{formatCents(state.data.totals.income.total)}</strong></div>
        <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/30"><span className="text-xs text-gray-500 dark:text-slate-400">Despesas</span><strong className="mt-1 block text-red-700 dark:text-red-300">{formatCents(state.data.totals.expense.total)}</strong></div>
        <div className={clsx('rounded-xl p-3', state.data.totals.balance.total > 0 ? 'bg-blue-50 dark:bg-blue-950/30' : state.data.totals.balance.total < 0 ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-gray-50 dark:bg-slate-900/50')}><span className="text-xs text-gray-500 dark:text-slate-400">Balanço</span><strong className={clsx('mt-1 block', state.data.totals.balance.total > 0 ? 'text-blue-700 dark:text-blue-300' : state.data.totals.balance.total < 0 ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-slate-300')}>{formatCents(state.data.totals.balance.total)}</strong></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DetailGroups title="Receitas por fonte" groups={state.data.income_groups} />
        <DetailGroups title="Despesas por cartão, conta ou forma" groups={state.data.expense_groups} />
      </div>
      {state.data.projected_items.length > 0 && (
        <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">Itens projetados ainda não registrados</h4>
          <ul className="mt-2">
            {state.data.projected_items.map(item => <DetailItem key={`projected-${item.id}`} item={item} />)}
          </ul>
        </section>
      )}
    </div>
  );
}

function chooseInitialMonth(data: MonthlyOverviewResponse): string {
  return data.months.find(month => month.status === 'current')?.month
    ?? data.months.find(month => month.status === 'projected')?.month
    ?? data.months[data.months.length - 1]?.month
    ?? `${data.year}-01`;
}

export function MonthlyOverview() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [overview, setOverview] = useState<MonthlyOverviewResponse | null>(null);
  const [highlightedMonth, setHighlightedMonth] = useState('');
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, DetailState>>({});

  const loadYear = async (targetYear: number) => {
    setStatus('loading');
    setExpandedMonth(null);
    try {
      const data = await monthlyOverviewService.getYear(targetYear);
      setOverview(data);
      setHighlightedMonth(chooseInitialMonth(data));
      setStatus('loaded');
    } catch (error) {
      console.error('Falha ao carregar a Visão mensal:', error);
      setOverview(null);
      setStatus('error');
    }
  };

  useEffect(() => {
    void loadYear(year);
  }, [year]);

  const loadDetail = async (month: string) => {
    setDetails(previous => ({ ...previous, [month]: { status: 'loading' } }));
    try {
      const data = await monthlyOverviewService.getMonth(month);
      setDetails(previous => ({ ...previous, [month]: { status: 'loaded', data } }));
    } catch (error) {
      console.error(`Falha ao carregar detalhes de ${month}:`, error);
      setDetails(previous => ({ ...previous, [month]: { status: 'error' } }));
    }
  };

  const toggleMonth = (month: string) => {
    setHighlightedMonth(month);
    if (expandedMonth === month) {
      setExpandedMonth(null);
      return;
    }
    setExpandedMonth(month);
    if (!details[month] || details[month]?.status === 'error') void loadDetail(month);
  };

  if (status === 'loading') {
    return <section aria-label="Visão mensal" className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="flex items-center gap-3 text-gray-500 dark:text-slate-400"><Loader2 className="animate-spin" /> Carregando sua visão financeira…</div></section>;
  }

  if (status === 'error' || !overview) {
    return (
      <section aria-label="Visão mensal" className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h2 className="font-bold text-red-800 dark:text-red-200">Não foi possível carregar a Visão mensal</h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">Os valores não foram substituídos por zeros. Tente carregar novamente.</p>
        <button onClick={() => void loadYear(year)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"><RefreshCw size={16} /> Tentar novamente</button>
      </section>
    );
  }

  const selected = overview.months.find(month => month.month === highlightedMonth) ?? overview.months[0];
  if (!selected) return null;

  const monthButton = (month: MonthlySummary, compact = false) => (
    <button
      type="button"
      onClick={() => toggleMonth(month.month)}
      aria-expanded={expandedMonth === month.month}
      className={clsx(
        'w-full rounded-xl text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800',
        compact ? 'border border-gray-200 p-4 dark:border-slate-700' : 'px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700/50',
        highlightedMonth === month.month && 'bg-torrinco-50 ring-1 ring-torrinco-200 dark:bg-torrinco-950/30 dark:ring-torrinco-900',
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-800 dark:text-white">{monthLabel(month.month)}</span>
        <span className={clsx('rounded-full px-2 py-1 text-xs font-semibold', statusStyles[month.status])}>{MONTH_STATUS_LABELS[month.status]}</span>
      </span>
      {compact && (
          <span className="mt-4 grid grid-cols-1 gap-3 text-sm min-[440px]:grid-cols-3 min-[440px]:gap-2">
          <span><small className="block text-gray-500 dark:text-slate-400">Receitas</small><strong className="text-green-700 dark:text-green-300">{formatCents(month.income.total)}</strong></span>
          <span><small className="block text-gray-500 dark:text-slate-400">Despesas</small><strong className="text-red-700 dark:text-red-300">{formatCents(month.expense.total)}</strong></span>
          <span><small className="block text-gray-500 dark:text-slate-400">Balanço</small><strong className={month.balance.total > 0 ? 'text-blue-700 dark:text-blue-300' : month.balance.total < 0 ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-slate-300'}>{formatCents(month.balance.total)}</strong></span>
        </span>
      )}
    </button>
  );

  return (
    <section aria-labelledby="monthly-overview-title" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-torrinco-700 dark:text-torrinco-300">Visão mensal</p>
          <h1 id="monthly-overview-title" className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{monthLabel(selected.month)}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Registrado e projetado com a mesma regra financeira.</p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800" aria-label="Navegação por ano">
          <button aria-label="Ano anterior" onClick={() => setYear(value => value - 1)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 dark:text-slate-300 dark:hover:bg-slate-700"><ChevronLeft size={20} /></button>
          <span className="min-w-20 text-center font-bold text-gray-800 dark:text-white">{year}</span>
          <button aria-label="Próximo ano" onClick={() => setYear(value => value + 1)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 dark:text-slate-300 dark:hover:bg-slate-700"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3" aria-live="polite">
        <SummaryCard label="Receitas" value={selected.income} tone="income" />
        <SummaryCard label="Despesas" value={selected.expense} tone="expense" />
        <SummaryCard label="Balanço" value={selected.balance} tone="balance" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-xl bg-torrinco-100 p-2.5 text-torrinco-700 dark:bg-torrinco-900/30 dark:text-torrinco-300"><CalendarRange size={20} /></span>
          <div><h2 className="font-bold text-gray-900 dark:text-white">Comparação do ano</h2><p className="text-sm text-gray-500 dark:text-slate-400">Abra um mês para conferir seus grupos e lançamentos.</p></div>
        </div>

        <div className="hidden md:block">
          <table className="w-full table-fixed text-sm">
            <thead><tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-slate-700 dark:text-slate-400"><th className="w-[28%] px-3 py-3">Mês</th><th className="px-3 py-3 text-right">Receitas</th><th className="px-3 py-3 text-right">Despesas</th><th className="px-3 py-3 text-right">Balanço</th><th className="w-20 px-3 py-3 text-right">Ação</th></tr></thead>
            <tbody>
              {overview.months.map(month => (
                <tr key={month.month} className="border-b border-gray-100 last:border-0 dark:border-slate-700/70">
                  <td className="py-1">{monthButton(month)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-green-700 dark:text-green-300">{formatCents(month.income.total)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-red-700 dark:text-red-300">{formatCents(month.expense.total)}</td>
                  <td className={clsx('px-3 py-3 text-right font-bold', month.balance.total > 0 ? 'text-blue-700 dark:text-blue-300' : month.balance.total < 0 ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-slate-300')}>{formatCents(month.balance.total)}</td>
                  <td className="px-3 py-3 text-right"><button aria-label={`Abrir detalhes de ${monthLabel(month.month)}`} onClick={() => toggleMonth(month.month)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 dark:text-slate-400 dark:hover:bg-slate-700"><ChevronDown className={clsx('transition', expandedMonth === month.month && 'rotate-180')} size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {expandedMonth && <div className="mt-5 border-t border-gray-100 pt-5 dark:border-slate-700"><h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Detalhes de {monthLabel(expandedMonth)}</h3><MonthDetail state={details[expandedMonth]} retry={() => void loadDetail(expandedMonth)} /></div>}
        </div>

        <div className="space-y-3 md:hidden">
          {overview.months.map(month => (
            <div key={month.month}>
              {monthButton(month, true)}
              {expandedMonth === month.month && <div className="mt-3 rounded-xl border border-gray-100 p-3 dark:border-slate-700"><MonthDetail state={details[month.month]} retry={() => void loadDetail(month.month)} /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
