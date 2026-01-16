import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { CreateAccount } from '@/services/accountService';
import { Hash } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface BankingFieldsSectionProps {
  form: CreateAccount;
  errors: Record<string, string>;
  onFieldChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function BankingFieldsSection({
  form,
  errors,
  onFieldChange,
}: Readonly<BankingFieldsSectionProps>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Hash className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
          Dados Bancários
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="Agência *" error={errors.agency}>
          <Input
            name="agency"
            value={form.agency ?? ''}
            onChange={onFieldChange}
            placeholder="0000"
            required
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all',
              errors.agency && 'border-red-500 focus-visible:ring-red-500',
            )}
          />
        </FormField>

        <FormField label="Número da conta *" error={errors.accountNumber}>
          <Input
            name="accountNumber"
            value={form.accountNumber ?? ''}
            onChange={onFieldChange}
            placeholder="00000-0"
            required
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all',
              errors.accountNumber && 'border-red-500 focus-visible:ring-red-500',
            )}
          />
        </FormField>
      </div>
    </div>
  );
}
