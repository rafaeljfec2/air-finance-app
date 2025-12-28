import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

interface DescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export function DescriptionField({
  value,
  onChange,
  onBlur,
  error,
}: Readonly<DescriptionFieldProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-3 sm:p-4 bg-background dark:bg-background-dark">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-text dark:text-text-dark mb-1"
      >
        Descrição <span className="text-red-500">*</span>
      </label>
      <Input
        ref={inputRef}
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Ex: Supermercado, Salário, etc."
        required
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'description-error' : undefined}
        className={cn(
          'bg-card dark:bg-card-dark text-text dark:text-text-dark border placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors',
          error
            ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
            : 'border-border dark:border-border-dark',
        )}
      />
      {error && (
        <span id="description-error" className="text-xs text-red-500 mt-1 block" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
