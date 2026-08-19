import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: ReactNode;
  description?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  containerClassName?: string;
  inputClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, onCheckedChange, containerClassName, inputClassName, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    return (
      <label htmlFor={id} className={clsx('inline-flex cursor-pointer items-start gap-3 text-sm text-gray-700 dark:text-slate-200', props.disabled && 'cursor-not-allowed opacity-60', containerClassName)}>
        <span className="relative mt-0.5 h-5 w-5 shrink-0">
          <input {...props} ref={ref} id={id} type="checkbox" onChange={(event) => onCheckedChange?.(event.target.checked)} className={clsx('peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 bg-white outline-none transition duration-150 hover:border-torrinco-400 checked:border-torrinco-600 checked:bg-torrinco-600 focus-visible:ring-2 focus-visible:ring-torrinco-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:checked:border-torrinco-500 dark:checked:bg-torrinco-500 dark:ring-offset-slate-800', props.disabled && 'cursor-not-allowed', inputClassName, className)} />
          <Check aria-hidden="true" strokeWidth={3} className="pointer-events-none absolute inset-0 h-5 w-5 scale-75 text-white opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100" />
        </span>
        {(label || description) && <span className="min-w-0">{label && <span className="block font-medium">{label}</span>}{description && <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-slate-400">{description}</span>}</span>}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
