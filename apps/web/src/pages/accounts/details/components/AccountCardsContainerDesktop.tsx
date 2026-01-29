import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Account } from '@/services/accountService';
import { AccountBalanceCard } from './AccountBalanceCard';

interface AccountCardsContainerDesktopProps {
  readonly accounts: Account[];
  readonly selectedAccountId: string;
  readonly onAccountSelect: (accountId: string) => void;
}

export function AccountCardsContainerDesktop({
  accounts,
  selectedAccountId,
  onAccountSelect,
}: AccountCardsContainerDesktopProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [accounts]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const selectedIndex = accounts.findIndex((acc) => acc.id === selectedAccountId);
    if (selectedIndex === -1) return;

    const cardWidth = 280;
    const gap = 16;
    const scrollPosition = selectedIndex * (cardWidth + gap);

    container.scrollTo({
      left: Math.max(0, scrollPosition - gap),
      behavior: 'smooth',
    });
  }, [selectedAccountId, accounts]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 292;
    const newPosition =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  const hasMultipleAccounts = accounts.length > 1;

  return (
    <div className="sticky top-0 z-20 bg-background dark:bg-background-dark pt-8 pb-2 lg:pt-6">
      <div className="mx-4 lg:mx-6 ">
        <div className="relative">
          {hasMultipleAccounts && canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center shadow-lg hover:bg-background dark:hover:bg-background-dark transition-colors -ml-2"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-2 pl-1"
            style={{
              scrollSnapType: 'x mandatory',
            }}
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
              onClick={() => scroll('right')}
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
