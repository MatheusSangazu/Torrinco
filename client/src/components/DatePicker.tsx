import React, { useState, useEffect } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { Calendar as CalendarIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  className?: string;
}

export function DatePicker({ label, value, onChange, required, className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? parseISO(value) : undefined
  );

  // Update internal state when prop changes
  useEffect(() => {
    if (value) {
      const date = parseISO(value);
      if (isValid(date)) {
        setSelectedDate(date);
      }
    }
  }, [value]);

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    } else {
      onChange('');
    }
  };

  const formattedDate = selectedDate && isValid(selectedDate) 
    ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : '';

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
        <span className={`block truncate text-base ${!selectedDate ? 'text-gray-400' : 'text-gray-900 dark:text-white capitalize'}`}>
          {formattedDate || 'Selecione uma data'}
        </span>
        <CalendarIcon className={`w-5 h-5 ${isOpen ? 'text-torrinco-500' : 'text-gray-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
          <style>{`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #7c3aed;
              --rdp-background-color: #f3f4f6;
              margin: 0;
            }
            .rdp-day_selected:not([disabled]) { 
              background-color: var(--rdp-accent-color); 
              color: white;
              font-weight: bold;
            }
            .rdp-day_selected:hover:not([disabled]) { 
              background-color: var(--rdp-accent-color);
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: #f3f4f6;
              color: #1f2937;
            }
            .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: #1e293b;
              color: #e2e8f0;
            }
            .rdp-day_today {
              font-weight: bold;
              color: var(--rdp-accent-color);
            }
            .dark .rdp-caption_label, .dark .rdp-head_cell, .dark .rdp-day {
              color: #e2e8f0;
            }
            .dark .rdp-nav_button {
              color: #94a3b8;
            }
            .rdp-nav_button:hover {
              background-color: #f3f4f6;
            }
            .dark .rdp-nav_button:hover {
              background-color: #1e293b;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={ptBR}
            components={{
              Chevron: (props) => {
                if (props.orientation === 'left') {
                  return <ChevronLeftIcon {...props} className="w-5 h-5" />;
                }
                return <ChevronRightIcon {...props} className="w-5 h-5" />;
              }
            }}
            modifiersClassNames={{
              selected: 'bg-torrinco-600 text-white hover:bg-torrinco-700',
              today: 'font-bold text-torrinco-600'
            }}
          />
        </div>
      )}
    </div>
  );
}
