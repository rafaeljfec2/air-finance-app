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
    <div className="p-3 bg-background dark:bg-background-dark">
      <label
        htmlFor="description"
        className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
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
        placeholder="Ex: Supermercado, Salário, Restaurante..."
        required
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'description-error' : undefined}
          className={cn(
          'bg-background dark:bg-background-dark text-foreground border-2 placeholder:text-muted-foreground transition-all min-h-[44px] rounded-lg text-base font-medium',
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-border dark:border-border-dark focus-visible:border-primary-500 focus-visible:ring-primary-500',
        )}
      />
      {error && (
        <span id="description-error" className="text-xs text-red-500 mt-1 block font-medium ml-1">
          {error}
        </span>
      )}
    </div>
  );
}
