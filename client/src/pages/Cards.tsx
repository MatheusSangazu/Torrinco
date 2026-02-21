import { useState, useEffect } from 'react';
import { CreditCard as CreditCardIcon, Plus, Pencil, Trash2, X, Check, AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cardsService, type CreditCard, type CreateCardDTO } from '../services/cards.service';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { Input } from '../components/Input';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_date: Date;
  type: 'income' | 'expense';
  category?: string;
  installment_number?: number;
  installment_id?: number;
  purchase_installments?: {
    description: string;
    installment_count: number;
    installment_value: number;
  };
}

interface Bill {
  period: string;
  startDate: Date;
  endDate: Date;
  closingDate: Date;
  dueDate: Date;
  totalExpenses: number;
  totalPayments: number;
  billAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  transactionCount: number;
  transactions: Transaction[];
}

interface BillTransaction {
  id: number;
  description: string;
  amount: number;
  transaction_date: Date;
  type: 'income' | 'expense';
  category?: string;
  installment_number?: number;
  installment_id?: number;
  purchase_installments?: {
    description: string;
    installment_count: number;
    installment_value: number;
  };
}

interface BillDetails {
  card: {
    id: number;
    name: string;
    color: string;
    limit: number;
    closingDay: number;
    dueDay: number;
  };
  bill: {
    startDate: Date;
    endDate: Date;
    closingDate: Date;
    dueDate: Date;
    totalExpenses: number;
    transactionCount: number;
    transactions: BillTransaction[];
  };
}

const CARD_COLORS = [
  { id: 'purple', from: 'from-purple-600', to: 'to-indigo-700', class: 'from-purple-600 to-indigo-700' },
  { id: 'blue', from: 'from-blue-600', to: 'to-cyan-700', class: 'from-blue-600 to-cyan-700' },
  { id: 'green', from: 'from-emerald-600', to: 'to-teal-700', class: 'from-emerald-600 to-teal-700' },
  { id: 'orange', from: 'from-orange-600', to: 'to-red-700', class: 'from-orange-600 to-red-700' },
  { id: 'pink', from: 'from-pink-600', to: 'to-rose-700', class: 'from-pink-600 to-rose-700' },
  { id: 'slate', from: 'from-slate-700', to: 'to-gray-800', class: 'from-slate-700 to-gray-800' },
  { id: 'cyan', from: 'from-cyan-600', to: 'to-blue-700', class: 'from-cyan-600 to-blue-700' },
  { id: 'yellow', from: 'from-yellow-600', to: 'to-orange-700', class: 'from-yellow-600 to-orange-700' },
  { id: 'violet', from: 'from-violet-600', to: 'to-purple-700', class: 'from-violet-600 to-purple-700' },
  { id: 'rose', from: 'from-rose-600', to: 'to-pink-700', class: 'from-rose-600 to-pink-700' },
  { id: 'indigo', from: 'from-indigo-600', to: 'to-violet-700', class: 'from-indigo-600 to-violet-700' },
  { id: 'teal', from: 'from-teal-600', to: 'to-emerald-700', class: 'from-teal-600 to-emerald-700' },
];

