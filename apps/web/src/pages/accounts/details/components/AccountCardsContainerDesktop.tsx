import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Account } from '@/services/accountService';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { AccountBalanceCard } from './AccountBalanceCard';

interface AccountCardsContainerDesktopProps {
  readonly accounts: ReadonlyArray<Account>;
  readonly selectedAccountId: string;
  readonly onAccountSelect: (accountId: string) => void;
}

const SCROLL_CONFIG = {
  cardWidth: 280,
  gap: 12,
  padding: 12,
} as const;

export function AccountCardsContainerDesktop({
  accounts,
  selectedAccountId,
  onAccountSelect,
}: Readonly<AccountCardsContainerDesktopProps>) {
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

  return (
    <div className="sticky top-0 z-20 bg-background dark:bg-background-dark pt-8 pb-2 lg:pt-6">
      <div className="mx-4 lg:mx-6">
        <div className="relative">
          {hasMultipleAccounts && canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTo('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors -ml-2"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-2 pl-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {accounts.map((account) => (
              <div key={account.id} style={{ scrollSnapAlign: 'start' }}>
                <AccountBalanceCard
                  account={account}
                  isSelected={account.id === selectedAccountId}
                  onClick={() => onAccountSelect(account.id)}
                />
              </div>
            ))}
          </div>

          {hasMultipleAccounts && canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTo('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors -mr-2"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="h-5 w-5 text-text dark:text-text-dark" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
