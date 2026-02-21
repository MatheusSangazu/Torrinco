import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Edit2, X, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

interface IncomeSource {
  id: number;
  name: string;
  color: string;
}

export function IncomeSources() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncomeSource, setEditingIncomeSource] = useState<IncomeSource | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10b981');

  const colors = [
    '#10b981', '#22c55e', '#84cc16', '#06b6d4', '#3b82f6',
    '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316',
    '#f59e0b', '#64748b', '#000000'
  ];

  useEffect(() => {
    fetchIncomeSources();
  }, []);

  const fetchIncomeSources = async () => {
    try {
      const response = await api.get('/income-sources');
      setIncomeSources(response.data.income_sources);
    } catch (error) {
      console.error('Failed to fetch income sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (incomeSource?: IncomeSource) => {
    if (incomeSource) {
      setEditingIncomeSource(incomeSource);
      setName(incomeSource.name);
      setColor(incomeSource.color);
    } else {
      setEditingIncomeSource(null);
      setName('');
      setColor('#10b981');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingIncomeSource) {
        await api.put(`/income-sources/${editingIncomeSource.id}`, { name, color });
      } else {
        await api.post('/income-sources', { name, color });
      }
      setIsModalOpen(false);
      fetchIncomeSources();
      toast.success(editingIncomeSource ? 'Fonte de receita atualizada!' : 'Fonte de receita criada!');
    } catch (error: any) {
      console.error('Failed to save income source:', error);
      const message = error.response?.data?.error || error.message || 'Erro desconhecido ao salvar';
      
      toast.error(`Erro: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta fonte de receita?')) return;
    try {
      await api.delete(`/income-sources/${id}`);
      fetchIncomeSources();
      toast.success('Fonte de receita excluída!');
    } catch (error) {
      console.error('Failed to delete income source:', error);
      toast.error('Erro ao excluir fonte de receita.');
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fontes de Receita</h1>
          <p className="text-gray-500 dark:text-gray-400">Gerencie as origens das suas receitas</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center px-4 py-2 bg-torrinco-600 text-white rounded-xl hover:bg-torrinco-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Fonte de Receita
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" /> Fontes de Receita
        </h2>
        <div className="space-y-2">
          {incomeSources.length === 0 && (
            <p className="text-gray-400 text-sm">Nenhuma fonte de receita cadastrada.</p>
          )}
          {incomeSources.map(source => (
            <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl group">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="font-medium text-gray-700 dark:text-gray-200">{source.name}</span>
              </div>
              <div className="flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(source)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(source.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingIncomeSource ? 'Editar Fonte de Receita' : 'Nova Fonte de Receita'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Salário, Freela, Comissão"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={clsx(
                        "w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 dark:ring-offset-slate-800",
                        color === c ? "ring-gray-400 scale-110" : "ring-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 bg-torrinco-600 hover:bg-torrinco-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-torrinco-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Salvando...' : (editingIncomeSource ? 'Salvar Alterações' : 'Criar Fonte de Receita')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
