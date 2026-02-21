import { useState, useEffect } from 'react';
import { CreditCard as CreditCardIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cardsService, type CreditCard } from '../services/cards.service';
import { clsx } from 'clsx';

export function CreditCardCarousel() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await cardsService.list();
        setCards(data);
      } catch (error) {
        console.error('Erro ao carregar cartões:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
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

  const getStatusColor = (status: string) => {
    return status === 'open' 
      ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
      : 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
  };

  const getStatusText = (status: string) => {
    return status === 'open' ? 'Aberto' : 'Fechado';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <CreditCardIcon size={24} />
          </div>
          <span className="text-gray-500 dark:text-slate-400 font-medium">Cartões de Crédito</span>
        </div>
        <div className="h-48 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <CreditCardIcon size={24} />
          </div>
          <span className="text-gray-500 dark:text-slate-400 font-medium">Cartões de Crédito</span>
        </div>
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-slate-500">
          <Plus size={32} className="mb-2" />
          <span className="text-sm">Nenhum cartão cadastrado</span>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const percentage = getLimitPercentage(currentCard);
  const limitColor = getLimitColor(percentage);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <CreditCardIcon size={24} />
          </div>
          <span className="text-gray-500 dark:text-slate-400 font-medium">Cartões de Crédito</span>
        </div>
        {cards.length > 1 && (
          <div className="flex items-center gap-1">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === currentIndex
                    ? 'bg-purple-600 dark:bg-purple-400 w-4'
                    : 'bg-gray-300 dark:bg-slate-600'
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {cards.length > 1 && (
          <>
            <button
              onClick={prevCard}
              className="absolute -left-3 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors z-10"
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-slate-300" />
            </button>
            <button
              onClick={nextCard}
              className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors z-10"
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-slate-300" />
            </button>
          </>
        )}

        <div className={clsx('bg-gradient-to-br rounded-2xl p-5 text-white shadow-lg', currentCard.color)}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{currentCard.name}</h3>
              <span className={clsx(
                'text-xs px-2 py-1 rounded-full border',
                getStatusColor(currentCard.status)
              )}>
                {getStatusText(currentCard.status)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80">Fatura Atual</p>
              <p className="text-xl font-bold">{formatCurrency(currentCard.currentBill)}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">Limite utilizado</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={clsx('h-full transition-all duration-300', limitColor)}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-white/60">
              <span>{formatCurrency(currentCard.currentBill)}</span>
              <span>{formatCurrency(currentCard.limit)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/80 mb-1">Fechamento</p>
              <p className="font-semibold">{currentCard.closingDay}</p>
              <p className="text-xs text-white/60">{formatDate(currentCard.closingDate)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/80 mb-1">Vencimento</p>
              <p className="font-semibold">{currentCard.dueDay}</p>
              <p className="text-xs text-white/60">{formatDate(currentCard.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
          <span className="text-xs uppercase tracking-wider">Disponível:</span>
          <span className="font-semibold text-gray-700 dark:text-slate-200">
            {formatCurrency(currentCard.availableLimit)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>SYNC</span>
        </div>
      </div>
    </div>
  );
}
