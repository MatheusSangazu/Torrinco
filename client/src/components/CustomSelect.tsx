import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

export interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CustomSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = 'Selecione...', 
  className = '',
  required
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 text-left bg-white dark:bg-slate-900 
          border rounded-xl flex items-center justify-between
          transition-all duration-200
          min-h-[48px]
          ${isOpen ? 'ring-2 ring-torrinco-500 border-transparent' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}
        `}
      >
        <span className={`block truncate text-base ${!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left flex items-center justify-between
                  hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors
                  ${option.value === value ? 'bg-gray-50 dark:bg-slate-700/50 text-torrinco-600 dark:text-torrinco-400 font-medium' : 'text-gray-700 dark:text-slate-300'}
                `}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-torrinco-600 dark:text-torrinco-400" />
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400 text-center">
              Nenhuma opção encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}
