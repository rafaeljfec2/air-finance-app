import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import type { Account, Category } from '@/types/transaction';
import { cn } from '@/lib/utils';

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
  const selectedAccountName = accountId
    ? accounts.find((acc) => acc.id === accountId)?.name ?? 'Selecione uma conta'
    : 'Selecione uma conta';

  const selectedCategoryName = categoryId
    ? categories.find((cat) => cat.id === categoryId)?.name ?? 'Selecione uma categoria'
    : 'Selecione uma categoria';

  return (
    <div className="p-4 sm:p-6 bg-background dark:bg-background-dark">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Conta */}
        <div>
          <label
            htmlFor="accountId"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Conta
          </label>
          <Select value={accountId} onValueChange={onAccountChange}>
            <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
              <div className="px-3 py-2">{selectedAccountName}</div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
              {Array.isArray(accounts) &&
                accounts.map((account) => (
                  <SelectItem
                    key={account.id}
                    value={account.id}
                    className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                  >
                    {account.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.accountId && (
            <span className="text-xs text-red-500 mt-1 block">{errors.accountId}</span>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Categoria
          </label>
          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
              <div className="px-3 py-2">{selectedCategoryName}</div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <span className="text-xs text-red-500 mt-1 block">{errors.categoryId}</span>
          )}
        </div>

        {/* Tipo (toggle) */}
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
                transactionKind === 'FIXED'
                  ? 'bg-card text-primary-500 border-primary-500 shadow'
                  : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-400',
              )}
              onClick={() => onTransactionKindChange('FIXED')}
            >
              Fixa
            </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}

