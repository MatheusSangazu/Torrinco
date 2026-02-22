import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface Category {
  id: number;
  name: string;
  color?: string;
  type?: string;
}

interface CategorySelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Category[];
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CategorySelect({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Selecione...',
  className = '',
  required
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const selected = options.find(opt => opt.id.toString() === value.toString());
    setSelectedCategory(selected || null);
  }, [value, options]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Category) => {
    onChange(option.id.toString());
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className={`space-y-1 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 text-left bg-white dark:bg-slate-900 
            border rounded-xl flex items-center justify-between
            transition-all duration-200
            min-h-[48px]
            ${error 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:ring-torrinco-500'
            }
            ${isOpen ? 'ring-2 ring-torrinco-500 border-transparent' : ''}
          `}
        >
          <span className={`block truncate text-base ${!selectedCategory ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                {selectedCategory.color && (
                  <div 
                    className="w-3.5 h-3.5 rounded-full" 
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                )}
                {selectedCategory.name}
              </div>
            ) : (
              placeholder
            )}
          </span>
          <div className="flex items-center gap-1">
            {selectedCategory && (
              <div 
                onClick={clearSelection}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </div>
            )}
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3 border-b border-gray-100 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-10 pr-4 py-2 text-base bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-torrinco-500 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Buscar categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full px-4 py-3 text-base text-left rounded-lg flex items-center justify-between
                      transition-colors duration-150 min-h-[44px]
                      ${option.id.toString() === value.toString()
                        ? 'bg-torrinco-50 dark:bg-torrinco-900/20 text-torrinco-700 dark:text-torrinco-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {option.color && (
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span>{option.name}</span>
                    </div>
                    {option.id.toString() === value.toString() && (
                      <Check className="w-5 h-5 text-torrinco-600 dark:text-torrinco-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-base text-gray-500 dark:text-gray-400">
                  Nenhuma categoria encontrada
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
