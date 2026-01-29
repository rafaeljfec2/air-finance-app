import { Plus } from 'lucide-react';
import type { Account } from '@/services/accountService';

interface AccountCardsHeaderProps {
  readonly accounts: ReadonlyArray<Account>;
  readonly selectedAccountId: string;
  readonly onAccountSelect: (id: string) => void;
  readonly onAddAccount: () => void;
}

export function AccountCardsHeader({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onAddAccount,
}: Readonly<AccountCardsHeaderProps>) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {accounts.map((account) => {
        const isSelected = account.id === selectedAccountId;

        return (
          <button
            key={account.id}
            type="button"
            onClick={() => onAccountSelect(account.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isSelected
                  ? 'bg-primary-500 text-white'
                  : 'bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            {account.name}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onAddAccount}
        className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-card dark:bg-card-dark text-text-muted dark:text-text-muted-dark border border-dashed border-border dark:border-border-dark hover:border-primary-500 hover:text-primary-500 transition-all"
        aria-label="Adicionar nova conta"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
