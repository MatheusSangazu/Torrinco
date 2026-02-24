import { useState, useEffect } from 'react';
import { Plus, Clock, Bell, Edit2, Trash2, Check, X } from 'lucide-react';
import { remindersService, type Reminder, type ReminderFrequency, type ReminderWeekday } from '../services/reminders.service';
import { clsx } from 'clsx';
import { Input } from '../components/Input';
import { CustomSelect } from '../components/CustomSelect';
import { DatePicker } from '../components/DatePicker';
import { TimePicker } from '../components/TimePicker';
import toast from 'react-hot-toast';

const WEEKDAYS = [
  { value: 'Monday', label: 'Segunda-feira' },
  { value: 'Tuesday', label: 'Terça-feira' },
  { value: 'Wednesday', label: 'Quarta-feira' },
  { value: 'Thursday', label: 'Quinta-feira' },
  { value: 'Friday', label: 'Sexta-feira' },
  { value: 'Saturday', label: 'Sábado' },
  { value: 'Sunday', label: 'Domingo' }
];

const FREQUENCIES = [
  { value: 'once', label: 'Único' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'completed', label: 'Concluídos' }
];

const FREQUENCY_FILTERS = [
  { value: 'all', label: 'Todas frequências' },
  { value: 'once', label: 'Único' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' }
];

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | ReminderFrequency>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; reminder: Reminder | null }>({ open: false, reminder: null });

  const [formData, setFormData] = useState({
    content: '',
    trigger_time: '09:00',
    frequency: 'once' as ReminderFrequency,
    specific_date: '',
    weekday: '' as ReminderWeekday | ''
  });

  useEffect(() => {
    fetchReminders();
  }, [statusFilter, frequencyFilter]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (frequencyFilter !== 'all') params.frequency = frequencyFilter;
      
      const data = await remindersService.list(params);
      setReminders(data);
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      toast.error('Erro ao carregar lembretes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const dataToSend: any = {
        content: formData.content,
        trigger_time: formData.trigger_time,
        frequency: formData.frequency
      };

      if (formData.frequency === 'once') {
        dataToSend.specific_date = formData.specific_date;
      } else if (formData.frequency === 'weekly') {
        dataToSend.weekday = formData.weekday || undefined;
      }

      if (editingReminder) {
        await remindersService.update(editingReminder.id, dataToSend);
        toast.success('Lembrete atualizado com sucesso!');
      } else {
        await remindersService.create(dataToSend);
        toast.success('Lembrete criado com sucesso!');
      }
      
      setIsModalOpen(false);
      setEditingReminder(null);
      resetForm();
      fetchReminders();
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      toast.error('Erro ao salvar lembrete');
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      content: reminder.content,
      trigger_time: reminder.trigger_time.split('T')[1].substring(0, 5),
      frequency: reminder.frequency,
      specific_date: reminder.specific_date ? reminder.specific_date.split('T')[0] : '',
      weekday: reminder.weekday || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.reminder) return;

    try {
      await remindersService.delete(deleteDialog.reminder.id);
      toast.success('Lembrete excluído com sucesso!');
      setDeleteDialog({ open: false, reminder: null });
      fetchReminders();
    } catch (error) {
      console.error('Erro ao excluir lembrete:', error);
      toast.error('Erro ao excluir lembrete');
    }
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    try {
      if (reminder.status === 'active') {
        await remindersService.markAsCompleted(reminder.id);
        toast.success('Lembrete marcado como concluído!');
      } else {
        await remindersService.update(reminder.id, { status: 'active' });
        toast.success('Lembrete reativado!');
      }
      fetchReminders();
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      toast.error('Erro ao atualizar lembrete');
    }
  };

  const resetForm = () => {
    setFormData({
      content: '',
      trigger_time: '09:00',
      frequency: 'once',
      specific_date: '',
      weekday: ''
    });
  };

  const openNewModal = () => {
    setEditingReminder(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getFrequencyLabel = (frequency: ReminderFrequency, weekday?: ReminderWeekday | null, specificDate?: string | null) => {
    switch (frequency) {
      case 'once':
        return specificDate ? `Único - ${new Date(specificDate).toLocaleDateString('pt-BR')}` : 'Único';
      case 'daily':
        return 'Diário';
      case 'weekly':
        const wd = WEEKDAYS.find(w => w.value === weekday);
        return wd ? `Semanal - ${wd.label}` : 'Semanal';
      case 'monthly':
        return 'Mensal';
      default:
        return frequency;
    }
  };

  const filteredReminders = reminders.sort((a, b) => {
    if (a.status === 'active' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status === 'active') return 1;
    return new Date(a.trigger_time).getTime() - new Date(b.trigger_time).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="text-torrinco-600" />
            Lembretes
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Gerencie seus lembretes e compromissos</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-xl transition-colors font-medium shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Novo Lembrete
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <CustomSelect
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as any)}
          options={STATUS_OPTIONS}
          className="w-full sm:w-48"
        />
        <CustomSelect
          value={frequencyFilter}
          onChange={(value) => setFrequencyFilter(value as any)}
          options={FREQUENCY_FILTERS}
          className="w-full sm:w-48"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            Carregando...
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 mb-4 text-gray-400 dark:text-slate-500">
              <Bell size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum lembrete encontrado</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              {statusFilter === 'completed' 
                ? 'Você ainda não concluiu nenhum lembrete.'
                : 'Crie seu primeiro lembrete para começar!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={clsx(
                  "group p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4",
                  reminder.status === 'completed' && "opacity-60"
                )}
              >
                <button
                  onClick={() => handleToggleComplete(reminder)}
                  className={clsx(
                    "shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                    reminder.status === 'active'
                      ? "border-2 border-gray-300 dark:border-slate-500 hover:border-torrinco-500"
                      : "bg-torrinco-600 text-white"
                  )}
                >
                  {reminder.status === 'completed' ? <Check size={16} /> : null}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={clsx(
                        "font-semibold text-gray-900 dark:text-white break-words text-base sm:text-lg",
                        reminder.status === 'completed' && "line-through"
                      )}>
                        {reminder.content}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                          <Clock size={12} />
                          {new Date(reminder.trigger_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                          {getFrequencyLabel(reminder.frequency, reminder.weekday, reminder.specific_date)}
                        </span>
                        <span className={clsx(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          reminder.status === 'active'
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400"
                        )}>
                          {reminder.status === 'active' ? 'Ativo' : 'Concluído'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(reminder)}
                        className="p-2 sm:p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, reminder })}
                        className="p-2 sm:p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 rounded-t-2xl z-10">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {editingReminder ? 'Editar Lembrete' : 'Novo Lembrete'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingReminder(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <Input
                label="Conteúdo"
                type="text"
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Ex: Pagar conta de luz"
              />

              <TimePicker
                label="Horário"
                required
                value={formData.trigger_time}
                onChange={(time) => setFormData({ ...formData, trigger_time: time })}
              />

              <CustomSelect
                label="Frequência"
                value={formData.frequency}
                onChange={(value) => setFormData({ ...formData, frequency: value as ReminderFrequency })}
                options={FREQUENCIES}
              />

              {formData.frequency === 'once' && (
                <DatePicker
                  label="Data Específica"
                  value={formData.specific_date}
                  onChange={(date) => setFormData({ ...formData, specific_date: date })}
                />
              )}

              {formData.frequency === 'weekly' && (
                <CustomSelect
                  label="Dia da Semana"
                  value={formData.weekday}
                  onChange={(value) => setFormData({ ...formData, weekday: value as ReminderWeekday })}
                  options={WEEKDAYS}
                />
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReminder(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  {editingReminder ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-200">
            <div className="p-4 sm:p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                Excluir Lembrete
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-6">
                Tem certeza que deseja excluir este lembrete? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteDialog({ open: false, reminder: null })}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
