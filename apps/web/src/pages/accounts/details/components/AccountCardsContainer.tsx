import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '@/services/accountService';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { AccountBalanceCard } from './AccountBalanceCard';

interface AccountCardsContainerProps {
  readonly accounts: ReadonlyArray<Account>;
  readonly selectedAccountId: string;
  readonly onAccountSelect: (accountId: string) => void;
  readonly onMenuClick?: () => void;
  readonly onEditAccount?: (account: Account) => void;
  readonly onToggleAutoSync?: (account: Account) => void;
  readonly onDeleteAccount?: (account: Account) => void;
}

const SCROLL_CONFIG = {
  cardWidth: 280,
  gap: 12,
  padding: 16,
} as const;

export function AccountCardsContainer({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onMenuClick,
  onEditAccount,
  onToggleAutoSync,
  onDeleteAccount,
}: Readonly<AccountCardsContainerProps>) {
  const navigate = useNavigate();

  const selectedIndex = useMemo(
    () => accounts.findIndex((acc) => acc.id === selectedAccountId),
    [accounts, selectedAccountId],
  );

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollTo } = useHorizontalScroll(
    accounts.length,
    selectedIndex,
    SCROLL_CONFIG,
  );

  const hasMultipleAccounts = accounts.length > 1;

  const handleBack = () => navigate('/accounts');

  return (
    <div className="bg-background-dark dark:bg-background-dark sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 pt-safe pb-3 min-h-[56px] gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="text-text dark:text-text-dark hover:opacity-80 p-2 transition-opacity bg-card dark:bg-card-dark rounded-full shrink-0 border border-border dark:border-border-dark"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-bold text-text dark:text-text-dark flex-1 text-center">
          Contas Bancárias
        </h1>

        <button
          type="button"
          onClick={onMenuClick}
          className="text-text dark:text-text-dark hover:opacity-80 p-2 transition-opacity bg-card dark:bg-card-dark rounded-full shrink-0 border border-border dark:border-border-dark"
          aria-label="Menu"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="relative pb-4">
        {hasMultipleAccounts && canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollTo('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto px-4 scrollbar-hide scroll-smooth"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {accounts.map((account) => (
            <div key={account.id} style={{ scrollSnapAlign: 'start' }}>
              <AccountBalanceCard
                account={account}
                isSelected={account.id === selectedAccountId}
                onClick={() => onAccountSelect(account.id)}
                onEdit={onEditAccount}
                onToggleAutoSync={onToggleAutoSync}
                onDelete={onDeleteAccount}
              />
            </div>
          ))}
        </div>

        {hasMultipleAccounts && canScrollRight && (
          <button
            type="button"
            onClick={() => scrollTo('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="h-5 w-5 text-text dark:text-text-dark" />
          </button>
        )}
      </div>
    </div>
  );
}
