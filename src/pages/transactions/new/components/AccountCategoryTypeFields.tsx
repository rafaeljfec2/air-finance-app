import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import type { Category } from '@/types/transaction';
import { useMemo } from 'react';

interface AccountCategoryTypeFieldsProps {
  accounts: Account[];
  categories: Category[];
  accountId: string;
  categoryId: string;
  transactionKind: 'FIXED' | 'VARIABLE';
  errors: Record<string, string>;
  onAccountChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTransactionKindChange: (kind: 'FIXED' | 'VARIABLE') => void;
}

export function AccountCategoryTypeFields({
  accounts,
  categories,
  accountId,
  categoryId,
  transactionKind,
  errors,
  onAccountChange,
  onCategoryChange,
  onTransactionKindChange,
}: Readonly<AccountCategoryTypeFieldsProps>) {
  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.id === accountId),
    [accounts, accountId],
  );

  const isCreditCard = selectedAccount?.type === 'credit_card';

  const accountOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
    [accounts],
  );

  const categoryOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  );

  return (
    <div className="p-3 sm:p-4 bg-background dark:bg-background-dark">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${isCreditCard ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3`}
      >
        {/* Conta */}
        <div>
          <label
            htmlFor="accountId"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Conta <span className="text-red-500">*</span>
          </label>
          <ComboBox
            options={accountOptions}
            value={accountId || null}
            onValueChange={(value) => onAccountChange(value ?? '')}
            placeholder="Selecione uma conta"
            error={errors.accountId}
            searchable
            searchPlaceholder="Buscar conta..."
            className={cn(
              'w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border hover:bg-background dark:hover:bg-background-dark',
              errors.accountId
                ? 'border-red-500 dark:border-red-500'
                : 'border-border dark:border-border-dark',
            )}
          />
        </div>

        {/* Categoria */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Categoria <span className="text-red-500">*</span>
          </label>
          <ComboBox
            options={categoryOptions}
            value={categoryId || null}
            onValueChange={(value) => onCategoryChange(value ?? '')}
            placeholder="Selecione uma categoria"
            error={errors.categoryId}
            searchable
            searchPlaceholder="Buscar categoria..."
            className={cn(
              'w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border hover:bg-background dark:hover:bg-background-dark',
              errors.categoryId
                ? 'border-red-500 dark:border-red-500'
                : 'border-border dark:border-border-dark',
            )}
          />
        </div>

        {/* Tipo (toggle) - Oculto quando for cartão de crédito */}
        {!isCreditCard && (
          <div>
            <label
              htmlFor="transactionKind"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
            >
              Tipo
            </label>
            <div id="transactionKind" className="flex gap-2">
              <button
                type="button"
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg border font-medium transition-colors',
                  transactionKind === 'VARIABLE'
                    ? 'bg-card text-primary-500 border-primary-500 shadow'
                    : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-400',
                )}
                onClick={() => onTransactionKindChange('VARIABLE')}
              >
                Variável
              </button>
              <button
                type="button"
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg border font-medium transition-colors',
                  transactionKind === 'FIXED'
                    ? 'bg-card text-primary-500 border-primary-500 shadow'
                    : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-400',
                )}
                onClick={() => onTransactionKindChange('FIXED')}
              >
                Recorrente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
