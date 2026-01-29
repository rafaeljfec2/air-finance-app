import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CreditCard } from '@/services/creditCardService';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { CreditCardBalanceCard } from './CreditCardBalanceCard';
import { AddCreditCardCard } from './AddCreditCardCard';

interface CreditCardCardsContainerProps {
  readonly creditCards: ReadonlyArray<CreditCard>;
  readonly selectedCardId: string;
  readonly onCardSelect: (cardId: string) => void;
  readonly onEditCard?: (card: CreditCard) => void;
  readonly onDeleteCard?: (card: CreditCard) => void;
  readonly onAddCard?: () => void;
  readonly cardLimitsUsed?: Record<string, number>;
}

const SCROLL_CONFIG = {
  cardWidth: 280,
  gap: 12,
  padding: 12,
} as const;

export function CreditCardCardsContainer({
  creditCards,
  selectedCardId,
  onCardSelect,
  onEditCard,
  onDeleteCard,
  onAddCard,
  cardLimitsUsed = {},
}: Readonly<CreditCardCardsContainerProps>) {
  const selectedIndex = useMemo(
    () => creditCards.findIndex((card) => card.id === selectedCardId),
    [creditCards, selectedCardId],
  );

  const totalItems = onAddCard ? creditCards.length + 1 : creditCards.length;

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollTo } = useHorizontalScroll(
    totalItems,
    selectedIndex,
    SCROLL_CONFIG,
  );

  const hasMultipleItems = totalItems > 1;

  return (
    <div className="sticky top-0 z-20 bg-background dark:bg-background-dark pt-8 pb-2 lg:pt-6">
      <div className="mx-4 lg:mx-6">
        <div className="relative">
          {hasMultipleItems && canScrollLeft && (
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
            {onAddCard && (
              <div style={{ scrollSnapAlign: 'start' }}>
                <AddCreditCardCard onClick={onAddCard} />
              </div>
            )}
            {creditCards.map((card) => (
              <div key={card.id} style={{ scrollSnapAlign: 'start' }}>
                <CreditCardBalanceCard
                  card={card}
                  isSelected={card.id === selectedCardId}
                  onClick={() => onCardSelect(card.id)}
                  limitUsed={cardLimitsUsed[card.id] ?? 0}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                />
              </div>
            ))}
          </div>

          {hasMultipleItems && canScrollRight && (
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
