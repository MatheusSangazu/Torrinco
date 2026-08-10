import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Music, Fuel, TrendingUp, Utensils, AlertCircle, Clock, TrendingDown, BarChart3, Bell, CheckCircle2, Check, CreditCard as CreditCardIcon, Loader2, Trash2, X, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../services/api';
import { remindersService, type Reminder } from '../services/reminders.service';
import { CreditCardCarousel } from '../components/CreditCardCarousel';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatLocalDate } from '../lib/local-date';
import { getDashboardRequestParams, settleDashboardWidgets } from '../lib/dashboard-data';

type WidgetStatus = 'loading' | 'loaded' | 'empty' | 'error' | 'unavailable';
type WidgetKey = 'summary' | 'transactions' | 'recurring' | 'calendar' | 'forecast' | 'currentForecast' | 'chart' | 'reminders';
const initialWidgetStatus: Record<WidgetKey, WidgetStatus> = { summary: 'loading', transactions: 'loading', recurring: 'loading', calendar: 'loading', forecast: 'loading', currentForecast: 'loading', chart: 'loading', reminders: 'loading' };

function WidgetFeedback({ status, error, empty, unavailable, retry }: { status: WidgetStatus; error: string; empty?: string; unavailable?: string; retry: () => void }) {
  if (status === 'loading') return <div className="flex items-center gap-2 py-4 text-sm text-gray-500"><Loader2 size={16} className="animate-spin" /> Carregando…</div>;
  if (status === 'error') return <div className="py-3 text-sm text-red-600"><p>{error}</p><button onClick={event => { event.stopPropagation(); retry(); }} className="mt-2 rounded-lg border border-red-200 px-3 py-1.5 font-medium">Tentar novamente</button></div>;
  if (status === 'unavailable') return <div className="py-3 text-sm text-gray-500">{unavailable ?? 'Recurso não incluído no seu plano.'}</div>;
  if (status === 'empty') return <div className="py-3 text-sm text-gray-500">{empty ?? 'Não há dados neste período.'}</div>;
  return null;
}

interface Summary {
  income: number;
  expense: number;
  balance: number;
  cash_balance: number;
}

interface Forecast {
  period: string;
  forecast: {
    income: number;
    expenses: number;
    balance: number;
    breakdown: {
      recurring_income: Array<{
        description: string;
        amount: number;
        next_due_date: string;
        transaction_date?: string;
      }>;
      recurring_expenses: Array<{
        description: string;
        amount: number;
        next_due_date: string;
        transaction_date?: string;
        installment_number?: number;
      }>;
      normal_income: Array<{
        description: string;
        amount: number;
        transaction_date: string;
        next_due_date?: string;
      }>;
      normal_expenses: Array<{
        description: string;
        amount: number;
        transaction_date: string;
        next_due_date?: string;
        installment_number?: number;
      }>;
      installments: Array<{
        description: string;
        amount: number;
        transaction_date: string;
        next_due_date?: string;
        installment_number: number;
      }>;
      credit_card_bills: Array<{
        description: string;
        amount: number;
        transaction_date: string;
        card_name: string;
        card_color: string;
        card_id?: number;
        is_paid?: boolean;
        payment_id?: number;
        is_projected?: boolean;
        due_date?: string;
      }>;
    };
  };
}

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  payment_method?: string;
  categories?: {
    name: string;
    color: string;
  };
  description: string;
  transaction_date: string;
  status: string;
  financial_entities?: {
    name: string;
  };
}

interface RecurringTransaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  next_due_date: string;
}

interface Event {
  id: number;
  title: string;
  event_date: string;
  description?: string;
}

type AgendaItem = 
  | (RecurringTransaction & { itemType: 'recurring' })
  | (Event & { itemType: 'event' });

