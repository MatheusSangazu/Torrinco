import React, { useState, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (time: string) => void;
  required?: boolean;
  className?: string;
}

export function TimePicker({ label, value, onChange, required, className = '' }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const formatTime = (h: string, m: string): string => {
    if (!h || !m) return '';
    const hour = h.padStart(2, '0');
    const minute = m.padStart(2, '0');
    return `${hour}:${minute}`;
  };

  const handleHourChange = (delta: number) => {
    let newHour = parseInt(hours || '0') + delta;
    if (newHour < 0) newHour = 23;
    if (newHour > 23) newHour = 0;
    const newHourStr = newHour.toString().padStart(2, '0');
    setHours(newHourStr);
    onChange(formatTime(newHourStr, minutes));
  };

  const handleMinuteChange = (delta: number) => {
    let newMinute = parseInt(minutes || '0') + delta;
    if (newMinute < 0) newMinute = 59;
    if (newMinute > 59) newMinute = 0;
    const newMinuteStr = newMinute.toString().padStart(2, '0');
    setMinutes(newMinuteStr);
    onChange(formatTime(hours, newMinuteStr));
  };

  const displayTime = value || 'Selecione um horário';

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
        <span className={`block truncate text-base ${!value ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {displayTime}
        </span>
        <Clock className={`w-5 h-5 ${isOpen ? 'text-torrinco-500' : 'text-gray-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => handleHourChange(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="w-16 h-16 flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-700">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hours || '00'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleHourChange(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <span className="text-3xl font-bold text-gray-900 dark:text-white">:</span>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => handleMinuteChange(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="w-16 h-16 flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-700">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {minutes || '00'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleMinuteChange(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-torrinco-600 hover:bg-torrinco-700 text-white rounded-xl transition-colors font-medium text-sm"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