export function Cards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [cardBills, setCardBills] = useState<Record<number, Bill[]>>({});
  const [loadingBills, setLoadingBills] = useState<Record<number, boolean>>({});
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billModalType, setBillModalType] = useState<'current' | 'next'>('current');
  const [billModalCard, setBillModalCard] = useState<CreditCard | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [loadingBillDetails, setLoadingBillDetails] = useState(false);
  const [formData, setFormData] = useState<CreateCardDTO>({
    name: '',
    limit: 0,
    closing_day: undefined,
    due_day: undefined,
    color: 'from-purple-600 to-indigo-700'
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await cardsService.list();
      setCards(data);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      toast.error('Erro ao carregar cartões');
    } finally {
      setLoading(false);
    }
  };

  const fetchCardBills = async (cardId: number) => {
    if (cardBills[cardId]) {
      return;
    }

    try {
      setLoadingBills(prev => ({ ...prev, [cardId]: true }));
      const response = await api.get(`/cards/${cardId}/bills?months=6`);
      setCardBills(prev => ({ ...prev, [cardId]: response.data.bills }));
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      toast.error('Erro ao carregar faturas');
    } finally {
      setLoadingBills(prev => ({ ...prev, [cardId]: false }));
    }
  };

  const toggleCardExpansion = (cardId: number) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
      fetchCardBills(cardId);
    }
  };

  const toggleBillExpansion = (billPeriod: string) => {
    if (expandedBill === billPeriod) {
      setExpandedBill(null);
    } else {
      setExpandedBill(billPeriod);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCard) {
        await cardsService.update(editingCard.id, formData);
        toast.success('Cartão atualizado com sucesso!');
      } else {
        await cardsService.create(formData);
        toast.success('Cartão criado com sucesso!');
      }
      setIsModalOpen(false);
      setEditingCard(null);
      setFormData({ name: '', limit: 0, closing_day: undefined, due_day: undefined });
      fetchCards();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      toast.error(editingCard ? 'Erro ao atualizar cartão' : 'Erro ao criar cartão');
    }
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      limit: card.limit,
      closing_day: card.closingDay,
      due_day: card.dueDay,
      color: card.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cartão?')) return;

    try {
      await cardsService.delete(id);
      toast.success('Cartão excluído com sucesso!');
      fetchCards();
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
      toast.error('Erro ao excluir cartão');
    }
  };

  const getLimitPercentage = (card: CreditCard) => {
    if (card.limit === 0) return 0;
    return Math.round((card.currentBill / card.limit) * 100);
  };

  const getLimitColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getLimitTextColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-orange-500';
    return 'text-green-500';
  };

  const getCardIconColor = (cardColor: string) => {
    const colorMatch = cardColor.match(/from-(\w+)-\d+/);
    if (colorMatch) {
      const color = colorMatch[1];
      return {
        bg: `bg-${color}-100 dark:bg-${color}-900/30`,
        text: `text-${color}-600 dark:text-${color}-400`
      };
    }
    return {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    };
  };

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500';
      case 'overdue': return 'text-red-500';
      case 'pending': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  const getBillStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paga';
      case 'overdue': return 'Atrasada';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const handleOpenBillModal = async (card: CreditCard, type: 'current' | 'next') => {
    setBillModalType(type);
    setBillModalCard(card);
    setBillModalOpen(true);
    setLoadingBillDetails(true);
    
    try {
      let data;
      if (type === 'current') {
        data = await cardsService.getBill(card.id);
      } else {
        data = await cardsService.getNextBill(card.id);
      }
      setBillDetails(data);
    } catch (error) {
      console.error('Erro ao carregar fatura:', error);
      toast.error('Erro ao carregar fatura');
    } finally {
      setLoadingBillDetails(false);
    }
  };

  const handleCloseBillModal = () => {
    setBillModalOpen(false);
    setBillDetails(null);
    setBillModalCard(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cartões de Crédito</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Gerencie seus cartões e acompanhe faturas</p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null);
            setFormData({ name: '', limit: 0, closing_day: undefined, due_day: undefined, color: 'from-purple-600 to-indigo-700' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-torrinco-600 hover:bg-torrinco-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Novo Cartão</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
          Carregando cartões...
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700">
          <CreditCardIcon size={64} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Nenhum cartão cadastrado</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-6">Comece adicionando seu primeiro cartão de crédito</p>
          <button
            onClick={() => {
              setEditingCard(null);
              setFormData({ name: '', limit: 0, closing_day: undefined, due_day: undefined, color: 'from-purple-600 to-indigo-700' });
              setIsModalOpen(true);
            }}
            className="bg-torrinco-600 hover:bg-torrinco-700 text-white px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Adicionar Cartão
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card) => {
            const limitPercentage = getLimitPercentage(card);
            const limitColor = getLimitColor(limitPercentage);
            const limitTextColor = getLimitTextColor(limitPercentage);
            
            return (
              <div key={card.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={clsx("p-3 rounded-xl", getCardIconColor(card.color).bg, getCardIconColor(card.color).text)}>
                      <CreditCardIcon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">{card.name}</h3>
                      <span className={clsx("text-xs font-semibold", card.status === 'open' ? "text-green-500" : "text-orange-500")}>
                        {card.status === 'open' ? 'Em aberto' : 'Fechado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(card)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-slate-400">Fatura atual</span>
                      <span className={clsx("font-bold", limitTextColor)}>{formatCurrency(card.currentBill)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={clsx("h-full transition-all duration-300", limitColor)}
                        style={{ width: `${Math.min(limitPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400 dark:text-slate-500">{limitPercentage}% utilizado</span>
                      <span className="text-gray-400 dark:text-slate-500">Disponível: {formatCurrency(card.availableLimit)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Limite total</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{formatCurrency(card.limit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Fechamento</p>
                      <p className="font-semibold text-gray-800 dark:text-white">Dia {card.closingDay}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Vencimento</p>
                      <p className="font-semibold text-gray-800 dark:text-white">Dia {card.dueDay}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Próx. fechamento</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(card.closingDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Próx. vencimento</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(card.dueDate)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleOpenBillModal(card, 'current')}
                      className="text-xs text-torrinco-600 dark:text-torrinco-400 hover:text-torrinco-700 dark:hover:text-torrinco-300 flex items-center justify-center gap-1 py-2 border border-torrinco-200 dark:border-torrinco-800 rounded-lg hover:bg-torrinco-50 dark:hover:bg-torrinco-900/20 transition-colors"
                    >
                      Ver fatura atual
                    </button>
                    <button
                      onClick={() => handleOpenBillModal(card, 'next')}
                      className="text-xs text-torrinco-600 dark:text-torrinco-400 hover:text-torrinco-700 dark:hover:text-torrinco-300 flex items-center justify-center gap-1 py-2 border border-torrinco-200 dark:border-torrinco-800 rounded-lg hover:bg-torrinco-50 dark:hover:bg-torrinco-900/20 transition-colors"
                    >
                      Ver fatura seguinte
                    </button>
                  </div>

                  <button
                    onClick={() => toggleCardExpansion(card.id)}
                    className="w-full mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    {expandedCard === card.id ? (
                      <>
                        <ChevronUp size={16} />
                        Ocultar faturas
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Ver histórico de faturas
                      </>
                    )}
                  </button>

                  {expandedCard === card.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                      {loadingBills[card.id] ? (
                        <div className="flex items-center justify-center py-8 text-gray-500 dark:text-slate-400">
                          Carregando faturas...
                        </div>
                      ) : cardBills[card.id] && cardBills[card.id].length > 0 ? (
                        <div className="space-y-3">
                          {cardBills[card.id].map((bill) => (
                            <div
                              key={bill.period}
                              className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-semibold text-gray-800 dark:text-white">
                                    Fatura {bill.period}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-slate-400">
                                    {formatDate(bill.startDate)} - {formatDate(bill.endDate)}
                                  </p>
                                </div>
                                <span className={clsx("text-xs font-semibold", getBillStatusColor(bill.status))}>
                                  {getBillStatusText(bill.status)}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400">Despesas</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">
                                    {formatCurrency(bill.totalExpenses)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400">Pagamentos</p>
                                  <p className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(bill.totalPayments)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400">Fatura</p>
                                  <p className={clsx("font-bold", bill.billAmount > 0 ? "text-gray-800 dark:text-white" : "text-green-600 dark:text-green-400")}>
                                    {formatCurrency(bill.billAmount)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="text-gray-500 dark:text-slate-400">Fechamento: </span>
                                  <span className="text-gray-800 dark:text-white">{formatDate(bill.closingDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-slate-400">Vencimento: </span>
                                  <span className="text-gray-800 dark:text-white">{formatDate(bill.dueDate)}</span>
                                </div>
                              </div>

                              {bill.transactionCount > 0 && (
                                <div className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                                  {bill.transactionCount} transação{bill.transactionCount !== 1 ? 'ões' : ''}
                                </div>
                              )}

                              {bill.transactionCount > 0 && (
                                <button
                                  onClick={() => toggleBillExpansion(bill.period)}
                                  className="mt-3 w-full text-xs text-torrinco-600 dark:text-torrinco-400 hover:text-torrinco-700 dark:hover:text-torrinco-300 flex items-center justify-center gap-1 py-2 border border-torrinco-200 dark:border-torrinco-800 rounded-lg hover:bg-torrinco-50 dark:hover:bg-torrinco-900/20 transition-colors"
                                >
                                  {expandedBill === bill.period ? (
                                    <>
                                      <ChevronUp size={12} />
                                      Ocultar transações
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown size={12} />
                                      Ver transações
                                    </>
                                  )}
                                </button>
                              )}

                              {expandedBill === bill.period && bill.transactions && bill.transactions.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {bill.transactions.map((transaction) => (
                                    <div
                                      key={transaction.id}
                                      className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-600"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-800 dark:text-white text-sm truncate">
                                              {transaction.description}
                                            </p>
                                            {transaction.installment_number && (
                                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-medium shrink-0">
                                                {transaction.installment_number}/{transaction.purchase_installments?.installment_count}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                            {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                                          </p>
                                          {transaction.installment_number && transaction.purchase_installments && (
                                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                              Parcela de {formatCurrency(Number(transaction.purchase_installments.installment_value))} em {transaction.purchase_installments.installment_count}x
                                            </p>
                                          )}
                                        </div>
                                        <span className={clsx(
                                          "font-semibold text-sm",
                                          transaction.type === 'income' 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                        )}>
                                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                          Nenhuma fatura encontrada
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome do cartão"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Nubank, Itaú..."
                required
              />

              <Input
                label="Limite do cartão"
                type="number"
                step="0.01"
                min="0"
                value={formData.limit || ''}
                onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
                placeholder="0,00"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Dia fechamento"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.closing_day || ''}
                  onChange={(e) => setFormData({ ...formData, closing_day: Number(e.target.value) })}
                  placeholder="1-31"
                  required
                />
                <Input
                  label="Dia vencimento"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.due_day || ''}
                  onChange={(e) => setFormData({ ...formData, due_day: Number(e.target.value) })}
                  placeholder="1-31"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                  Cor do cartão
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {CARD_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.class })}
                      className={clsx(
                        'h-10 rounded-lg transition-all duration-200 border-2 relative overflow-hidden',
                        formData.color === color.class
                          ? 'border-gray-800 dark:border-white ring-2 ring-offset-2 ring-gray-800 dark:ring-white'
                          : 'border-transparent hover:scale-105'
                      )}
                    >
                      <div className={clsx('w-full h-full bg-gradient-to-br', color.from, color.to)} />
                    </button>
                  ))}
                </div>
              </div>

              {formData.closing_day && formData.due_day && formData.closing_day >= formData.due_day && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Geralmente o dia de vencimento deve ser maior que o dia de fechamento.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {editingCard ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {billModalOpen && billModalCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {billModalType === 'current' ? 'Fatura Atual' : 'Fatura Seguinte'} - {billModalCard.name}
              </h2>
              <button
                onClick={handleCloseBillModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingBillDetails ? (
                <div className="flex items-center justify-center py-16 text-gray-500 dark:text-slate-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  Carregando fatura...
                </div>
              ) : billDetails ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Período</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {formatDate(billDetails.bill.startDate)} - {formatDate(billDetails.bill.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Vencimento</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {formatDate(billDetails.bill.dueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Total</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {formatCurrency(billDetails.bill.totalExpenses)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Compras ({billDetails.bill.transactionCount})
                    </h3>
                    
                    {billDetails.bill.transactions.length > 0 ? (
                      <div className="space-y-3">
                        {billDetails.bill.transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {transaction.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {transaction.category && (
                                    <span className="text-xs text-gray-500 dark:text-slate-400">
                                      {transaction.category}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400 dark:text-slate-500">
                                    {formatDate(transaction.transaction_date)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                -{formatCurrency(transaction.amount)}
                              </p>
                            </div>
                            
                            {transaction.purchase_installments && (
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-600">
                                <p className="text-sm text-gray-600 dark:text-slate-300">
                                  <span className="font-medium">{transaction.purchase_installments.description}</span>
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-gray-500 dark:text-slate-400">
                                    Parcela {transaction.installment_number}/{transaction.purchase_installments.installment_count}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-slate-400">
                                    {formatCurrency(transaction.purchase_installments.installment_value)} por parcela
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                        <p className="text-gray-500 dark:text-slate-400">Nenhuma compra encontrada</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  Erro ao carregar fatura
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={handleCloseBillModal}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
