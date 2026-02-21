import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, children, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={`
              w-full px-4 py-2.5 bg-white dark:bg-slate-900 
              border ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-slate-700'}
              rounded-xl focus:outline-none focus:ring-2 
              ${error ? 'focus:ring-red-500' : 'focus:ring-torrinco-500'}
              focus:border-transparent
              text-gray-900 dark:text-white
              appearance-none cursor-pointer
              transition-all duration-200
              hover:border-gray-300 dark:hover:border-slate-600
              ${icon ? 'pl-10' : 'pl-4'}
              pr-10
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