export function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [currentMonthForecast, setCurrentMonthForecast] = useState<Forecast | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [recurringAgenda, setRecurringAgenda] = useState<Array<RecurringTransaction & { itemType: 'recurring' }>>([]);
  const [calendarAgenda, setCalendarAgenda] = useState<Array<Event & { itemType: 'event' }>>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [widgetStatus, setWidgetStatus] = useState<Record<WidgetKey, WidgetStatus>>(initialWidgetStatus);
  const [period, setPeriod] = useState<'month' | 'all'>('month');
  const [chartData, setChartData] = useState<Array<{name: string; receitas: number; despesas: number}>>([]);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showCashDetailsModal, setShowCashDetailsModal] = useState(false);
  const [showCurrentMonthDetailsModal, setShowCurrentMonthDetailsModal] = useState(false);
  const [showUndoPaymentModal, setShowUndoPaymentModal] = useState(false);
  const [undoPaymentId, setUndoPaymentId] = useState<number | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);

  const setStatus = (key: WidgetKey, status: WidgetStatus) => setWidgetStatus(previous => ({ ...previous, [key]: status }));
  const loadSummary = async () => {
    setStatus('summary', 'loading');
    try { const response = await api.get('/finance/summary', { params: getDashboardRequestParams(period).summary }); const value = response.data.month_summary; setSummary(value); setStatus('summary', value ? 'loaded' : 'empty'); }
    catch (error) { console.error('Falha no resumo do dashboard:', error); setSummary(null); setStatus('summary', 'error'); }
  };
  const loadTransactions = async () => {
    setStatus('transactions', 'loading');
    try { const response = await api.get('/finance/transactions', { params: getDashboardRequestParams(period).transactions }); const items = response.data.transactions || []; setTransactions(items); setStatus('transactions', items.length ? 'loaded' : 'empty'); }
    catch (error) { console.error('Falha nas transações do dashboard:', error); setTransactions([]); setStatus('transactions', 'error'); }
  };
  const loadForecast = async (kind: 'current_month' | 'next_month') => {
    const key: WidgetKey = kind === 'current_month' ? 'currentForecast' : 'forecast'; setStatus(key, 'loading');
    const params = kind === 'current_month' ? getDashboardRequestParams(period).currentForecast : getDashboardRequestParams(period).nextForecast;
    try { const response = await api.get('/finance/forecast', { params }); if (kind === 'current_month') setCurrentMonthForecast(response.data); else setForecast(response.data); setStatus(key, 'loaded'); }
    catch (error) { console.error(`Falha na previsão ${kind}:`, error); if (kind === 'current_month') setCurrentMonthForecast(null); else setForecast(null); setStatus(key, 'error'); }
  };
  const loadChart = async () => {
    setStatus('chart', 'loading');
    try { const response = await api.get('/finance/transactions', { params: getDashboardRequestParams(period).chart }); const data = generateChartData(response.data.transactions || []); setChartData(data); setStatus('chart', data.length ? 'loaded' : 'empty'); }
    catch (error) { console.error('Falha no gráfico do dashboard:', error); setChartData([]); setStatus('chart', 'error'); }
  };
  const loadRecurring = async () => {
    setStatus('recurring', 'loading');
    try { const response = await api.get('/recurring/due', { params: { days: 7 } }); const items = (response.data.dueTransactions || []).map((item: RecurringTransaction) => ({ ...item, itemType: 'recurring' as const })); setRecurringAgenda(items); setStatus('recurring', items.length ? 'loaded' : 'empty'); }
    catch (error) { console.error('Falha nas recorrências do dashboard:', error); setRecurringAgenda([]); setStatus('recurring', 'error'); }
  };
  const loadCalendar = async () => {
    setStatus('calendar', 'loading');
    try {
      const subscription = await api.get('/subscription');
      if (subscription.data?.plan?.features?.calendar !== true) { setCalendarAgenda([]); setStatus('calendar', 'unavailable'); return; }
      const response = await api.get('/calendar', { params: getDashboardRequestParams(period).calendar });
      const items = (response.data.events || []).map((item: Event) => ({ ...item, itemType: 'event' as const })); setCalendarAgenda(items); setStatus('calendar', items.length ? 'loaded' : 'empty');
    } catch (error: any) {
      console.error('Falha no calendário do dashboard:', error); setCalendarAgenda([]);
      setStatus('calendar', error?.response?.status === 403 ? 'unavailable' : 'error');
    }
  };
  const loadReminders = async () => {
    setStatus('reminders', 'loading');
    try { const items = await remindersService.listDue(); setReminders(items); setStatus('reminders', items.length ? 'loaded' : 'empty'); }
    catch (error) { console.error('Falha nos lembretes do dashboard:', error); setReminders([]); setStatus('reminders', 'error'); }
  };
  const fetchData = async () => {
    await settleDashboardWidgets([loadSummary, loadTransactions, loadRecurring, loadCalendar, () => loadForecast('next_month'), () => loadForecast('current_month'), loadChart, loadReminders]);
  };


  useEffect(() => {
    fetchData();
  }, [period]);

  useEffect(() => {
    setAgendaItems([...recurringAgenda, ...calendarAgenda].sort((a, b) => {
      const dateA = a.itemType === 'recurring' ? parseDateLocal(a.next_due_date) : parseDateLocal(a.event_date);
      const dateB = b.itemType === 'recurring' ? parseDateLocal(b.next_due_date) : parseDateLocal(b.event_date);
      return dateA.getTime() - dateB.getTime();
    }));
  }, [recurringAgenda, calendarAgenda]);

  const handlePayCardBill = async (bill: any) => {
    const toastId = toast.loading('Registrando pagamento...');
    try {
      const today = new Date();
      const todayStr = formatLocalDate(today);
      const dueDate = new Date(bill.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
      
      const paymentData = {
        amount: bill.transactions.reduce((sum: number, t: any) => sum + t.amount, 0),
        type: 'expense',
        description: `Pagamento Fatura ${bill.card_name} - ${dueDate}`,
        category: 'Pagamento de Cartão',
        payment_method: 'pix',
        transaction_date: todayStr,
        status: 'paid',
        entity_id: null
      };

      await api.post('/finance/transactions', paymentData);
      toast.success('Pagamento registrado!', { id: toastId });
      fetchData();
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
      toast.error('Erro ao registrar pagamento.', { id: toastId });
    }
  };

  const handleUndoCardPayment = (paymentId: number) => {
    setUndoPaymentId(paymentId);
    setShowUndoPaymentModal(true);
  };

  const confirmUndoCardPayment = async () => {
    if (!undoPaymentId) return;
    
    const toastId = toast.loading('Desfazendo pagamento...');
    try {
      setIsUndoing(true);
      await api.delete(`/finance/transactions/${undoPaymentId}`);
      toast.success('Pagamento desfeito!', { id: toastId });
      setShowUndoPaymentModal(false);
      setUndoPaymentId(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao desfazer pagamento:', error);
      toast.error('Erro ao desfazer pagamento.', { id: toastId });
    } finally {
      setIsUndoing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const parseDateLocal = (dateString: string | Date) => {
    if (!dateString) return new Date();
    if (dateString instanceof Date) return dateString;
    
    // Se for string, tentamos tratar como data YYYY-MM-DD
    const dateStr = typeof dateString === 'string' ? dateString : String(dateString);
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      // Criamos a data em UTC às 12:00 para consistência com o backend
      return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    }
    
    return new Date(dateString);
  };

  const getCategoryIcon = (category: string) => {
    switch ((category || '').toUpperCase()) {
      case 'ASSINATURA': return Music;
      case 'TRANSPORTE': return Fuel;
      case 'ALIMENTAÇÃO': return Utensils;
      case 'VENDAS': return TrendingUp;
      case 'PAGAMENTO DE CARTÃO': return CreditCardIcon;
      default: return MoreHorizontal;
    }
  };

  const handleDeleteTransaction = (id: number | string) => {
    setUndoPaymentId(Number(id));
    setShowUndoPaymentModal(true);
  };

  const generateChartData = (transactions: Transaction[]) => {
    const today = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      
      const monthTrans = transactions.filter(t => {
        const tDate = parseDateLocal(t.transaction_date);
        return tDate.getUTCMonth() === month && tDate.getUTCFullYear() === year;
      });

      const income = monthTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
      const expense = monthTrans.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

      data.push({
        name: d.toLocaleDateString('pt-BR', { month: 'short' }),
        receitas: income,
        despesas: expense
      });
    }
    return data;
  };

  const calculateCashBalance = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const filtered = transactions.filter(t => {
      const isCashType = t.type === 'income' || (t.type === 'expense' && ['cash', 'pix', 'debit'].includes(t.payment_method || ''));
      const isPastOrPresent = parseDateLocal(t.transaction_date) <= today;
      return isCashType && isPastOrPresent;
    });

    const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
    return totalIncome - totalExpense;
  };


  return (
    <div className="space-y-6">
      {/* Header Mobile - Título da Página */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white lg:hidden mb-0">
          Dashboard
        </h1>
        
        {/* Seletor de Período */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('month')}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              period === 'month'
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            )}
          >
            Mês Atual
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              period === 'all'
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            )}
          >
            Acumulado
          </button>
        </div>
      </div>

      {/* Grid de Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-4">

        {/* Card Saldo em Dinheiro */}
        <div 
          onClick={() => setShowCashDetailsModal(true)}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            LIVE
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Saldo {period === 'month' ? 'do Mês' : 'Acumulado'}</span>
          </div>
          <div>
            {(widgetStatus.summary === 'error' || widgetStatus.transactions === 'error' || widgetStatus.summary === 'loading' || widgetStatus.transactions === 'loading') ? (
              <WidgetFeedback status={widgetStatus.summary === 'error' || widgetStatus.transactions === 'error' ? 'error' : 'loading'} error="Não foi possível carregar o resumo financeiro." retry={() => { loadSummary(); loadTransactions(); }} />
            ) : (<>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(calculateCashBalance())}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Receitas: <span className="font-semibold text-green-600">{summary ? formatCurrency(summary.income || 0) : 'R$ 0,00'}</span>
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                Ver detalhes <ArrowUpRight size={12} className="text-blue-500" />
              </p>
            </div>
            </>)}
          </div>
        </div>

        {/* Card Previsão do Próximo Mês */}
        <div 
          onClick={() => setShowForecastModal(true)}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingDown size={12} />
            PREVISÃO
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <TrendingDown size={24} />
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Próximo Mês</span>
          </div>
          <div>
            {widgetStatus.forecast !== 'loaded' && <WidgetFeedback status={widgetStatus.forecast} error="Não foi possível carregar a previsão do próximo mês." retry={() => loadForecast('next_month')} />}
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              {/* O valor só aparece após carregamento bem-sucedido. */}
              {widgetStatus.forecast === 'loaded' && forecast ? formatCurrency(forecast.forecast.balance) : null}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <span className="text-green-600 font-semibold">{widgetStatus.forecast === 'loaded' && forecast ? formatCurrency(forecast.forecast.income) : null}</span>
                {' '}entradas
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <span className="text-red-600 font-semibold">{widgetStatus.forecast === 'loaded' && forecast ? formatCurrency(forecast.forecast.expenses) : null}</span>
                {' '}saídas
              </p>
            </div>
          </div>
        </div>

        <CreditCardCarousel className="xl:hidden" onPaymentSuccess={fetchData} />

        {/* Card Detalhes Mês Atual */}
        <div 
          onClick={() => setShowCurrentMonthDetailsModal(true)}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="absolute top-4 right-4 bg-torrinco-100 dark:bg-torrinco-900/30 text-torrinco-600 dark:text-torrinco-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <BarChart3 size={12} />
            MÊS ATUAL
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-torrinco-100 dark:bg-torrinco-900/30 rounded-xl text-torrinco-600 dark:text-torrinco-400">
              <BarChart3 size={24} />
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Resumo Detalhado</span>
          </div>
          <div>
            {widgetStatus.currentForecast !== 'loaded' && <WidgetFeedback status={widgetStatus.currentForecast} error="Não foi possível carregar a previsão do mês atual." retry={() => loadForecast('current_month')} />}
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              {widgetStatus.currentForecast === 'loaded' && currentMonthForecast ? formatCurrency(currentMonthForecast.forecast.balance) : null}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center justify-between">
                <span>Saldo Final Previsto</span>
                <ArrowUpRight size={14} className="text-blue-500" />
              </p>
              <p className="text-xs text-gray-400">Clique para ver o que falta pagar</p>
            </div>
          </div>
        </div>

        {/* Card Agenda (Recorrências) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
              <Calendar size={24} />
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Agenda (7 dias)</span>
          </div>
          <div className="space-y-3">
            {(widgetStatus.recurring === 'loading' || widgetStatus.calendar === 'loading') ? (
              <WidgetFeedback status="loading" error="" retry={() => { loadRecurring(); loadCalendar(); }} />
            ) : (widgetStatus.calendar === 'unavailable' && widgetStatus.recurring === 'empty') ? (
              <WidgetFeedback status="unavailable" error="" unavailable="Calendário não incluído no seu plano." retry={loadCalendar} />
            ) : ((widgetStatus.recurring === 'error' || widgetStatus.calendar === 'error') && agendaItems.length === 0) ? (
              <WidgetFeedback status="error" error="Não foi possível carregar a agenda." retry={() => { loadRecurring(); loadCalendar(); }} />
            ) : agendaItems.length > 0 ? (
              agendaItems.map((item, index) => {
                if (item.itemType === 'recurring') {
                  return (
                    <div key={`rec-${item.id}-${index}`} className="flex justify-between items-center text-sm">
                       <span className="text-gray-600 dark:text-slate-300 truncate mr-2">{item.description}</span>
                       <span className={clsx(
                         "font-bold whitespace-nowrap",
                         item.type === 'expense' ? "text-red-500" : "text-green-500"
                       )}>{formatCurrency(item.amount)}</span>
                    </div>
                  );
                } else {
                  return (
                    <div key={`evt-${item.id}-${index}`} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 truncate mr-2 min-w-0">
                         <Clock size={14} className="text-purple-500 shrink-0" />
                         <span className="truncate">{item.title}</span>
                       </div>
                       <span className="text-xs text-gray-400 whitespace-nowrap">
                         {new Date(item.event_date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                       </span>
                    </div>
                  );
                }
              })
            ) : (
               <div className="flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 py-2">
                 <AlertCircle size={20} className="mb-1" />
                 <span className="text-xs">Nada previsto</span>
               </div>
            )}
          </div>
        </div>

        {/* Card Lembretes */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            {reminders.length > 0 && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>}
            {reminders.length}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <Bell size={24} />
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Lembretes</span>
          </div>
          <div className="space-y-3">
            {widgetStatus.reminders === 'loading' ? (
              <WidgetFeedback status="loading" error="" retry={loadReminders} />
            ) : widgetStatus.reminders === 'error' ? (
              <WidgetFeedback status="error" error="Não foi possível carregar os lembretes." retry={loadReminders} />
            ) : reminders.length > 0 ? (
              reminders.slice(0, 3).map((reminder, index) => (
                <div key={`rem-${reminder.id}-${index}`} className="flex justify-between items-start text-sm">
                  <div className="flex-1 min-w-0">
                    <span className={clsx(
                      "font-medium truncate block",
                      reminder.status === 'completed' ? "line-through text-gray-400 dark:text-slate-500" : "text-gray-600 dark:text-slate-300"
                    )}>
                      {reminder.content}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {new Date(reminder.trigger_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await remindersService.markAsCompleted(reminder.id);
                      const updated = await remindersService.listDue();
                      setReminders(updated);
                    }}
                    className={clsx(
                      "p-1.5 rounded-lg transition-colors shrink-0 ml-2",
                      reminder.status === 'completed'
                        ? "text-gray-400 dark:text-slate-500"
                        : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    )}
                    title={reminder.status === 'completed' ? 'Concluído' : 'Marcar como concluído'}
                  >
                    {reminder.status === 'completed' ? <Check size={16} /> : <CheckCircle2 size={16} />}
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 py-2">
                <Bell size={20} className="mb-1 opacity-50" />
                <span className="text-xs">Sem lembretes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Evolução Financeira</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Últimos 6 meses</p>
            </div>
          </div>
          <div className="h-72">
          {widgetStatus.chart === 'loading' ? (
            <WidgetFeedback status="loading" error="" retry={loadChart} />
          ) : widgetStatus.chart === 'error' ? (
            <WidgetFeedback status="error" error="Não foi possível carregar o gráfico." retry={loadChart} />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value: string) => value === 'receitas' ? 'Receitas' : 'Despesas'}
                />
                <Line 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sem dados para exibir</p>
              </div>
            </div>
          )}
        </div>
        </div>

        <div className="xl:col-span-1 hidden xl:block">
          <CreditCardCarousel onPaymentSuccess={fetchData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Transações */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Movimentações Recentes</h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
              title="Ver todas as transações"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {widgetStatus.transactions === 'loading' ? (
              <WidgetFeedback status="loading" error="" retry={loadTransactions} />
            ) : widgetStatus.transactions === 'error' ? (
              <WidgetFeedback status="error" error="Não foi possível carregar as movimentações." retry={loadTransactions} />
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => {
                const Icon = getCategoryIcon(transaction.category || '');
                return (
                  <div key={transaction.id} className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 rounded-xl transition-colors -mx-2">
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "p-3 rounded-xl",
                        transaction.type === 'income'
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      )}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">{transaction.description || transaction.categories?.name || transaction.category}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <span>{transaction.categories?.name || transaction.category}</span>
                          <span>•</span>
                          <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <span className={clsx(
                          "block font-bold",
                          transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white"
                        )}>
                          {transaction.type === 'expense' ? '-' : '+'} {formatCurrency(transaction.amount)}
                        </span>
                        <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-1">
                          {transaction.type === 'income' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {transaction.status}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Excluir transação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-slate-400">
                Nenhuma transação recente
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes da Previsão */}
      {showForecastModal && forecast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detalhes da Previsão - {forecast.period}</h2>
                <button 
                  onClick={() => setShowForecastModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-xl border border-green-100/50 dark:border-green-900/30">
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Receitas</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 truncate">{formatCurrency(forecast.forecast.income)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-100/50 dark:border-red-900/30">
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Despesas</p>
                  <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 truncate">{formatCurrency(forecast.forecast.expenses)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/30 col-span-2 sm:col-span-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Saldo Previsto</p>
                  <p className={clsx(
                    "text-base sm:text-lg font-bold truncate",
                    forecast.forecast.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                  )}>{formatCurrency(forecast.forecast.balance)}</p>
                </div>
              </div>

              <div className="space-y-6">
                {forecast.forecast.breakdown.recurring_income.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <ArrowDownLeft size={16} className="text-green-500" />
                      Receitas Recorrentes
                    </h3>
                    <div className="space-y-2">
                      {forecast.forecast.breakdown.recurring_income.map((item, idx) => (
                        <div key={`inc-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
                              <ArrowDownLeft size={14} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {new Date(item.next_due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-green-600 dark:text-green-400 shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {forecast.forecast.breakdown.normal_income.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <ArrowDownLeft size={16} className="text-green-500" />
                      Receitas Normais
                    </h3>
                    <div className="space-y-2">
                      {forecast.forecast.breakdown.normal_income.map((item, idx) => (
                        <div key={`norm-inc-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
                              <ArrowDownLeft size={14} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {new Date(item.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-green-600 dark:text-green-400 shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {forecast.forecast.breakdown.recurring_expenses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-red-500" />
                      Despesas Recorrentes
                    </h3>
                    <div className="space-y-2">
                      {forecast.forecast.breakdown.recurring_expenses.map((item, idx) => (
                        <div key={`rec-exp-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                              <ArrowUpRight size={14} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {new Date(item.next_due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-red-600 dark:text-red-400 shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {forecast.forecast.breakdown.normal_expenses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-orange-500" />
                      Despesas Normais
                    </h3>
                    <div className="space-y-2">
                      {forecast.forecast.breakdown.normal_expenses.map((item, idx) => (
                        <div key={`norm-exp-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                              <ArrowUpRight size={14} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {new Date(item.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-orange-600 dark:text-orange-400 shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {forecast.forecast.breakdown.installments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-purple-500" />
                      Parcelas
                    </h3>
                    <div className="space-y-2">
                      {forecast.forecast.breakdown.installments.map((item, idx) => (
                        <div key={`inst-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                              <ArrowUpRight size={14} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Parcela {item.installment_number} • {new Date(item.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-purple-600 dark:text-purple-400 shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(() => {
                  const cardBills = forecast.forecast.breakdown.credit_card_bills.reduce((acc: any, item: any) => {
                    const key = `${item.card_name}-${item.card_color}`;
                    if (!acc[key]) {
                      acc[key] = {
                        card_name: item.card_name,
                        card_color: item.card_color,
                        transactions: []
                      };
                    }
                    acc[key].transactions.push(item);
                    return acc;
                  }, {});

                  return Object.values(cardBills).length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                        <CreditCardIcon size={16} className="text-blue-500" />
                        Faturas de Cartão
                      </h3>
                      <div className="space-y-4">
                        {Object.values(cardBills).map((cardGroup: any, cardIdx) => (
                          <div key={`card-${cardIdx}`} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl overflow-hidden">
                            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-slate-600">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: cardGroup.card_color }}
                              />
                              <h4 className="font-semibold text-gray-800 dark:text-white">{cardGroup.card_name}</h4>
                              <span className="ml-auto font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(cardGroup.transactions.reduce((sum: number, t: any) => sum + t.amount, 0))}
                              </span>
                            </div>
                            <div className="p-4 space-y-2">
                              {cardGroup.transactions.map((item: any, idx: number) => (
                                <div key={`cc-${cardIdx}-${idx}`} className="flex justify-between items-center text-sm gap-3">
                                  <div className="min-w-0">
                                    <p className="text-gray-700 dark:text-gray-300 truncate">{item.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                      {new Date(item.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </p>
                                  </div>
                                  <span className="font-medium text-gray-600 dark:text-gray-400 shrink-0">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Saldo em Dinheiro */}
      {showCashDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Wallet size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Extrato do Saldo em Dinheiro</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setShowCashDetailsModal(false);
                      setShowCurrentMonthDetailsModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-900/30"
                  >
                    DETALHES MÊS ATUAL
                  </button>
                  <button 
                    onClick={() => setShowCashDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Resumo no Modal */}
              {(() => {
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                
                // Filtrar transações que afetam o caixa e já aconteceram
                const filtered = transactions.filter(t => {
                  const isCashType = t.type === 'income' || (t.type === 'expense' && ['cash', 'pix', 'debit'].includes(t.payment_method || ''));
                  const tDate = parseDateLocal(t.transaction_date);
                  const isPastOrPresent = tDate.getTime() <= today.getTime();
                  return isCashType && isPastOrPresent;
                });

                let totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
                let totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
                
                // Adicionar receitas e despesas recorrentes do forecast que ainda não foram pagas
                const currentMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1, 0, 0, 0));
                const currentMonthEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0, 23, 59, 59, 999));

                if (currentMonthForecast?.forecast?.breakdown?.recurring_income) {
                  currentMonthForecast.forecast.breakdown.recurring_income.forEach(recurringIncome => {
                    const dueDate = parseDateLocal(recurringIncome.next_due_date || recurringIncome.transaction_date || '');
                    if (dueDate.getTime() >= currentMonthStart.getTime() && dueDate.getTime() <= currentMonthEnd.getTime()) {
                      totalIncome += Number(recurringIncome.amount || 0);
                    }
                  });
                }

                if (currentMonthForecast?.forecast?.breakdown?.recurring_expenses) {
                  currentMonthForecast.forecast.breakdown.recurring_expenses.forEach(recurringExpense => {
                    const dueDate = parseDateLocal(recurringExpense.next_due_date || recurringExpense.transaction_date || '');
                    if (dueDate.getTime() >= currentMonthStart.getTime() && dueDate.getTime() <= currentMonthEnd.getTime()) {
                      totalExpense += Number(recurringExpense.amount || 0);
                    }
                  });
                }

                if (currentMonthForecast?.forecast?.breakdown?.installments) {
                  currentMonthForecast.forecast.breakdown.installments.forEach(installment => {
                    const dueDate = parseDateLocal(installment.transaction_date || installment.next_due_date || '');
                    if (dueDate.getTime() >= currentMonthStart.getTime() && dueDate.getTime() <= currentMonthEnd.getTime()) {
                      totalExpense += Number(installment.amount || 0);
                    }
                  });
                }
                
                const currentBalance = totalIncome - totalExpense;

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-xl border border-green-100/50 dark:border-green-900/30">
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Receitas (Mês)</p>
                        <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 truncate">
                          {formatCurrency(totalIncome)}
                        </p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-100/50 dark:border-red-900/30">
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Saídas (Mês)</p>
                        <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 truncate">
                          {formatCurrency(totalExpense)}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/30 col-span-2 sm:col-span-3">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium">Saldo Disponível Agora</p>
                          <p className={clsx(
                            "text-xl sm:text-2xl font-bold truncate",
                            currentBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                          )}>{formatCurrency(currentBalance)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Transações que compõem o saldo */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <MoreHorizontal size={16} />
                        Movimentações Realizadas
                      </h3>

                      <div className="space-y-3">
                        {filtered
                          .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
                          .map((t) => (
                            <div key={t.id} className="group flex justify-between items-center p-4 bg-gray-50/50 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-600 transition-all shadow-sm hover:shadow-md">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className={clsx(
                                  "p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110",
                                  t.type === 'income' ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                                )}>
                                  {t.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {t.description}
                                  </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded">
                                        {t.payment_method === 'pix' ? 'Pix' : t.payment_method === 'debit' ? 'Débito' : t.payment_method === 'credit' ? 'Crédito' : 'Dinheiro'}
                                      </span>
                                      {t.financial_entities && (
                                        <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                                          {t.financial_entities.name}
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-400">
                                        {parseDateLocal(t.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                      </span>
                                    </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <span className={clsx(
                                  "text-base font-bold",
                                  t.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white"
                                )}>
                                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                </span>
                              </div>
                            </div>
                          ))}

                        {filtered.length === 0 && (
                          <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-gray-50 dark:bg-slate-800 rounded-full mb-3 text-gray-400">
                              <Wallet size={32} />
                            </div>
                            <p className="text-gray-500 dark:text-slate-400">Nenhuma movimentação realizada neste período.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {/* Modal de Detalhes do Mês Atual */}
      {showCurrentMonthDetailsModal && currentMonthForecast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <BarChart3 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detalhes do Mês Atual</h2>
                </div>
                <button 
                  onClick={() => setShowCurrentMonthDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-xl border border-green-100/50 dark:border-green-900/30">
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Total Entradas</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 truncate">{formatCurrency(currentMonthForecast.forecast.income)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-100/50 dark:border-red-900/30">
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Total Saídas</p>
                  <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 truncate">{formatCurrency(currentMonthForecast.forecast.expenses)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/30 col-span-2 sm:col-span-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Saldo Final Previsto</p>
                  <p className={clsx(
                    "text-base sm:text-lg font-bold truncate",
                    currentMonthForecast.forecast.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                  )}>{formatCurrency(currentMonthForecast.forecast.balance)}</p>
                </div>
              </div>

              {/* Breakdown similar ao forecast */}
              <div className="space-y-8">
                {/* Entradas */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-500" />
                    Entradas (Previstas + Reais)
                  </h3>
                  <div className="space-y-2">
                    {[...currentMonthForecast.forecast.breakdown.normal_income, ...currentMonthForecast.forecast.breakdown.recurring_income]
                      .sort((a, b) => {
                        const dateA = parseDateLocal(a.transaction_date || a.next_due_date || '').getTime();
                        const dateB = parseDateLocal(b.transaction_date || b.next_due_date || '').getTime();
                        return dateA - dateB;
                      })
                      .map((item, idx) => (
                        <div key={`income-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {parseDateLocal(item.transaction_date || item.next_due_date || '').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                            </p>
                          </div>
                          <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Saídas */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <TrendingDown size={16} className="text-red-500" />
                    Saídas (Previstas + Reais)
                  </h3>
                  <div className="space-y-4">
                    {/* Despesas Normais e Recorrências */}
                    <div className="space-y-2">
                      {[...currentMonthForecast.forecast.breakdown.normal_expenses, ...currentMonthForecast.forecast.breakdown.recurring_expenses, ...currentMonthForecast.forecast.breakdown.installments]
                        .sort((a, b) => {
                          const dateA = parseDateLocal(a.transaction_date || a.next_due_date || '').getTime();
                          const dateB = parseDateLocal(b.transaction_date || b.next_due_date || '').getTime();
                          return dateA - dateB;
                        })
                        .map((item, idx) => (
                          <div key={`expense-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.description}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                  {parseDateLocal(item.transaction_date || item.next_due_date || '').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </p>
                                {item.installment_number && (
                                  <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-1.5 py-0.5 rounded">
                                    Parcela {item.installment_number}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-red-600 dark:text-red-400">{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                    </div>

                    {/* Faturas de Cartão */}
                    {(() => {
                      const cardBills = currentMonthForecast.forecast.breakdown.credit_card_bills.reduce((acc: any, item: any) => {
                        const key = `${item.card_name}-${item.card_color}`;
                        if (!acc[key]) {
                          acc[key] = {
                            card_id: item.card_id,
                            card_name: item.card_name,
                            card_color: item.card_color,
                            due_date: item.due_date,
                            is_paid: item.is_paid,
                            payment_id: item.payment_id,
                            transactions: []
                          };
                        }
                        acc[key].transactions.push(item);
                        return acc;
                      }, {});

                      return Object.values(cardBills).map((cardGroup: any, cardIdx) => (
                        <div key={`card-current-${cardIdx}`} className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                          <div className="flex items-center gap-3 p-3 border-b border-blue-100/50 dark:border-blue-900/20">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cardGroup.card_color }} />
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white">{cardGroup.card_name}</h4>
                            
                            <div className="ml-auto flex items-center gap-3">
                              {cardGroup.is_paid ? (
                                <button
                                  onClick={() => handleUndoCardPayment(cardGroup.payment_id)}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-lg hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors border border-green-200 dark:border-green-800"
                                  title="Clique para desfazer o pagamento"
                                >
                                  <Check size={12} />
                                  PAGA
                                  <RotateCcw size={10} className="ml-0.5 opacity-60" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePayCardBill(cardGroup)}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-torrinco-600 text-white text-[10px] font-bold rounded-lg hover:bg-torrinco-700 transition-colors shadow-sm"
                                >
                                  <CreditCardIcon size={12} />
                                  PAGAR FATURA
                                </button>
                              )}
                              <span className={clsx("text-sm font-bold", cardGroup.is_paid ? "text-gray-400 line-through" : "text-blue-600")}>
                                {formatCurrency(cardGroup.transactions.reduce((sum: number, t: any) => sum + t.amount, 0))}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 space-y-2">
                            {cardGroup.transactions.map((item: any, idx: number) => (
                              <div key={`cc-current-${cardIdx}-${idx}`} className="flex justify-between items-center text-xs">
                                <div className="min-w-0">
                                  <p className="text-gray-700 dark:text-gray-300 truncate">{item.description}</p>
                                  <p className="text-[10px] text-gray-500">
                                    {parseDateLocal(item.transaction_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    {item.is_projected && <span className="ml-2 text-orange-500 font-medium">(Previsto)</span>}
                                  </p>
                                </div>
                                <span className="font-medium text-gray-600">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Confirmação para Desfazer Pagamento */}
      <ConfirmModal
        isOpen={showUndoPaymentModal}
        onClose={() => {
          setShowUndoPaymentModal(false);
          setUndoPaymentId(null);
        }}
        onConfirm={confirmUndoCardPayment}
        title="Desfazer Pagamento?"
        message="Tem certeza que deseja excluir o registro de pagamento? Isso fará com que a obrigação volte a aparecer como pendente."
        confirmLabel="DESFAZER"
        cancelLabel="CANCELAR"
        isLoading={isUndoing}
        type="warning"
      />
    </div>
  );
}
