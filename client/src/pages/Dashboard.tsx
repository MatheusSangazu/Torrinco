import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Music, Fuel, TrendingUp, Utensils, AlertCircle, Clock, TrendingDown, BarChart3, Bell, CheckCircle2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../services/api';
import { remindersService, type Reminder } from '../services/reminders.service';
import { CreditCardCarousel } from '../components/CreditCardCarousel';
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
    };
  };
}

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Calculate date range for next 7 days
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = nextWeek.toISOString().split('T')[0];

        // Calculate date range for last 6 months (chart)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const startDateChart = sixMonthsAgo.toISOString().split('T')[0];

        const [summaryRes, transactionsRes, dueRes, eventsRes, forecastRes, chartRes] = await Promise.all([
          api.get(`/finance/summary?period=${period}`),
          api.get(`/finance/transactions?end_date=${endDateStr}`),
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

    fetchData();
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'ASSINATURA': return Music;
      case 'TRANSPORTE': return Fuel;
      case 'ALIMENTAÇÃO': return Utensils;
      case 'VENDAS': return TrendingUp;
      default: return MoreHorizontal;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card Saldo em Dinheiro */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            LIVE
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
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
              <p className="text-xs text-gray-400">
                Descontando: <span className="font-medium">dinheiro, pix e débito</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card Previsão do Próximo Mês */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
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
              {forecast ? formatCurrency(forecast.forecast.balance || 0) : 'R$ 0,00'}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <span className="text-green-600 font-semibold">{forecast ? formatCurrency(forecast.forecast.income || 0) : 'R$ 0,00'}</span>
                {' '}entradas
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <span className="text-red-600 font-semibold">{forecast ? formatCurrency(forecast.forecast.expenses || 0) : 'R$ 0,00'}</span>
                {' '}saídas
              </p>
            </div>
          </div>
        </div>

        <CreditCardCarousel />

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

      {/* Gráfico de Evolução Financeira */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
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
                    <div className="text-right">
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
    </div>
  );
}
