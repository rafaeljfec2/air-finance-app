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
    <div className="p-3 bg-background dark:bg-background-dark">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCreditCard ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
        {/* Conta */}
        <div>
          <label
            htmlFor="accountId"
            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
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
              'w-full h-11 bg-card dark:bg-card-dark text-foreground border rounded-xl hover:bg-accent/50 transition-all',
              errors.accountId
                ? 'border-red-500 dark:border-red-500 ring-red-500/20'
                : 'border-border dark:border-border-dark hover:border-primary-400',
            )}
          />
        </div>

        {/* Categoria */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
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
              'w-full h-11 bg-card dark:bg-card-dark text-foreground border rounded-xl hover:bg-accent/50 transition-all',
              errors.categoryId
                ? 'border-red-500 dark:border-red-500 ring-red-500/20'
                : 'border-border dark:border-border-dark hover:border-primary-400',
            )}
          />
        </div>

        {/* Tipo (toggle) - Oculto quando for cartão de crédito */}
        {!isCreditCard && (
          <div>
            <label
              htmlFor="transactionKind"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
            >
              Tipo
            </label>
            <div id="transactionKind" className="flex bg-muted dark:bg-muted/20 p-1 rounded-xl border border-border/50">
              <button
                type="button"
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  transactionKind === 'VARIABLE'
                    ? 'bg-background dark:bg-card text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => onTransactionKindChange('VARIABLE')}
              >
                Variável
              </button>
              <button
                type="button"
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  transactionKind === 'FIXED'
                    ? 'bg-background dark:bg-card text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground',
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
