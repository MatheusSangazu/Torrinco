import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, X, CreditCard, ChevronLeft, ChevronRight, Calendar, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { cardsService, type CreditCard as CreditCardType } from '../services/cards.service';
import { installmentsService } from '../services/installments.service';
import { clsx } from 'clsx';
import { Select } from '../components/Select';
import { CustomSelect } from '../components/CustomSelect';
import { CategorySelect } from '../components/CategorySelect';
import { Input } from '../components/Input';
import { DatePicker } from '../components/DatePicker';
import { DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  type: string;
  color: string;
}

interface IncomeSource {
  id: number;
  name: string;
  color: string;
}

interface Transaction {
  id: number | string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  category_id?: number;
  categories?: Category;
  income_source_id?: number;
  income_sources?: {
    id: number;
    name: string;
    color: string;
  };
  entity_id?: number;
  financial_entities?: {
    id: number;
    name: string;
    number: string;
  };
  description: string;
  transaction_date: string | Date;
  status: string;
  payment_method?: string;
  is_recurring?: boolean;
  recurring_transaction_id?: number;
  is_projected?: boolean;
  installment_number?: number;
  purchase_installments?: {
    installment_count: number;
  };
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; transaction: Transaction | null }>({ open: false, transaction: null });
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number | string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Form State
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    category_id: '',
    income_source_id: '',
    entity_id: '',
    date: formatDate(new Date()),
    status: 'paid',
    payment_method: 'pix',
    isInstallment: false,
    installmentCount: '',
    isRecurring: false,
    updateSeries: false
  });

  useEffect(() => {
    fetchTransactions();
  }, [currentDate]);

  useEffect(() => {
    setShowBulkActions(selectedTransactions.size > 0);
  }, [selectedTransactions]);

  useEffect(() => {
    fetchCategories();
    fetchIncomeSources();
    fetchCreditCards();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const fetchIncomeSources = async () => {
    try {
      const response = await api.get('/income-sources');
      setIncomeSources(response.data.income_sources);
    } catch (error) {
      console.error('Erro ao buscar fontes de receita:', error);
      toast.error('Erro ao carregar fontes de receita');
    }
  };

  const fetchCreditCards = async () => {
    try {
      const data = await cardsService.list();
      setCreditCards(data);
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
      toast.error('Erro ao carregar cartões');
    }
  };

  const fetchTransactions = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const response = await api.get('/finance/transactions', {
        params: {
          start_date: formatDate(firstDay),
          end_date: formatDate(lastDay)
        }
      });
      setTransactions(response.data.transactions);
      clearSelection();
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar transações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if we should create a NEW recurring series
      // This happens if:
      // 1. We are creating a new transaction AND it is marked as recurring
      // 2. We are editing a transaction that was NOT recurring, and now it is marked as recurring
      const shouldCreateRecurringSeries = formData.isRecurring && (!editingTransaction || !editingTransaction.is_recurring);

      if (shouldCreateRecurringSeries) {
        // Prepare the base amount
        const rawAmount = formData.amount.toString().replace(',', '.');
        const finalAmount = parseFloat(rawAmount);

        if (isNaN(finalAmount)) {
          toast.error('Valor inválido');
          return;
        }

        const payload = {
          description: formData.description,
          amount: finalAmount,
          type: formData.type,
          category: formData.category,
          category_id: formData.category_id ? Number(formData.category_id) : null,
          income_source_id: formData.income_source_id ? Number(formData.income_source_id) : null,
          entity_id: formData.entity_id ? Number(formData.entity_id) : null,
          start_date: formData.date,
          status: 'active',
          frequency: 'monthly',
          payment_method: formData.payment_method
        };

        await api.post('/recurring', payload);

        setIsModalOpen(false);
        resetForm();
        fetchTransactions();
        toast.success('Transação recorrente criada com sucesso!');
        return;
      }

      const rawAmount = formData.amount.toString().replace(',', '.');
      const finalAmount = parseFloat(rawAmount);

      const commonPayload = {
        description: formData.description,
        amount: finalAmount,
        type: formData.type,
        category: formData.category,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        income_source_id: formData.income_source_id ? Number(formData.income_source_id) : undefined,
        entity_id: formData.entity_id ? Number(formData.entity_id) : undefined,
        status: formData.status,
        payment_method: formData.payment_method,
        is_recurring: formData.isRecurring
      };

      if (formData.isInstallment && formData.type === 'expense' && formData.payment_method === 'credit') {
        if (!formData.entity_id) {
          toast.error('Selecione um cartão para o parcelamento');
          return;
        }

        const payload = {
          entity_id: Number(formData.entity_id),
          description: formData.description,
          amount: finalAmount,
          installment_count: parseInt(formData.installmentCount),
          start_date: formData.date,
          category: formData.category,
          category_id: formData.category_id ? Number(formData.category_id) : undefined
        };

        await installmentsService.create(payload);
      } else {
        const payload = {
          ...commonPayload,
          transaction_date: formData.date
        };

        if (editingTransaction) {
          // If it's a projected recurring transaction (virtual), we need to create it as a real one first
          if (typeof editingTransaction.id === 'string' && editingTransaction.id.startsWith('rec-')) {
            const recurringId = editingTransaction.id.split('-')[1];
            
            // If user wants to update the entire series
            if (formData.updateSeries) {
              await api.put(`/recurring/${recurringId}`, payload);
              toast.success('Série recorrente atualizada!');
            } else {
              await api.post('/finance/transactions', payload);
            }
          } else {
            await api.put(`/finance/transactions/${editingTransaction.id}`, payload);
            
            // If it's a recurring transaction and user wants to update the series too
            if (editingTransaction.is_recurring && formData.updateSeries && editingTransaction.recurring_transaction_id) {
              await api.put(`/recurring/${editingTransaction.recurring_transaction_id}`, payload);
              toast.success('Transação e série atualizadas!');
            }
          }
        } else {
          await api.post('/finance/transactions', payload);
        }
      }

      setIsModalOpen(false);
      resetForm();
      fetchTransactions();
      toast.success('Transação salva com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao salvar transação. Verifique os dados.';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (deleteType: 'single' | 'all' = 'single') => {
    if (!deleteDialog.transaction) return;
    
    try {
      const isProjected = typeof deleteDialog.transaction.id === 'string' && deleteDialog.transaction.id.startsWith('rec-');
      
      await api.delete(`/finance/transactions/${deleteDialog.transaction.id}`, {
        params: {
          delete_type: deleteType,
          is_projected: isProjected,
          date: deleteDialog.transaction.transaction_date // Enviar data para saber qual ocorrência cancelar
        }
      });
      
      fetchTransactions();
      setDeleteDialog({ open: false, transaction: null });
      toast.success('Transação excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao excluir transação.';
      toast.error(errorMessage);
    }
  };

  const toggleTransactionSelection = (transactionId: number | string) => {
    setSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredTransactions.map(t => t.id);
    if (filteredIds.length === selectedTransactions.size && filteredIds.every(id => selectedTransactions.has(id))) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(filteredIds));
    }
  };

  const clearSelection = () => {
    setSelectedTransactions(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = async () => {
    if (selectedTransactions.size === 0) return;

    try {
      for (const id of selectedTransactions) {
        await api.delete(`/finance/transactions/${id}`);
      }
      
      fetchTransactions();
      clearSelection();
      toast.success(`${selectedTransactions.size} transação(ões) excluída(s) com sucesso!`);
    } catch (error: any) {
      console.error('Erro ao excluir em massa:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao excluir transações.';
      toast.error(errorMessage);
    }
  };

  const openEditModal = (transaction: any) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description || '',
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category || '',
      category_id: transaction.category_id ? transaction.category_id.toString() : '',
      income_source_id: transaction.income_source_id ? transaction.income_source_id.toString() : '',
      entity_id: transaction.entity_id ? transaction.entity_id.toString() : '',
      date: formatDate(new Date(transaction.transaction_date)),
      status: transaction.status,
      payment_method: transaction.payment_method || 'pix',
      isInstallment: false,
      installmentCount: '',
      isRecurring: transaction.is_recurring || false,
      updateSeries: false
    });
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingTransaction(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      category_id: '',
      income_source_id: '',
      entity_id: '',
      date: formatDate(new Date()),
      status: 'paid',
      payment_method: 'pix',
      isInstallment: false,
      installmentCount: '',
      isRecurring: false,
      updateSeries: false
    });
  };

  const filteredTransactions = transactions.filter(t => {
    const categoryName = t.categories?.name || t.category || '';
    const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentMonthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const currentMonthName = currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1);
  const currentMonthParts = currentMonthName.split(' ');
  const monthName = currentMonthParts[0];
  const yearName = currentMonthParts.slice(1).join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Finanças</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Gerencie suas receitas e despesas</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={openNewModal}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-xl transition-colors font-medium shadow-sm w-full sm:w-auto text-sm"
            >
              <Plus size={16} className="mr-1.5" />
              <span className="hidden sm:inline">Nova Transação</span>
              <span className="inline sm:hidden">Nova</span>
            </button>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-600 dark:text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar size={16} className="text-torrinco-600 dark:text-torrinco-400 shrink-0" />
            <div className="text-center leading-tight">
              <div className="text-sm sm:text-base font-bold text-gray-800 dark:text-white capitalize">
                {monthName}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                {yearName}
              </div>
            </div>
          </div>

          <button 
            onClick={handleNextMonth}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-600 dark:text-slate-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setTypeFilter('all')}
            className={clsx(
              "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border",
              typeFilter === 'all' 
                ? "bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white" 
                : "border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
          >
            Todas
          </button>
          <button 
            onClick={() => setTypeFilter('income')}
            className={clsx(
              "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border",
              typeFilter === 'income' 
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400" 
                : "border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
          >
            Receitas
          </button>
          <button 
            onClick={() => setTypeFilter('expense')}
            className={clsx(
              "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border",
              typeFilter === 'expense' 
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" 
                : "border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
          >
            Despesas
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-slate-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-2 sm:gap-4 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="font-medium text-xs sm:text-sm">
              {selectedTransactions.size} selecionada(s)
            </span>
          </div>
          <div className="h-px sm:h-6 w-full sm:w-px bg-gray-700"></div>
          <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
            <button
              onClick={toggleSelectAll}
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors"
            >
              {filteredTransactions.length === selectedTransactions.size ? 'Desmarcar' : 'Todas'}
            </button>
            <button
              onClick={clearSelection}
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Excluir selecionadas</span>
              <span className="inline sm:hidden">Excluir</span>
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">Carregando...</div>
        ) : filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className={clsx(
                "p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between group gap-3 sm:gap-0",
                selectedTransactions.has(transaction.id) && "bg-blue-50 dark:bg-blue-900/10"
              )}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.has(transaction.id)}
                    onChange={() => toggleTransactionSelection(transaction.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-torrinco-600 rounded border-gray-300 focus:ring-torrinco-500 cursor-pointer shrink-0"
                  />
                  <div className={clsx(
                    "p-2 sm:p-3 rounded-xl shrink-0",
                    transaction.type === 'income' 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  )}>
                    {transaction.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate pr-2">
                      {transaction.description}
                      {transaction.installment_number && transaction.purchase_installments && (
                         <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                           {transaction.installment_number}/{transaction.purchase_installments.installment_count}
                         </span>
                      )}
                      {transaction.is_recurring && (
                         <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                           Recorrente
                         </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-slate-400 flex-wrap">
                      <span 
                        className={clsx(
                          "px-1.5 sm:px-2 py-0.5 rounded text-xs uppercase tracking-wide font-medium shrink-0",
                          !transaction.categories && "bg-gray-100 dark:bg-slate-700"
                        )}
                        style={transaction.categories?.color ? {
                          backgroundColor: `${transaction.categories.color}20`,
                          color: transaction.categories.color,
                          borderColor: `${transaction.categories.color}40`,
                          borderWidth: '1px'
                        } : undefined}
                      >
                        {transaction.categories?.name || transaction.category}
                      </span>
                      {transaction.financial_entities && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <CreditCard size={10} />
                            <span className="hidden sm:inline">{transaction.financial_entities.name}</span>
                            <span className="inline sm:hidden">{transaction.financial_entities.name.slice(0, 12)}</span>
                          </span>
                        </>
                      )}
                      {transaction.purchase_installments && (
                         <>
                           <span className="hidden sm:inline">•</span>
                           <span className="flex items-center gap-1 shrink-0 text-xs">
                             <span className="hidden sm:inline">Parcela</span>
                             <span className="inline">P.</span> {transaction.installment_number} de {transaction.purchase_installments.installment_count}
                           </span>
                         </>
                      )}
                      <span className="hidden sm:inline">•</span>
                      <span className="shrink-0 text-xs">{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pl-14 sm:pl-0">
                  <span className={clsx(
                    "font-bold text-base sm:text-lg",
                    transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                  )}>
                    {transaction.type === 'expense' ? '- ' : '+ '}
                    {formatCurrency(transaction.amount)}
                  </span>
                  
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(transaction)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => setDeleteDialog({ open: true, transaction })}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 mb-4 text-gray-400 dark:text-slate-500">
              <Filter size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma transação encontrada</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Tente ajustar os filtros ou adicione uma nova transação.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200 my-8">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income', category_id: '', category: ''})}
                  className={clsx(
                    "py-2 rounded-xl text-sm font-bold transition-all border-2",
                    formData.type === 'income'
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-green-200"
                  )}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense', category_id: '', category: ''})}
                  className={clsx(
                    "py-2 rounded-xl text-sm font-bold transition-all border-2",
                    formData.type === 'expense'
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-red-200"
                  )}
                >
                  Despesa
                </button>
              </div>

              <Input
                label="Valor"
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                className="font-bold text-lg py-3"
              />

              <CategorySelect
                label="Categoria"
                value={formData.category_id}
                options={categories.filter(c => c.type === formData.type)}
                onChange={(selectedId) => {
                  const category = categories.find(c => c.id.toString() === selectedId);
                  setFormData({
                    ...formData, 
                    category_id: selectedId,
                    category: category ? category.name : ''
                  });
                }}
                placeholder="Selecione..."
                required
              />

              <div className="space-y-4">
                <Input
                  label="Descrição"
                  type="text"
                  required
                  placeholder="Ex: Supermercado, Salário..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />

                <DatePicker
                  label="Data"
                  required
                  value={formData.date}
                  onChange={(date) => setFormData({...formData, date})}
                />
              </div>

              {formData.type === 'expense' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Forma de Pagamento</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment_method: 'pix', entity_id: ''})}
                      className={clsx(
                        "py-2 rounded-xl text-sm font-bold transition-all border-2",
                        formData.payment_method === 'pix'
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-green-200"
                      )}
                    >
                      Pix
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment_method: 'cash', entity_id: ''})}
                      className={clsx(
                        "py-2 rounded-xl text-sm font-bold transition-all border-2",
                        formData.payment_method === 'cash'
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-200"
                      )}
                    >
                      Dinheiro
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment_method: 'credit', entity_id: ''})}
                      className={clsx(
                        "py-2 rounded-xl text-sm font-bold transition-all border-2",
                        formData.payment_method === 'credit'
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-purple-200"
                      )}
                    >
                      Crédito
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment_method: 'debit', entity_id: ''})}
                      className={clsx(
                        "py-2 rounded-xl text-sm font-bold transition-all border-2",
                        formData.payment_method === 'debit'
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-orange-200"
                      )}
                    >
                      Débito
                    </button>
                  </div>
                </div>
              )}

              {formData.payment_method === 'credit' && formData.type === 'expense' && (
                <div>
                  {creditCards.length > 0 ? (
                    <CustomSelect
                      label="Cartão de Crédito"
                      value={formData.entity_id}
                      onChange={(value) => setFormData({...formData, entity_id: value as string})}
                      options={[
                        { value: '', label: 'Selecione o cartão' },
                        ...creditCards.map(card => ({ value: card.id.toString(), label: card.name }))
                      ]}
                      required
                    />
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-slate-400 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      Nenhum cartão de crédito cadastrado. Vá em "Cartões" para criar um primeiro.
                    </div>
                  )}

                  {!formData.isRecurring && (
                    <div className="flex items-center gap-2 mt-3 bg-gray-50 dark:bg-slate-700/30 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                      <input
                        type="checkbox"
                        id="isInstallment"
                        checked={formData.isInstallment}
                        onChange={(e) => setFormData({...formData, isInstallment: e.target.checked, isRecurring: false})}
                        className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="isInstallment" className="text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer select-none">
                        É uma compra parcelada?
                        <span className="block text-xs text-gray-500 font-normal">
                          Parcele suas compras no cartão de crédito
                        </span>
                      </label>
                    </div>
                  )}

                  {formData.isInstallment && (
                    <Input
                      label="Número de Parcelas"
                      type="number"
                      min="1"
                      max="120"
                      required
                      placeholder="1"
                      value={formData.installmentCount}
                      onChange={(e) => setFormData({...formData, installmentCount: e.target.value})}
                      className="mt-3"
                    />
                  )}

                  {formData.isInstallment && formData.amount && formData.installmentCount && (
                    <div className="mt-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-gray-600 dark:text-slate-300 text-center">
                        Valor de cada parcela:{' '}
                        <span className="font-bold text-purple-700 dark:text-purple-400">
                          {formatCurrency(parseFloat(formData.amount.replace(',', '.')) / parseInt(formData.installmentCount))}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Recurring Toggle - Show only if not installment */}
              {!formData.isInstallment && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700/30 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                      className="w-5 h-5 text-torrinco-600 rounded border-gray-300 focus:ring-torrinco-500"
                    />
                    <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer select-none">
                      Esta é uma transação recorrente?
                      <span className="block text-xs text-gray-500 font-normal">
                        {formData.type === 'income' ? 'Ex: Salário, Aluguel recebido' : 'Ex: Assinatura, Aluguel, Conta de Luz'}
                      </span>
                    </label>
                  </div>

                  {(editingTransaction?.is_recurring || (typeof editingTransaction?.id === 'string' && editingTransaction?.id.startsWith('rec-'))) && (
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800 animate-in slide-in-from-top-2 duration-300">
                      <input
                        type="checkbox"
                        id="updateSeries"
                        checked={formData.updateSeries}
                        onChange={(e) => setFormData({...formData, updateSeries: e.target.checked})}
                        className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                      />
                      <label htmlFor="updateSeries" className="text-sm font-medium text-amber-800 dark:text-amber-300 cursor-pointer select-none">
                        Atualizar toda a série futura?
                        <span className="block text-xs text-amber-600/70 dark:text-amber-400/70 font-normal">
                          Isso mudará todas as próximas ocorrências desta transação.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-torrinco-600 hover:bg-torrinco-700 text-white font-bold rounded-xl shadow-lg shadow-torrinco-600/20 transition-all active:scale-[0.98]"
                >
                  {editingTransaction ? 'Salvar Alterações' : 'Adicionar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && deleteDialog.transaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Excluir transação?
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
                {deleteDialog.transaction.description}
              </p>
              <p className="text-gray-600 dark:text-slate-300 font-bold text-lg mb-6">
                {deleteDialog.transaction.type === 'expense' ? '- ' : '+ '}
                {formatCurrency(deleteDialog.transaction.amount)}
              </p>

              {(deleteDialog.transaction.is_recurring || (typeof deleteDialog.transaction.id === 'string' && deleteDialog.transaction.id.startsWith('rec-'))) ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                    Esta é uma transação recorrente. O que deseja excluir?
                  </p>
                  <button
                    onClick={() => handleDelete('single')}
                    className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold rounded-xl transition-colors"
                  >
                    Apenas esta ocorrência
                  </button>
                  <button
                    onClick={() => handleDelete('all')}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                  >
                    Todas as futuras
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: false, transaction: null })}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition-colors mt-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : deleteDialog.transaction.installment_number || (deleteDialog.transaction.purchase_installments && deleteDialog.transaction.purchase_installments.installment_count > 1) ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                    Esta é uma compra parcelada. O que deseja excluir?
                  </p>
                  <button
                    onClick={() => handleDelete('single')}
                    className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold rounded-xl transition-colors"
                  >
                    Apenas esta parcela
                  </button>
                  <button
                    onClick={() => handleDelete('all')}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                  >
                    Todas as parcelas
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: false, transaction: null })}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition-colors mt-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteDialog({ open: false, transaction: null })}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete('single')}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}