import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
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
  const TypeIcon = TYPE_OPTIONS.find((opt) => opt.value === form.type)?.icon;

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
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                errors.description && 'border-red-500 focus-visible:ring-red-500',
              )}
            />
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </div>
        </FormField>

        <FormField label="Tipo *" error={errors.type}>
          <Select value={form.type} onValueChange={onTypeChange}>
            <SelectTrigger
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                errors.type && 'border-red-500 focus:ring-red-500',
              )}
            >
              <div className="flex items-center gap-2">
                {TypeIcon && (
                  <TypeIcon className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                )}
                <span>
                  {TYPE_OPTIONS.find((opt) => opt.value === form.type)?.label || 'Selecione...'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
              {TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                errors.value && 'border-red-500 focus-visible:ring-red-500',
              )}
            />
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </div>
        </FormField>

        <FormField label="Categoria *" error={errors.category}>
          <Select value={form.category} onValueChange={onCategoryChange}>
            <SelectTrigger
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                errors.category && 'border-red-500 focus:ring-red-500',
              )}
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                <span>
                  {categories?.find((cat) => cat.id === form.category)?.name || 'Selecione...'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark max-h-56 overflow-y-auto">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                  >
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-categories" disabled>
                  Nenhuma categoria disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Conta *" error={errors.accountId}>
          <Select value={form.accountId} onValueChange={onAccountChange}>
            <SelectTrigger
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                errors.accountId && 'border-red-500 focus:ring-red-500',
              )}
            >
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                <span>
                  {accounts && accounts.length > 0
                    ? accounts.find((acc) => acc.id === form.accountId)?.name || 'Selecione...'
                    : 'Nenhuma conta disponível'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark max-h-56 overflow-y-auto">
              {accounts && accounts.length > 0 ? (
                accounts.map((acc) => (
                  <SelectItem
                    key={acc.id}
                    value={acc.id}
                    className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                  >
                    {acc.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-accounts" disabled>
                  Nenhuma conta disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
}
