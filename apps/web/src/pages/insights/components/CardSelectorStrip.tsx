import { CreditCard as CreditCardIcon } from 'lucide-react';
import type { CreditCard } from '@/services/creditCardService';

interface CardSelectorStripProps {
  readonly cards: readonly CreditCard[];
  readonly selectedCardId: string;
  readonly onSelect: (cardId: string) => void;
  readonly isLoading?: boolean;
}

function CardSelectorSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {['skeleton-a', 'skeleton-b', 'skeleton-c'].map((id) => (
        <div
          key={id}
          className="animate-pulse shrink-0 h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"
        />
      ))}
    </div>
  );
}

export function CardSelectorStrip({
  cards,
  selectedCardId,
  onSelect,
  isLoading = false,
}: CardSelectorStripProps) {
  if (isLoading) return <CardSelectorSkeleton />;

  if (cards.length === 0) {
    return (
      <p className="text-xs text-text-muted dark:text-text-muted-dark py-2">
        Nenhum cartão cadastrado.
      </p>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {cards.map((card) => {
        const isSelected = card.id === selectedCardId;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            className={`
              shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left
              ${
                isSelected
                  ? 'border-violet-500 bg-violet-500/10 dark:bg-violet-500/20 shadow-sm'
                  : 'border-border dark:border-border-dark bg-card dark:bg-card-dark hover:border-violet-500/50'
              }
            `}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${card.color}20` }}
            >
              <CreditCardIcon className="h-3 w-3" style={{ color: card.color }} />
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                isSelected
                  ? 'text-violet-700 dark:text-violet-300'
                  : 'text-text dark:text-text-dark'
              }`}
            >
              {card.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
