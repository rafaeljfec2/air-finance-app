import { forwardRef, SelectHTMLAttributes } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, containerClassName, className, options, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              'block w-full rounded-lg border pl-4 pr-10 py-2.5 text-sm transition-colors',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
              icon && 'pl-10',
              'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            <option value="">Selecione uma opção</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
          >
            <ExclamationCircleIcon className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
