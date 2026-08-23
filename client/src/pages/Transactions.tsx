import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, X, CreditCard, ChevronLeft, ChevronRight, Calendar, CheckCircle, FileUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { cardsService, type CreditCard as CreditCardType } from '../services/cards.service';
import { installmentsService } from '../services/installments.service';
import { clsx } from 'clsx';
import { CustomSelect } from '../components/CustomSelect';
import { CategorySelect } from '../components/CategorySelect';
import { Input } from '../components/Input';
import { DatePicker } from '../components/DatePicker';
import { Checkbox } from '../components/Checkbox';
import { DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../lib/api-error';
import { formatLocalDate, formatYearMonthLong } from '../lib/local-date';
import { useDialogFocus } from '../hooks/useDialogFocus';

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
  recurring_transactions?: {
    start_date?: string | Date;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    end_type?: 'occurrence_count' | 'end_date' | 'never';
    occurrence_count?: number | null;
    end_date?: string | Date | null;
  };
  is_projected?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  end_type?: 'occurrence_count' | 'end_date' | 'never';
  occurrence_count?: number | null;
  end_date?: string | Date | null;
  installment_number?: number;
  purchase_installments?: {
    installment_count: number;
  };
}

export function Transactions() {
  const recurringRequestKey = useRef(crypto.randomUUID());
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
  const [recurringConfirmationOpen, setRecurringConfirmationOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number | string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const transactionDialogRef = useDialogFocus<HTMLDivElement>(isModalOpen, () => setIsModalOpen(false));
  const recurringDialogRef = useDialogFocus<HTMLDivElement>(recurringConfirmationOpen, () => setRecurringConfirmationOpen(false));
  const deleteDialogRef = useDialogFocus<HTMLDivElement>(deleteDialog.open, () => setDeleteDialog({ open: false, transaction: null }));

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
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
    updateSeries: false,
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    recurrenceEndType: '' as '' | 'occurrence_count' | 'end_date' | 'never',
    occurrenceCount: '',
    recurrenceEndDate: ''
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

  const recurrenceStartDate = (() => {
    const value = editingTransaction?.recurring_transactions?.start_date;
    if (!value) return formData.date;
    const date = new Date(value);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  })();

  const validateRecurrence = () => {
    if (!formData.recurrenceEndType) {
      toast.error('Escolha como a recorrência termina.');
      return false;
    }
    if (formData.recurrenceEndType === 'occurrence_count') {
      const count = Number(formData.occurrenceCount);
      if (!Number.isInteger(count) || count <= 0) {
        toast.error('Informe um total de ocorrências maior que zero.');
        return false;
      }
    }
    if (formData.recurrenceEndType === 'end_date') {
      if (!formData.recurrenceEndDate) {
        toast.error('Informe a data final da recorrência.');
        return false;
      }
      if (formData.recurrenceEndDate < recurrenceStartDate) {
        toast.error('A data final deve ser igual ou posterior à primeira ocorrência.');
        return false;
      }
    }
    return true;
  };

  const saveTransaction = async (recurrenceConfirmed = false) => {
    try {
      // Check if we should create a NEW recurring series
      // This happens if:
      // 1. We are creating a new transaction AND it is marked as recurring
      // 2. We are editing a transaction that was NOT recurring, and now it is marked as recurring
      const shouldCreateRecurringSeries = formData.isRecurring && (!editingTransaction || !editingTransaction.is_recurring);
      const changesRecurringSeries = shouldCreateRecurringSeries || Boolean(formData.isRecurring && formData.updateSeries);

      if (formData.isRecurring && !validateRecurrence()) return;
      if (changesRecurringSeries && !recurrenceConfirmed) {
        setRecurringConfirmationOpen(true);
        return;
      }

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
          category: formData.category || undefined,
          category_id: formData.category_id ? Number(formData.category_id) : undefined,
          income_source_id: formData.income_source_id ? Number(formData.income_source_id) : undefined,
          entity_id: formData.entity_id ? Number(formData.entity_id) : undefined,
          idempotency_key: recurringRequestKey.current,
          start_date: formData.date,
          frequency: formData.frequency,
          end_type: formData.recurrenceEndType,
          occurrence_count: formData.recurrenceEndType === 'occurrence_count' ? Number(formData.occurrenceCount) : undefined,
          end_date: formData.recurrenceEndType === 'end_date' ? formData.recurrenceEndDate : undefined,
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
        category: formData.category || undefined,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        income_source_id: formData.income_source_id ? Number(formData.income_source_id) : undefined,
        entity_id: formData.entity_id ? Number(formData.entity_id) : undefined,
        status: formData.status,
        payment_method: formData.payment_method,
        is_recurring: formData.isRecurring
      };
      const recurringPayload = {
        description: formData.description,
        amount: finalAmount,
        category: formData.category || undefined,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        income_source_id: formData.income_source_id ? Number(formData.income_source_id) : null,
        entity_id: formData.entity_id ? Number(formData.entity_id) : null,
        payment_method: formData.payment_method,
        frequency: formData.frequency,
        end_type: formData.recurrenceEndType,
        occurrence_count: formData.recurrenceEndType === 'occurrence_count' ? Number(formData.occurrenceCount) : undefined,
        end_date: formData.recurrenceEndType === 'end_date' ? formData.recurrenceEndDate : undefined,
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
          category: formData.category || undefined,
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
              await api.put(`/recurring/${recurringId}`, recurringPayload);
              toast.success('Série recorrente atualizada!');
            } else {
              const materialized = await api.post(`/recurring/${recurringId}/generate`, {
                transaction_date: editingTransaction.transaction_date,
              });
              await api.put(`/finance/transactions/${materialized.data.transaction.id}`, payload);
            }
          } else {
            await api.put(`/finance/transactions/${editingTransaction.id}`, payload);
            
            // If it's a recurring transaction and user wants to update the series too
            if (editingTransaction.is_recurring && formData.updateSeries && editingTransaction.recurring_transaction_id) {
              await api.put(`/recurring/${editingTransaction.recurring_transaction_id}`, recurringPayload);
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
      const errorMessage = getApiErrorMessage(error, 'Não foi possível salvar a transação. Verifique os dados informados.');
      toast.error(errorMessage);
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    void saveTransaction(false);
  };

  const handleDelete = async (deleteType: 'single' | 'future' | 'all' = 'single') => {
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
      const errorMessage = getApiErrorMessage(error, 'Não foi possível excluir a transação.');
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
      const errorMessage = getApiErrorMessage(error, 'Não foi possível excluir as transações.');
      toast.error(errorMessage);
    }
  };

  const openEditModal = (transaction: any) => {
    setEditingTransaction(transaction);
    const date = new Date(transaction.transaction_date);
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    const series = transaction.recurring_transactions ?? transaction;
    const endDate = series.end_date ? new Date(series.end_date) : null;
    const endDateStr = endDate
      ? `${endDate.getUTCFullYear()}-${String(endDate.getUTCMonth() + 1).padStart(2, '0')}-${String(endDate.getUTCDate()).padStart(2, '0')}`
      : '';
    
    setFormData({
      description: transaction.description || '',
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category || '',
      category_id: transaction.category_id ? transaction.category_id.toString() : '',
      income_source_id: transaction.income_source_id ? transaction.income_source_id.toString() : '',
      entity_id: transaction.entity_id ? transaction.entity_id.toString() : '',
      date: dateStr,
      status: transaction.status,
      payment_method: transaction.payment_method || 'pix',
      isInstallment: false,
      installmentCount: '',
      isRecurring: transaction.is_recurring || false,
      updateSeries: false,
      frequency: series.frequency || 'monthly',
      recurrenceEndType: transaction.is_recurring ? (series.end_type || 'never') : '',
      occurrenceCount: series.occurrence_count ? String(series.occurrence_count) : '',
      recurrenceEndDate: endDateStr
    });
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingTransaction(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    recurringRequestKey.current = crypto.randomUUID();
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      category_id: '',
      income_source_id: '',
      entity_id: '',
      date: dateStr,
      status: 'paid',
      payment_method: 'pix',
      isInstallment: false,
      installmentCount: '',
      isRecurring: false,
      updateSeries: false,
      frequency: 'monthly',
      recurrenceEndType: '',
      occurrenceCount: '',
      recurrenceEndDate: ''
    });
  };

  const recurrencePreview = (() => {
    if (!formData.isRecurring || !formData.recurrenceEndType) return '';
    if (formData.recurrenceEndType === 'never') {
      return 'O lançamento continuará sendo projetado enquanto a recorrência estiver ativa.';
    }
    if (formData.recurrenceEndType === 'end_date') {
      return formData.recurrenceEndDate
        ? `A última ocorrência válida será a programada até ${formatDisplayDate(formData.recurrenceEndDate)}.`
        : 'Escolha a data limite da recorrência.';
    }

    const count = Number(formData.occurrenceCount);
    if (!Number.isInteger(count) || count <= 0) return 'Informe o total de ocorrências, incluindo a primeira.';
    if (!recurrenceStartDate) return 'Informe a primeira ocorrência.';
    const start = new Date(`${recurrenceStartDate}T12:00:00Z`);
    const anchorDay = start.getUTCDate();
    const last = new Date(start);
    if (formData.frequency === 'daily') last.setUTCDate(last.getUTCDate() + count - 1);
    if (formData.frequency === 'weekly') last.setUTCDate(last.getUTCDate() + (count - 1) * 7);
    if (formData.frequency === 'monthly' || formData.frequency === 'yearly') {
      const monthOffset = formData.frequency === 'monthly' ? count - 1 : (count - 1) * 12;
      const targetMonth = start.getUTCMonth() + monthOffset;
      const year = start.getUTCFullYear() + Math.floor(targetMonth / 12);
      const month = ((targetMonth % 12) + 12) % 12;
      const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      last.setUTCFullYear(year, month, Math.min(anchorDay, lastDay));
    }
    return `Serão criadas/projetadas ${count} cobranças, incluindo a primeira, de ${formatDisplayDate(start)} a ${formatDisplayDate(last)}.`;
  })();

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

  const currentMonthLabel = formatYearMonthLong(formatLocalDate(currentDate).slice(0,7));
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
            <Link to="/imports" className="flex items-center justify-center rounded-xl border border-torrinco-600 px-3 py-2 text-sm font-medium text-torrinco-600">
              <FileUp size={16} className="mr-1.5" /> Importar
            </Link>
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
        <div className="app-floating-action fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-slate-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-2 sm:gap-4 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-lg">
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
                  <Checkbox
                    aria-label={`Selecionar ${transaction.description}`}
                    checked={selectedTransactions.has(transaction.id)}
                    onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                    onClick={(e) => e.stopPropagation()}
                    containerClassName="shrink-0"
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
                      <span className="shrink-0 text-xs">{formatDisplayDate(transaction.transaction_date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 w-full sm:w-auto pl-12 sm:pl-0">
                  <span className={clsx(
                    "font-bold text-base sm:text-lg shrink-0",
                    transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                  )}>
                    {transaction.type === 'expense' ? '- ' : '+ '}
                    {formatCurrency(transaction.amount)}
                  </span>
                  
                  <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
        <div className="app-scroll-lock app-dialog-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div ref={transactionDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={editingTransaction ? 'Editar transação' : 'Nova transação'} className="app-dialog-surface bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                aria-label="Fechar formulário da transação"
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

              {formData.type === 'income' && (
                <CategorySelect
                  label="Fonte da receita"
                  value={formData.income_source_id}
                  options={incomeSources}
                  onChange={(selectedId) => setFormData({ ...formData, income_source_id: selectedId })}
                  placeholder="Selecione uma fonte (opcional)"
                />
              )}

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
                      searchable
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
                    <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-700/30">
                      <Checkbox
                        id="isInstallment"
                        checked={formData.isInstallment}
                        onCheckedChange={(checked) => setFormData({...formData, isInstallment: checked, isRecurring: false})}
                        label="É uma compra parcelada?"
                        description="Parcele suas compras no cartão de crédito"
                      />
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
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-700/30">
                    <Checkbox
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        isRecurring: checked,
                        recurrenceEndType: checked ? formData.recurrenceEndType : '',
                        occurrenceCount: checked ? formData.occurrenceCount : '',
                        recurrenceEndDate: checked ? formData.recurrenceEndDate : '',
                      })}
                      label="Repetir lançamento"
                      description={formData.type === 'income' ? 'Ex: Salário, Aluguel recebido' : 'Ex: Assinatura, Aluguel, Conta de Luz'}
                    />
                  </div>

                  {formData.isRecurring && (
                    <div className="animate-in space-y-4 rounded-xl border border-torrinco-100 bg-torrinco-50/50 p-4 duration-300 slide-in-from-top-2 dark:border-torrinco-900 dark:bg-torrinco-950/20">
                      <CustomSelect
                        label="Frequência"
                        value={formData.frequency}
                        onChange={(value) => setFormData({...formData, frequency: value as typeof formData.frequency})}
                        options={[
                          { value: 'daily', label: 'Diária' },
                          { value: 'weekly', label: 'Semanal' },
                          { value: 'monthly', label: 'Mensal' },
                          { value: 'yearly', label: 'Anual' },
                        ]}
                        required
                      />

                      <CustomSelect
                        label="Término da recorrência"
                        value={formData.recurrenceEndType}
                        onChange={(value) => setFormData({
                          ...formData,
                          recurrenceEndType: value as typeof formData.recurrenceEndType,
                          occurrenceCount: value === 'occurrence_count' ? formData.occurrenceCount : '',
                          recurrenceEndDate: value === 'end_date' ? formData.recurrenceEndDate : '',
                        })}
                        options={[
                          { value: 'occurrence_count', label: 'Após uma quantidade' },
                          { value: 'end_date', label: 'Em uma data' },
                          { value: 'never', label: 'Sem data final' },
                        ]}
                        placeholder="Escolha como termina"
                        required
                      />

                      {formData.recurrenceEndType === 'occurrence_count' && (
                        <div>
                          <Input
                            label="Total de ocorrências"
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={formData.occurrenceCount}
                            onChange={(event) => setFormData({...formData, occurrenceCount: event.target.value})}
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">A primeira ocorrência está incluída no total.</p>
                        </div>
                      )}

                      {formData.recurrenceEndType === 'end_date' && (
                        <DatePicker
                          label="Data final"
                          required
                          value={formData.recurrenceEndDate}
                          onChange={(date) => setFormData({...formData, recurrenceEndDate: date})}
                        />
                      )}

                      {recurrencePreview && (
                        <p className="rounded-lg bg-white p-3 text-sm text-gray-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                          {recurrencePreview}
                        </p>
                      )}
                    </div>
                  )}

                  {(editingTransaction?.is_recurring || (typeof editingTransaction?.id === 'string' && editingTransaction?.id.startsWith('rec-'))) && (
                    <div className="animate-in rounded-xl border border-amber-100 bg-amber-50 p-3 duration-300 slide-in-from-top-2 dark:border-amber-800 dark:bg-amber-900/20">
                      <Checkbox
                        id="updateSeries"
                        checked={formData.updateSeries}
                        onCheckedChange={(checked) => setFormData({...formData, updateSeries: checked})}
                        containerClassName="text-amber-800 dark:text-amber-300"
                        inputClassName="accent-amber-600 focus-visible:ring-amber-500"
                        label="Atualizar toda a série futura?"
                        description="Isso mudará todas as próximas ocorrências desta transação."
                      />
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

      {/* Recurring series confirmation */}
      {recurringConfirmationOpen && (
        <div className="app-scroll-lock app-dialog-overlay fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div ref={recurringDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="recurring-confirmation-title" className="app-dialog-surface w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <h3 id="recurring-confirmation-title" className="text-lg font-bold text-gray-900 dark:text-white">
              Confirmar série recorrente?
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {formData.description} · {formData.amount ? formatCurrency(Number(formData.amount.replace(',', '.'))) : 'R$ 0,00'}
            </p>
            <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-slate-900 dark:text-slate-300">
              {recurrencePreview}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setRecurringConfirmationOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecurringConfirmationOpen(false);
                  void saveTransaction(true);
                }}
                className="flex-1 rounded-xl bg-torrinco-600 px-4 py-3 font-bold text-white transition-colors hover:bg-torrinco-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && deleteDialog.transaction && (
        <div className="app-scroll-lock app-dialog-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div ref={deleteDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Excluir transação" className="app-dialog-surface bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-y-auto animate-in fade-in zoom-in duration-200">
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
                    onClick={() => handleDelete('future')}
                    className="w-full px-4 py-3 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold rounded-xl transition-colors"
                  >
                    Esta e as próximas
                  </button>
                  <button
                    onClick={() => handleDelete('all')}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                  >
                    Toda a série
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
