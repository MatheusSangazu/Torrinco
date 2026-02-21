import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Edit2, X, Tag } from 'lucide-react';
import clsx from 'clsx';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState('#3b82f6');

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', 
    '#f43f5e', '#64748b', '#000000'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setType(category.type);
      setColor(category.color);
    } else {
      setEditingCategory(null);
      setName('');
      setType('expense');
      setColor('#3b82f6');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name, color });
      } else {
        await api.post('/categories', { name, type, color });
      }
      setIsModalOpen(false);
      fetchCategories();
      toast.success(editingCategory ? 'Categoria atualizada!' : 'Categoria criada!');
    } catch (error: any) {
      console.error('Failed to save category:', error);
      // Tenta extrair a mensagem de erro mais específica possível
      const message = error.response?.data?.error || error.message || 'Erro desconhecido ao salvar';
      
      toast.error(`Erro: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success('Categoria excluída!');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Erro ao excluir categoria.');
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h1>
          <p className="text-gray-500 dark:text-gray-400">Gerencie as categorias de suas transações</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center px-4 py-2 bg-torrinco-600 text-white rounded-xl hover:bg-torrinco-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Despesas */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" /> Despesas
          </h2>
          <div className="space-y-2">
            {expenseCategories.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhuma categoria cadastrada.</p>
            )}
            {expenseCategories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl group">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receitas */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" /> Receitas
          </h2>
          <div className="space-y-2">
            {incomeCategories.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhuma categoria cadastrada.</p>
            )}
            {incomeCategories.map((cat: Category) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl group">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
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
                placeholder="Ex: Alimentação"
              />

              {!editingCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={clsx(
                        "py-2 px-4 rounded-xl text-sm font-medium border transition-colors",
                        type === 'expense' 
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" 
                          : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400"
                      )}
                    >
                      Despesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={clsx(
                        "py-2 px-4 rounded-xl text-sm font-medium border transition-colors",
                        type === 'income' 
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400" 
                          : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400"
                      )}
                    >
                      Receita
                    </button>
                  </div>
                </div>
              )}

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
                  {saving ? 'Salvando...' : (editingCategory ? 'Salvar Alterações' : 'Criar Categoria')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
