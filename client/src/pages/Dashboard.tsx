import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { CreditCardCarousel } from '../components/CreditCardCarousel';
import { MonthlyOverview } from '../components/MonthlyOverview';
import { api } from '../services/api';
import { remindersService, type Reminder } from '../services/reminders.service';
import { getDashboardRequestParams, settleDashboardWidgets } from '../lib/dashboard-data';
import { formatLocalDateShort, localDateFromApi } from '../lib/local-date';

type WidgetStatus = 'loading' | 'loaded' | 'empty' | 'error' | 'unavailable';
type WidgetKey = 'transactions' | 'recurring' | 'calendar' | 'reminders';

interface Transaction {
  id: number | string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  transaction_date: string;
  categories?: { name?: string; color?: string };
  category?: string;
  financial_entities?: { name?: string };
}

interface RecurringTransaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  next_due_date: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  event_date: string;
}

type AgendaItem =
  | (RecurringTransaction & { itemType: 'recurring' })
  | (CalendarEvent & { itemType: 'event' });

const initialWidgetStatus: Record<WidgetKey, WidgetStatus> = {
  transactions: 'loading',
  recurring: 'loading',
  calendar: 'loading',
  reminders: 'loading',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function civilDateShort(value?: string | null) {
  if (!value) return 'Data não informada';
  try {
    return formatLocalDateShort(localDateFromApi(value));
  } catch {
    return 'Data não informada';
  }
}

function dateOrder(value: string) {
  const time = Date.parse(value.length === 10 ? `${value}T12:00:00Z` : value);
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

function WidgetFeedback({
  status,
  error,
  empty,
  unavailable,
  retry,
}: {
  status: WidgetStatus;
  error: string;
  empty?: string;
  unavailable?: string;
  retry: () => void;
}) {
  if (status === 'loading') {
    return <div className="flex items-center gap-2 py-4 text-sm text-gray-500 dark:text-slate-400"><Loader2 size={16} className="animate-spin" /> Carregando…</div>;
  }
  if (status === 'error') {
    return (
      <div className="py-3 text-sm text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button type="button" onClick={retry} className="mt-2 rounded-lg border border-red-200 px-3 py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900">Tentar novamente</button>
      </div>
    );
  }
  if (status === 'unavailable') return <p className="py-3 text-sm text-gray-500 dark:text-slate-400">{unavailable ?? 'Recurso não incluído no seu plano.'}</p>;
  if (status === 'empty') return <p className="py-3 text-sm text-gray-500 dark:text-slate-400">{empty ?? 'Não há dados neste período.'}</p>;
  return null;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringAgenda, setRecurringAgenda] = useState<Array<RecurringTransaction & { itemType: 'recurring' }>>([]);
  const [calendarAgenda, setCalendarAgenda] = useState<Array<CalendarEvent & { itemType: 'event' }>>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [widgetStatus, setWidgetStatus] = useState<Record<WidgetKey, WidgetStatus>>(initialWidgetStatus);
  const [completingReminder, setCompletingReminder] = useState<number | null>(null);

  const setStatus = (key: WidgetKey, status: WidgetStatus) => {
    setWidgetStatus(previous => ({ ...previous, [key]: status }));
  };

  const loadTransactions = async () => {
    setStatus('transactions', 'loading');
    try {
      const response = await api.get('/finance/transactions', {
        params: getDashboardRequestParams('month').transactions,
      });
      const items = (response.data.transactions ?? []) as Transaction[];
      setTransactions(items);
      setStatus('transactions', items.length ? 'loaded' : 'empty');
    } catch (error) {
      console.error('Falha nas transações recentes:', error);
      setTransactions([]);
      setStatus('transactions', 'error');
    }
  };

  const loadRecurring = async () => {
    setStatus('recurring', 'loading');
    try {
      const response = await api.get('/recurring/due', { params: { days: 7 } });
      const items = ((response.data.dueTransactions ?? []) as RecurringTransaction[])
        .map(item => ({ ...item, itemType: 'recurring' as const }));
      setRecurringAgenda(items);
      setStatus('recurring', items.length ? 'loaded' : 'empty');
    } catch (error) {
      console.error('Falha nas recorrências da agenda:', error);
      setRecurringAgenda([]);
      setStatus('recurring', 'error');
    }
  };

  const loadCalendar = async () => {
    setStatus('calendar', 'loading');
    try {
      const subscription = await api.get('/subscription');
      if (subscription.data?.plan?.features?.calendar !== true) {
        setCalendarAgenda([]);
        setStatus('calendar', 'unavailable');
        return;
      }
      const response = await api.get('/calendar', {
        params: getDashboardRequestParams('month').calendar,
      });
      const items = ((response.data.events ?? []) as CalendarEvent[])
        .map(item => ({ ...item, itemType: 'event' as const }));
      setCalendarAgenda(items);
      setStatus('calendar', items.length ? 'loaded' : 'empty');
    } catch (error) {
      console.error('Falha no calendário da agenda:', error);
      setCalendarAgenda([]);
      const status = (error as { response?: { status?: number } })?.response?.status;
      setStatus('calendar', status === 403 ? 'unavailable' : 'error');
    }
  };

  const loadReminders = async () => {
    setStatus('reminders', 'loading');
    try {
      const items = await remindersService.listDue();
      setReminders(items);
      setStatus('reminders', items.length ? 'loaded' : 'empty');
    } catch (error) {
      console.error('Falha nos lembretes:', error);
      setReminders([]);
      setStatus('reminders', 'error');
    }
  };

  const refreshSecondaryWidgets = async () => {
    await settleDashboardWidgets([loadTransactions, loadRecurring, loadCalendar, loadReminders]);
  };

  useEffect(() => {
    void refreshSecondaryWidgets();
  }, []);

  const agendaItems = useMemo<AgendaItem[]>(() => (
    [...recurringAgenda, ...calendarAgenda].sort((left, right) => {
      const leftDate = left.itemType === 'recurring' ? left.next_due_date : left.event_date;
      const rightDate = right.itemType === 'recurring' ? right.next_due_date : right.event_date;
      return dateOrder(leftDate) - dateOrder(rightDate);
    })
  ), [recurringAgenda, calendarAgenda]);

  const recentTransactions = useMemo(() => (
    [...transactions]
      .sort((left, right) => dateOrder(right.transaction_date) - dateOrder(left.transaction_date))
      .slice(0, 8)
  ), [transactions]);

  const completeReminder = async (id: number) => {
    setCompletingReminder(id);
    try {
      await remindersService.markAsCompleted(id);
      toast.success('Lembrete concluído.');
      await loadReminders();
    } catch (error) {
      console.error('Falha ao concluir lembrete:', error);
      toast.error('Não foi possível concluir o lembrete.');
    } finally {
      setCompletingReminder(null);
    }
  };

  const agendaLoading = widgetStatus.recurring === 'loading' || widgetStatus.calendar === 'loading';
  const agendaError = widgetStatus.recurring === 'error' || widgetStatus.calendar === 'error';

  return (
    <div className="space-y-6">
      <MonthlyOverview />

      <div className="grid gap-6 xl:grid-cols-3">
        <CreditCardCarousel className="min-w-0" onPaymentSuccess={() => void refreshSecondaryWidgets()} />

        <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6" aria-labelledby="agenda-title">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"><Calendar aria-hidden="true" size={22} /></span>
            <div>
              <h2 id="agenda-title" className="font-bold text-gray-900 dark:text-white">Agenda</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Próximos 7 dias</p>
            </div>
          </div>

          {agendaLoading && agendaItems.length === 0 ? (
            <WidgetFeedback status="loading" error="" retry={() => void refreshSecondaryWidgets()} />
          ) : agendaError && agendaItems.length === 0 ? (
            <WidgetFeedback status="error" error="Não foi possível carregar a agenda." retry={() => void refreshSecondaryWidgets()} />
          ) : agendaItems.length === 0 ? (
            <WidgetFeedback
              status={widgetStatus.calendar === 'unavailable' ? 'unavailable' : 'empty'}
              error=""
              empty="Nenhum compromisso ou recorrência para os próximos dias."
              unavailable="O calendário não está no seu plano e não há recorrências próximas."
              retry={() => void refreshSecondaryWidgets()}
            />
          ) : (
            <ul className="space-y-3">
              {agendaItems.slice(0, 6).map(item => {
                const isRecurring = item.itemType === 'recurring';
                const label = isRecurring ? item.description : item.title;
                const date = isRecurring ? item.next_due_date : item.event_date;
                return (
                  <li key={`${item.itemType}-${item.id}`} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 dark:bg-slate-900/40">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-100">{label}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400"><Clock aria-hidden="true" size={12} /> {civilDateShort(date)}</p>
                    </div>
                    {isRecurring && <span className={clsx('shrink-0 text-sm font-bold', item.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>{formatCurrency(item.amount)}</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6" aria-labelledby="reminders-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"><Bell aria-hidden="true" size={22} /></span>
              <h2 id="reminders-title" className="font-bold text-gray-900 dark:text-white">Lembretes</h2>
            </div>
            {reminders.length > 0 && <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{reminders.length}</span>}
          </div>

          {widgetStatus.reminders !== 'loaded' ? (
            <WidgetFeedback status={widgetStatus.reminders} error="Não foi possível carregar os lembretes." empty="Sem lembretes pendentes." retry={() => void loadReminders()} />
          ) : (
            <ul className="space-y-3">
              {reminders.slice(0, 5).map(reminder => (
                <li key={reminder.id} className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-slate-900/40">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-100">{reminder.content}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400"><Clock aria-hidden="true" size={12} /> {reminder.trigger_time.slice(0, 5)}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Concluir lembrete: ${reminder.content}`}
                    disabled={completingReminder === reminder.id}
                    onClick={() => void completeReminder(reminder.id)}
                    className="rounded-lg p-2 text-green-600 hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    {completingReminder === reminder.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6" aria-labelledby="recent-transactions-title">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 id="recent-transactions-title" className="font-bold text-gray-900 dark:text-white">Movimentações recentes</h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Lançamentos registrados no mês atual</p>
          </div>
          <button type="button" onClick={() => navigate('/transactions')} aria-label="Ver todas as transações" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 dark:text-slate-400 dark:hover:bg-slate-700"><MoreHorizontal size={20} /></button>
        </div>

        {widgetStatus.transactions !== 'loaded' ? (
          <WidgetFeedback status={widgetStatus.transactions} error="Não foi possível carregar as movimentações." empty="Nenhuma movimentação registrada neste mês." retry={() => void loadTransactions()} />
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-slate-700">
            {recentTransactions.map(transaction => (
              <li key={transaction.id} className="flex min-w-0 flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={clsx('shrink-0 rounded-xl p-2.5', transaction.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400')}>
                    {transaction.type === 'income' ? <ArrowDownLeft aria-hidden="true" size={18} /> : <ArrowUpRight aria-hidden="true" size={18} />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800 dark:text-white">{transaction.description}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-slate-400">{transaction.categories?.name ?? transaction.category ?? transaction.financial_entities?.name ?? 'Sem categoria'} · {civilDateShort(transaction.transaction_date)}</p>
                  </div>
                </div>
                <span className={clsx('shrink-0 pl-12 font-bold sm:pl-0', transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(Number(transaction.amount)))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-400 dark:text-slate-500"><CheckCircle2 aria-hidden="true" size={14} /> Resumos financeiros calculados pelo servidor</p>
    </div>
  );
}
