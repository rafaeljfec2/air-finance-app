import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import { useHorizontalScroll } from '@/pages/credit-cards/bills/hooks/useHorizontalScroll';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

import { ConnectOpenFinanceCard } from './ConnectOpenFinanceCard';
import { OfCreditCardVisual } from './OfCreditCardVisual';

interface OfCardsContainerProps {
  readonly creditCards: ReadonlyArray<OpenFinanceCreditCard>;
  readonly selectedCardId: string;
  readonly onCardSelect: (cardId: string) => void;
}

const SCROLL_CONFIG = {
  cardWidth: 240,
  gap: 12,
  padding: 12,
} as const;

export function OfCardsContainer({
  creditCards,
  selectedCardId,
  onCardSelect,
}: Readonly<OfCardsContainerProps>) {
  const selectedIndex = useMemo(
    () => creditCards.findIndex((card) => card.id === selectedCardId),
    [creditCards, selectedCardId],
  );

  const totalItems = creditCards.length + 1;

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollTo } = useHorizontalScroll(
    totalItems,
    selectedIndex >= 0 ? selectedIndex + 1 : 0,
    SCROLL_CONFIG,
  );

  const hasMultipleItems = totalItems > 1;

  return (
    <div className="relative z-0 bg-background pb-1 pt-4 dark:bg-background-dark lg:pt-4">
      <div className="mx-4 lg:mx-6">
        <div className="relative">
          {hasMultipleItems && canScrollLeft ? (
            <button
              type="button"
              onClick={() => scrollTo('left')}
              className="absolute -ml-2 left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-background dark:border-border-dark dark:bg-card-dark dark:hover:bg-background-dark"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
            </button>
          ) : null}

          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth py-1.5 pl-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div style={{ scrollSnapAlign: 'start' }}>
              <ConnectOpenFinanceCard />
            </div>
            {creditCards.map((card) => (
              <div key={card.id} style={{ scrollSnapAlign: 'start' }}>
                <OfCreditCardVisual
                  card={card}
                  isSelected={card.id === selectedCardId}
                  onClick={() => onCardSelect(card.id)}
                />
              </div>
            ))}
          </div>

          {hasMultipleItems && canScrollRight ? (
            <button
              type="button"
              onClick={() => scrollTo('right')}
              className="absolute -mr-2 right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-background dark:border-border-dark dark:bg-card-dark dark:hover:bg-background-dark"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
