import React, { useMemo } from 'react';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Account } from '@/services/accountService';
import type { Category } from '@/services/categoryService';
import type { CreateRecurringTransaction } from '@/services/recurringTransactionService';
import { DollarSign, FileText, Tag, Wallet } from 'lucide-react';
import { TYPE_OPTIONS } from '../constants';

interface BasicInfoSectionProps {
  form: CreateRecurringTransaction;
  errors: Record<string, string>;
  valueInput: string;
  categories?: Category[];
  accounts?: Account[];
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange: (value: string) => void;
  onTypeChange: (value: 'Income' | 'Expense') => void;
  onCategoryChange: (value: string) => void;
  onAccountChange: (value: string) => void;
}

export function BasicInfoSection({
  form,
  errors,
  valueInput,
  categories,
  accounts,
  onDescriptionChange,
  onValueChange,
  onTypeChange,
  onCategoryChange,
  onAccountChange,
}: Readonly<BasicInfoSectionProps>) {
  const typeOptions: ComboBoxOption<'Income' | 'Expense'>[] = useMemo(
    () =>
      TYPE_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
      })),
    [],
  );

  const categoryOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      categories?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) ?? [],
    [categories],
  );

  const accountOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      accounts?.map((acc) => ({
        value: acc.id,
        label: acc.name,
      })) ?? [],
    [accounts],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
          Informações Básicas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Descrição *" error={errors.description} className="md:col-span-2">
          <div className="relative">
            <Input
              name="description"
              value={form.description}
              onChange={onDescriptionChange}
              placeholder="Ex: Aluguel, Salário, Internet..."
              required
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                errors.description && 'border-red-500 focus-visible:ring-red-500',
              )}
            />
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400 dark:text-gray-400" />
          </div>
        </FormField>

        <FormField label="Tipo *" error={errors.type}>
          <ComboBox
            options={typeOptions}
            value={form.type}
            onValueChange={(value) => onTypeChange(value ?? 'Income')}
            placeholder="Selecione..."
            error={errors.type}
            renderItem={(option) => {
              const Icon = option.icon;
              return (
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{option.label}</span>
                </div>
              );
            }}
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark',
              errors.type && 'border-red-500',
            )}
          />
        </FormField>

        <FormField label="Valor *" error={errors.value}>
          <div className="relative">
            <Input
              name="value"
              type="text"
              inputMode="decimal"
              value={valueInput}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="R$ 0,00"
              required
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                errors.value && 'border-red-500 focus-visible:ring-red-500',
              )}
            />
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400 dark:text-gray-400" />
          </div>
        </FormField>

        <FormField label="Categoria *" error={errors.category}>
          <ComboBox
            options={categoryOptions}
            value={form.category || null}
            onValueChange={(value) => onCategoryChange(value ?? '')}
            placeholder="Selecione..."
            error={errors.category}
            searchable
            searchPlaceholder="Buscar categoria..."
            icon={Tag}
            emptyMessage="Nenhuma categoria disponível"
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark',
              errors.category && 'border-red-500',
            )}
          />
        </FormField>

        <FormField label="Conta *" error={errors.accountId}>
          <ComboBox
            options={accountOptions}
            value={form.accountId || null}
            onValueChange={(value) => onAccountChange(value ?? '')}
            placeholder="Selecione..."
            error={errors.accountId}
            searchable
            searchPlaceholder="Buscar conta..."
            icon={Wallet}
            emptyMessage="Nenhuma conta disponível"
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark',
              errors.accountId && 'border-red-500',
            )}
          />
        </FormField>
      </div>
    </div>
  );
}
