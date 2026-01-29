import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '@/services/accountService';
import { AccountBalanceCard } from './AccountBalanceCard';

interface AccountCardsContainerProps {
  readonly accounts: Account[];
  readonly selectedAccountId: string;
  readonly onAccountSelect: (accountId: string) => void;
  readonly onMenuClick?: () => void;
}

export function AccountCardsContainer({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onMenuClick,
}: AccountCardsContainerProps) {
  const navigate = useNavigate();
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
    const gap = 12;
    const padding = 16;
    const scrollPosition = selectedIndex * (cardWidth + gap) - padding;

    container.scrollTo({
      left: Math.max(0, scrollPosition),
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
    <div className="bg-background-dark dark:bg-background-dark sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 pt-safe pb-3 min-h-[56px] gap-2">
        <button
          type="button"
          onClick={() => navigate('/accounts')}
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
            onClick={() => scroll('left')}
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
              />
            </div>
          ))}
        </div>

        {hasMultipleAccounts && canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
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
