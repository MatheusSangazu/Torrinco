import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Music, Fuel, TrendingUp, Utensils, AlertCircle, Clock, TrendingDown, BarChart3, Bell, CheckCircle2, Check, CreditCard as CreditCardIcon, Loader2, Trash2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../services/api';
import { remindersService, type Reminder } from '../services/reminders.service';
import { CreditCardCarousel } from '../components/CreditCardCarousel';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      }>;
      recurring_expenses: Array<{
        description: string;
        amount: number;
        next_due_date: string;
      }>;
      normal_income: Array<{
        description: string;
        amount: number;
        transaction_date: string;
      }>;
      normal_expenses: Array<{
        description: string;
        amount: number;
        transaction_date: string;
      }>;
      installments: Array<{
        description: string;
        amount: number;
        transaction_date: string;
        installment_number: number;
      }>;
      credit_card_bills: Array<{
        description: string;
        amount: number;
        transaction_date: string;
        card_name: string;
        card_color: string;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'all'>('month');
  const [chartData, setChartData] = useState<Array<{name: string; receitas: number; despesas: number}>>([]);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showCashDetailsModal, setShowCashDetailsModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range for next 7 days
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = nextWeek.toISOString().split('T')[0];

      // Calculate date range for current month (cash details)
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startDateMonth = firstDayOfMonth.toISOString().split('T')[0];

      // Calculate date range for last 6 months (chart)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      const startDateChart = sixMonthsAgo.toISOString().split('T')[0];

      const [summaryRes, transactionsRes, dueRes, eventsRes, forecastRes, chartRes] = await Promise.all([
        api.get(`/finance/summary?period=${period}`),
        api.get(`/finance/transactions?start_date=${period === 'month' ? startDateMonth : '1970-01-01'}&end_date=${endDateStr}`),
        api.get('/recurring/due?days=7'),
        api.get(`/calendar?start_date=${startDateStr}&end_date=${endDateStr}`),
        api.get('/finance/forecast?period=next_month'),
        api.get(`/finance/transactions?start_date=${startDateChart}`)
      ]);

      setSummary(summaryRes.data.month_summary);
      setForecast(forecastRes.data);
      setTransactions(transactionsRes.data.transactions);
      setChartData(generateChartData(chartRes.data.transactions));

      const dueReminders = await remindersService.listDue();
      setReminders(dueReminders);
      
      // Combine recurring transactions and events
      const recurring = (dueRes.data.dueTransactions || []).map((item: RecurringTransaction) => ({
        ...item,
        itemType: 'recurring' as const
      }));
      
      const events = (eventsRes.data.events || []).map((item: Event) => ({
        ...item,
        itemType: 'event' as const
      }));

      // Sort by date
      const combined = [...recurring, ...events].sort((a, b) => {
        const dateA = a.itemType === 'recurring' ? new Date(a.next_due_date) : new Date(a.event_date);
        const dateB = b.itemType === 'recurring' ? new Date(b.next_due_date) : new Date(b.event_date);
        return dateA.getTime() - dateB.getTime();
      });

      setAgendaItems(combined);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  const handleDeleteTransaction = async (id: number | string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação? Isso reverterá o pagamento.')) return;
    
    try {
      await api.delete(`/finance/transactions/${id}`);
      toast.success('Transação excluída com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação.');
    }
  };

  const generateChartData = (transactions: Transaction[]) => {
    const today = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      
      const monthTrans = transactions.filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Carregando informações...
      </div>
    );
  }

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
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              {summary ? formatCurrency(summary.cash_balance || 0) : 'R$ 0,00'}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Receitas: <span className="font-semibold text-green-600">{summary ? formatCurrency(summary.income || 0) : 'R$ 0,00'}</span>
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                Ver detalhes <ArrowUpRight size={12} className="text-blue-500" />
              </p>
            </div>
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
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              {/* Aqui usamos o optional chaining "?." e o nullish coalescing "??" para segurança */}
              {formatCurrency(forecast?.forecast?.balance ?? 0)}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <span className="text-green-600 font-semibold">{formatCurrency(forecast?.forecast?.income ?? 0)}</span>
                {' '}entradas
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <span className="text-red-600 font-semibold">{formatCurrency(forecast?.forecast?.expenses ?? 0)}</span>
                {' '}saídas
              </p>
            </div>
          </div>
        </div>

        <CreditCardCarousel className="xl:hidden" onPaymentSuccess={fetchData} />

        {/* Card Agenda (Recorrências) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
              <Calendar size={24} />
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Agenda (7 dias)</span>
          </div>
          <div className="space-y-3">
            {agendaItems.length > 0 ? (
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
            {reminders.length > 0 ? (
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
          {chartData.length > 0 ? (
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
            {transactions.length > 0 ? (
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
                <button 
                  onClick={() => setShowCashDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Resumo no Modal */}
              {(() => {
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                
                const filtered = transactions.filter(t => {
                  const isCashType = t.type === 'income' || (t.type === 'expense' && ['cash', 'pix', 'debit'].includes(t.payment_method || ''));
                  const isPastOrPresent = new Date(t.transaction_date) <= today;
                  return isCashType && isPastOrPresent;
                });

                const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
                const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
                const currentBalance = totalIncome - totalExpense;

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-xl border border-green-100/50 dark:border-green-900/30">
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Total Receitas</p>
                        <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 truncate">
                          {formatCurrency(totalIncome)}
                        </p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-100/50 dark:border-red-900/30">
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Total Saídas</p>
                        <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 truncate">
                          {formatCurrency(totalExpense)}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/30 col-span-2 sm:col-span-1">
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Saldo Atual</p>
                        <p className={clsx(
                          "text-base sm:text-lg font-bold truncate",
                          currentBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                        )}>{formatCurrency(currentBalance)}</p>
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
                                      {t.payment_method === 'pix' ? 'Pix' : t.payment_method === 'debit' ? 'Débito' : 'Dinheiro'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(t.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
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
    </div>
  );
}