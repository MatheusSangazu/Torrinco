import { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, DollarSign, BarChart3, List, Download, MessageCircle, Loader2 } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { api } from '../services/api';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { CustomSelect } from '../components/CustomSelect';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  transaction_date: string;
  status?: 'paid' | 'pending';
  categories?: {
    name: string;
    color: string;
  };
}

interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-3 border border-gray-100 dark:border-slate-600">
        <p className="text-sm font-medium text-gray-700 dark:text-white">{payload[0].payload.category}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenseChartType, setExpenseChartType] = useState<'list' | 'pie' | 'bar'>('list');
  const [incomeChartType, setIncomeChartType] = useState<'list' | 'pie' | 'bar'>('list');
  const [exporting, setExporting] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');

  useEffect(() => {
    console.log('useEffect em Reports - Buscando transações...');
    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
      
      const response = await api.get('/finance/transactions', {
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      });
      console.log('Transações recebidas do backend:', response.data.transactions);
      // Garantir que amount seja número (vem como string do backend se for Decimal)
      const transactionsData = response.data.transactions.map((t: any) => ({
        ...t,
        amount: Number(t.amount)
      }));
      console.log('Transações processadas:', transactionsData);
      setTransactions(transactionsData);
      console.log('Transações definidas no estado:', transactionsData.length);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Transações no estado mudou:', transactions.length);
  }, [transactions]);

  const getFilteredTransactions = () => {
    console.log('Filtrando transações - Total:', transactions.length, 'Mês:', selectedMonth, 'Ano:', selectedYear);
    const filtered = transactions.filter(t => {
      const date = new Date(t.transaction_date);
      const matchesDate = date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory || t.categories?.name === filterCategory;
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
      
      
      return matchesDate && matchesType && matchesCategory && matchesStatus;
    });
    console.log('Filtrado:', filtered.length);
    return filtered;
  };

  const calculateFinancials = () => {
    const filtered = getFilteredTransactions();
    const income = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const calculateCategoryExpenses = (): CategorySummary[] => {
    const filtered = getFilteredTransactions().filter(t => t.type === 'expense');
    const totalExpense = filtered.reduce((acc, t) => acc + t.amount, 0);
    
    if (totalExpense === 0) return [];

    const expensesMap: Record<string, { amount: number; color: string }> = {};
    
    filtered.forEach(t => {
      const categoryName = t.categories?.name || t.category || 'Outros';
      const categoryColor = t.categories?.color;
      
      if (!expensesMap[categoryName]) {
        expensesMap[categoryName] = { amount: 0, color: categoryColor || '' };
      }
      
      expensesMap[categoryName].amount += t.amount;
      if (!expensesMap[categoryName].color && categoryColor) {
        expensesMap[categoryName].color = categoryColor;
      }
    });

    const defaultColors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', 
      '#84cc16', '#22c55e', '#10b981', '#14b8a6',
      '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
      '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
      '#f43f5e'
    ];

    return Object.entries(expensesMap)
      .map(([category, data], index) => ({
        category,
        amount: data.amount,
        percentage: (data.amount / totalExpense) * 100,
        color: data.color || defaultColors[index % defaultColors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const calculateCategoryIncome = (): CategorySummary[] => {
    const filtered = getFilteredTransactions().filter(t => t.type === 'income');
    const totalIncome = filtered.reduce((acc, t) => acc + t.amount, 0);
    
    if (totalIncome === 0) return [];

    const incomeMap: Record<string, { amount: number; color: string }> = {};
    
    filtered.forEach(t => {
      const categoryName = t.categories?.name || t.category || 'Outros';
      const categoryColor = t.categories?.color;
      
      if (!incomeMap[categoryName]) {
        incomeMap[categoryName] = { amount: 0, color: categoryColor || '' };
      }
      
      incomeMap[categoryName].amount += t.amount;
      if (!incomeMap[categoryName].color && categoryColor) {
        incomeMap[categoryName].color = categoryColor;
      }
    });

    const defaultColors = [
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
      '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
      '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
    ];

    return Object.entries(incomeMap)
      .map(([category, data], index) => ({
        category,
        amount: data.amount,
        percentage: (data.amount / totalIncome) * 100,
        color: data.color || defaultColors[index % defaultColors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const calculateExpensesByDayOfWeek = () => {
    const filtered = getFilteredTransactions().filter(t => t.type === 'expense');
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    const expensesByDay = Array(7).fill(null).map((_, day) => ({
      day: dayNames[day],
      amount: 0,
      dayIndex: day
    }));

    filtered.forEach(t => {
      const date = new Date(t.transaction_date);
      const dayOfWeek = date.getDay();
      expensesByDay[dayOfWeek].amount += t.amount;
    });

    return expensesByDay;
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
      
      const params: any = {
        start_date: startDate,
        end_date: endDate
      };
      
      if (filterType !== 'all') params.type = filterType;
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterStatus !== 'all') params.status = filterStatus;
      
      console.log('Exportando com params:', params, 'selectedMonth:', selectedMonth, 'selectedYear:', selectedYear);
      
      const response = await api.get('/export/excel', {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transacoes_torrinco_${startDate}_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Arquivo Excel exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      toast.error('Erro ao exportar arquivo Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      setSendingWhatsApp(true);
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
      
      const params: any = {
        start_date: startDate,
        end_date: endDate
      };
      
      if (filterType !== 'all') params.type = filterType;
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const response = await api.post('/export/whatsapp', params);

      if (response.data.success) {
        toast.success('Relatório enviado com sucesso para o seu WhatsApp!');
      } else {
        toast.error('Erro ao enviar relatório para WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast.error('Erro ao enviar relatório para WhatsApp');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const { income, expense, balance } = calculateFinancials();
  const categoryExpenses = calculateCategoryExpenses();
  const categoryIncome = calculateCategoryIncome();
  const expensesByDayOfWeek = calculateExpensesByDayOfWeek();
  
  // Simple Bar Chart Data (Last 6 months)
  const getLast6MonthsData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      
      const monthTrans = transactions.filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const inc = monthTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const exp = monthTrans.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

      data.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        income: inc,
        expense: exp
      });
    }
    return data;
  };

  const sixMonthsData = getLast6MonthsData();
  const maxBarValue = Math.max(...sixMonthsData.map(d => Math.max(d.income, d.expense)), 100);

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <PieChartIcon className="text-torrinco-600" />
            Relatórios Financeiros
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Análise detalhada das suas finanças</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CustomSelect
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(Number(value))}
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: i,
                  label: new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())
                }))}
                className="w-40"
                placeholder="Mês"
              />
              <CustomSelect
                value={selectedYear}
                onChange={(value) => setSelectedYear(Number(value))}
                options={[2024, 2025, 2026].map(y => ({ value: y, label: String(y) }))}
                className="w-32"
                placeholder="Ano"
              />
            </div>

            <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-torrinco-600 text-white rounded-xl shadow-sm hover:bg-torrinco-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {exporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Excel</span>
                </>
              )}
            </button>
            <button
              onClick={handleSendWhatsApp}
              disabled={sendingWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {sendingWhatsApp ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando dados...</div>
      ) : (
        <>
          {/* Additional Filters */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex flex-wrap gap-3 items-center">
              <CustomSelect
                value={filterType}
                onChange={(value) => setFilterType(value as 'all' | 'income' | 'expense')}
                options={[
                  { value: 'all', label: 'Todos os tipos' },
                  { value: 'income', label: 'Receitas' },
                  { value: 'expense', label: 'Despesas' }
                ]}
                className="w-48"
                placeholder="Tipo"
              />
              
              <CustomSelect
                value={filterCategory}
                onChange={(value) => setFilterCategory(value as string)}
                options={[
                  { value: 'all', label: 'Todas as categorias' },
                  ...Array.from(new Set(transactions.map(t => {
                    if (typeof t.category === 'string') return t.category;
                    return t.categories?.name || '';
                  }).filter(Boolean))).sort().map(cat => ({
                    value: cat,
                    label: cat
                  }))
                ]}
                className="w-56"
                placeholder="Categoria"
              />
              
              <CustomSelect
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as 'all' | 'paid' | 'pending')}
                options={[
                  { value: 'all', label: 'Todos os status' },
                  { value: 'paid', label: 'Pago' },
                  { value: 'pending', label: 'Pendente' }
                ]}
                className="w-48"
                placeholder="Status"
              />

              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Receitas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(income)}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                  <TrendingDown size={20} />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Despesas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(expense)}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className={clsx(
                  "p-2 rounded-lg",
                  balance >= 0 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" 
                    : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                )}>
                  <DollarSign size={20} />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Balanço</span>
              </div>
              <p className={clsx(
                "text-2xl font-bold",
                balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
              )}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Despesas por Categoria</h3>
                <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setExpenseChartType('list')}
                    className={clsx(
                      "p-1.5 rounded-md transition-colors",
                      expenseChartType === 'list' 
                        ? "bg-white dark:bg-slate-600 text-torrinco-600 shadow-sm" 
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                    )}
                    title="Lista"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setExpenseChartType('pie')}
                    className={clsx(
                      "p-1.5 rounded-md transition-colors",
                      expenseChartType === 'pie' 
                        ? "bg-white dark:bg-slate-600 text-torrinco-600 shadow-sm" 
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                    )}
                    title="Gráfico de Pizza"
                  >
                    <PieChartIcon size={16} />
                  </button>
                  <button
                    onClick={() => setExpenseChartType('bar')}
                    className={clsx(
                      "p-1.5 rounded-md transition-colors",
                      expenseChartType === 'bar' 
                        ? "bg-white dark:bg-slate-600 text-torrinco-600 shadow-sm" 
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                    )}
                    title="Gráfico de Barras"
                  >
                    <BarChart3 size={16} />
                  </button>
                </div>
              </div>
              
              {categoryExpenses.length > 0 ? (
                <div className="min-h-[300px]">
                  {expenseChartType === 'list' && (
                    <div className="space-y-4">
                      {categoryExpenses.map((cat) => (
                        <div key={cat.category} className="group">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-slate-300">{cat.category}</span>
                            <div className="text-right">
                              <span className="font-bold text-gray-900 dark:text-white mr-2">{formatCurrency(cat.amount)}</span>
                              <span className="text-gray-500 text-xs">({cat.percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="h-2.5 rounded-full transition-all duration-500" 
                              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {expenseChartType === 'pie' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={categoryExpenses}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
                            const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);
                            const p = percent || 0;
                            // Mostrar label se for maior que 5% para evitar poluição visual
                            const shouldShow = p > 0.05;
                            
                            return shouldShow ? (
                              <text 
                                x={x} 
                                y={y} 
                                fill="white" 
                                textAnchor="middle" 
                                dominantBaseline="central" 
                                fontSize={12}
                                fontWeight="bold"
                                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
                              >
                                {`${(p * 100).toFixed(0)}%`}
                              </text>
                            ) : null;
                          }}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="amount"
                          nameKey="category"
                        >
                          {categoryExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ fontSize: '12px' }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}

                  {expenseChartType === 'bar' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryExpenses} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                          labelFormatter={(label) => label}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                          dataKey="amount" 
                          radius={[0, 4, 4, 0]} 
                          barSize={20}
                          fill={categoryExpenses[0]?.color || '#ef4444'}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm">
                  Nenhuma despesa registrada neste mês.
                </div>
              )}
            </div>

            {/* Monthly Evolution Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Evolução Semestral</h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-64 pb-2">
                {sixMonthsData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded p-2 pointer-events-none z-10 w-max">
                      <div className="text-green-300">Rec: {formatCurrency(data.income)}</div>
                      <div className="text-red-300">Des: {formatCurrency(data.expense)}</div>
                    </div>
                    
                    <div className="w-full flex justify-center items-end gap-1 h-full">
                      <div 
                        className="w-3 sm:w-6 bg-green-500 rounded-t-sm transition-all duration-500 hover:bg-green-400"
                        style={{ height: `${(data.income / maxBarValue) * 100}%` }}
                      ></div>
                      <div 
                        className="w-3 sm:w-6 bg-red-500 rounded-t-sm transition-all duration-500 hover:bg-red-400"
                        style={{ height: `${(data.expense / maxBarValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income by Category */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Receitas por Categoria</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIncomeChartType('list')}
                    className={clsx(
                      'p-2 rounded-lg transition-all',
                      incomeChartType === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setIncomeChartType('pie')}
                    className={clsx(
                      'p-2 rounded-lg transition-all',
                      incomeChartType === 'pie' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    <PieChartIcon size={16} />
                  </button>
                  <button
                    onClick={() => setIncomeChartType('bar')}
                    className={clsx(
                      'p-2 rounded-lg transition-all',
                      incomeChartType === 'bar' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    <BarChart3 size={16} />
                  </button>
                </div>
              </div>

              {categoryIncome.length > 0 ? (
                <div>
                  {incomeChartType === 'list' && (
                    <div className="space-y-4">
                      {categoryIncome.map((cat) => (
                        <div key={cat.category} className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-white truncate">{cat.category}</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(cat.amount)}</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="h-2.5 rounded-full transition-all duration-500" 
                                style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {incomeChartType === 'pie' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={categoryIncome}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
                            const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);
                            const p = percent || 0;
                            const shouldShow = p > 0.05;
                            
                            return shouldShow ? (
                              <text 
                                x={x} 
                                y={y} 
                                fill="white" 
                                textAnchor="middle" 
                                dominantBaseline="central" 
                                fontSize={12}
                                fontWeight="bold"
                                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
                              >
                                {`${(p * 100).toFixed(0)}%`}
                              </text>
                            ) : null;
                          }}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="amount"
                          nameKey="category"
                        >
                          {categoryIncome.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ fontSize: '12px' }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
  
                  {incomeChartType === 'bar' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryIncome} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                          dataKey="amount" 
                          radius={[0, 4, 4, 0]} 
                          barSize={20}
                          fill={categoryIncome[0]?.color || '#22c55e'}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm">
                  Nenhuma receita registrada neste mês.
                </div>
              )}
            </div>

            {/* Expenses by Day of Week */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <TrendingDown className="text-red-600" size={24} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Despesas por Dia da Semana</h3>
              </div>

              {expensesByDayOfWeek.some(d => d.amount > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expensesByDayOfWeek} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={30} fill="#ef4444">
                      {expensesByDayOfWeek.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.amount === Math.max(...expensesByDayOfWeek.map(d => d.amount)) ? '#ef4444' : '#f87171'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm">
                  Nenhuma despesa registrada neste mês.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}