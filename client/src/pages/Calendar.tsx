import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, Calendar as CalendarIcon, X, Clock, Plus } from 'lucide-react';
import { api } from '../services/api';
import { clsx } from 'clsx';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  transaction_date: string;
  status: string;
}

interface Event {
  id: number;
  title: string;
  event_date: string;
  description?: string;
  google_event_id?: string;
}

type CalendarItem = 
  | (Transaction & { itemType: 'transaction' }) 
  | (Event & { itemType: 'event' });

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
      
      const [transactionsRes, eventsRes] = await Promise.all([
        api.get('/finance/transactions', {
          params: {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
          }
        }),
        api.get('/calendar')
      ]);
      
      setTransactions(transactionsRes.data.transactions);
      setEvents(eventsRes.data.events);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/calendar', {
        title: formData.title,
        event_date: formData.date,
        description: formData.description
      });
      
      setIsModalOpen(false);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      fetchData();
      toast.success('Evento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast.error('Erro ao salvar evento.');
    }
  };

  const openNewEventModal = () => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
    setIsModalOpen(true);
  };

  const openModalForDate = (date: Date) => {
    setFormData({
      title: '',
      date: date.toISOString().split('T')[0],
      description: ''
    });
    setIsModalOpen(true);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return days;
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getItemsForDay = (day: number): CalendarItem[] => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const dayTransactions = transactions
      .filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate.getDate() === day && 
               tDate.getMonth() === currentMonth && 
               tDate.getFullYear() === currentYear;
      })
      .map(t => ({ ...t, itemType: 'transaction' } as const));

    const dayEvents = events
      .filter(e => {
        const eDate = new Date(e.event_date);
        return eDate.getDate() === day && 
               eDate.getMonth() === currentMonth && 
               eDate.getFullYear() === currentYear;
      })
      .map(e => ({ ...e, itemType: 'event' } as const));

    return [...dayTransactions, ...dayEvents];
  };

  const getDayItems = (date: Date): CalendarItem[] => {
    const dayTransactions = transactions
      .filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate.getDate() === date.getDate() && 
               tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      })
      .map(t => ({ ...t, itemType: 'transaction' } as const));

    const dayEvents = events
      .filter(e => {
        const eDate = new Date(e.event_date);
        return eDate.getDate() === date.getDate() && 
               eDate.getMonth() === date.getMonth() && 
               eDate.getFullYear() === date.getFullYear();
      })
      .map(e => ({ ...e, itemType: 'event' } as const));

    return [...dayTransactions, ...dayEvents];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 bg-gray-50/50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-800"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const items = getItemsForDay(day);
      const hasIncome = items.some(i => i.itemType === 'transaction' && i.type === 'income');
      const hasExpense = items.some(i => i.itemType === 'transaction' && i.type === 'expense');
      const hasEvent = items.some(i => i.itemType === 'event');
      
      const isToday = 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() && 
        currentDate.getFullYear() === new Date().getFullYear();

      const isSelected = 
        selectedDate &&
        day === selectedDate.getDate() && 
        currentDate.getMonth() === selectedDate.getMonth() && 
        currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          onDoubleClick={() => openModalForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={clsx(
            "h-24 sm:h-32 border border-gray-100 dark:border-slate-700 p-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 relative flex flex-col justify-between group",
            isToday ? "bg-blue-50/50 dark:bg-blue-900/10" : "bg-white dark:bg-slate-800",
            isSelected ? "ring-2 ring-inset ring-torrinco-500 z-10" : ""
          )}
        >
          {/* Add Event Button (Hover) */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openModalForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-400 hover:text-torrinco-600 dark:text-slate-400 dark:hover:text-torrinco-400 bg-white/80 dark:bg-slate-800/80 shadow-sm backdrop-blur-sm"
              title="Adicionar evento"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>

          <div className="flex justify-between items-start">
            <span className={clsx(
              "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
              isToday 
                ? "bg-torrinco-600 text-white" 
                : "text-gray-700 dark:text-slate-300"
            )}>
              {day}
            </span>
            {items.length > 0 && (
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-1.5 rounded-md hidden sm:block">
                {items.length}
              </span>
            )}
          </div>
          
          <div className="hidden sm:flex flex-col gap-1 mt-1 overflow-hidden">
             {items.slice(0, 3).map((item, i) => (
               <div key={i} className={clsx(
                 "text-[10px] truncate px-1 rounded border-l-2",
                 item.itemType === 'event'
                   ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-500"
                   : item.type === 'income' 
                     ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500" 
                     : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500"
               )}>
                 {item.itemType === 'event' ? item.title : item.description}
               </div>
             ))}
             {items.length > 3 && (
               <div className="text-[10px] text-gray-400 pl-1">+ {items.length - 3} mais</div>
             )}
          </div>

          {/* Mobile dots indicator */}
          <div className="flex sm:hidden justify-center gap-1 absolute bottom-2 left-0 right-0">
            {hasEvent && <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>}
            {hasIncome && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
            {hasExpense && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
          </div>
        </div>
      );
    }

    return days;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const selectedDayItems = selectedDate ? getDayItems(selectedDate) : [];
  
  // Calcular totais do dia selecionado
  const dayIncome = selectedDayItems
    .filter(i => i.itemType === 'transaction' && i.type === 'income')
    .reduce((acc, i) => acc + (i as Transaction).amount, 0);
    
  const dayExpense = selectedDayItems
    .filter(i => i.itemType === 'transaction' && i.type === 'expense')
    .reduce((acc, i) => acc + (i as Transaction).amount, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-torrinco-600" />
            Agenda Geral
          </h1>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-xl transition-colors font-medium shadow-sm"
          >
            <Plus size={20} className="mr-2" />
            Novo Evento
          </button>
        
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-1">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-gray-800 dark:text-white min-w-[140px] text-center capitalize">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
          {/* Week days Header */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 overflow-y-auto">
            {loading ? (
              <div className="col-span-7 flex items-center justify-center h-64 text-gray-400">
                Carregando...
              </div>
            ) : renderCalendarDays()}
          </div>
        </div>

        {/* Side Panel (Selected Day Details) */}
        <div className={clsx(
          "w-full lg:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col transition-all duration-300",
          selectedDate ? "opacity-100 translate-x-0" : "opacity-50 translate-x-4 hidden lg:flex"
        )}>
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center rounded-t-2xl">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {selectedDate?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {weekDays[selectedDate?.getDay() || 0]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedDate && (
                <>
                   <button 
                     onClick={openNewEventModal}
                     className="p-2 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-lg transition-colors shadow-sm"
                     title="Adicionar evento neste dia"
                   >
                     <Plus size={16} />
                   </button>
                   <button onClick={() => setSelectedDate(null)} className="lg:hidden text-gray-400">
                     <X size={20} />
                   </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Daily Summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium block mb-1">Entradas</span>
                <span className="text-sm font-bold text-green-700 dark:text-green-300">{formatCurrency(dayIncome)}</span>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
                <span className="text-xs text-red-600 dark:text-red-400 font-medium block mb-1">Saídas</span>
                <span className="text-sm font-bold text-red-700 dark:text-red-300">{formatCurrency(dayExpense)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 pt-2">
              <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Linha do Tempo</h4>
              
              {selectedDayItems.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group p-2 hover:bg-gray-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors -mx-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={clsx(
                          "p-2 rounded-lg shrink-0",
                          item.itemType === 'event' 
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            : item.type === 'income' 
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600" 
                              : "bg-red-100 dark:bg-red-900/30 text-red-600"
                        )}>
                          {item.itemType === 'event' ? <Clock size={16} /> : (item.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.itemType === 'event' ? item.title : item.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                            {item.itemType === 'event' ? 'Evento' : item.category}
                          </p>
                        </div>
                      </div>
                      
                      {item.itemType === 'transaction' && (
                        <span className={clsx(
                          "text-sm font-bold shrink-0 ml-2",
                          item.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                        )}>
                          {formatCurrency(item.amount)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 dark:text-slate-500 text-sm">
                  Nada agendado para este dia.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nova Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Novo Evento
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <Input
                label="Título"
                type="text"
                required
                placeholder="Ex: Reunião, Aniversário..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <Input
                label="Data"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Descrição</label>
                <textarea 
                  rows={3}
                  placeholder="Detalhes adicionais..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-torrinco-500 dark:text-white resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-torrinco-600 hover:bg-torrinco-700 text-white font-bold rounded-xl shadow-lg shadow-torrinco-600/20 transition-all active:scale-[0.98]"
                >
                  Adicionar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}