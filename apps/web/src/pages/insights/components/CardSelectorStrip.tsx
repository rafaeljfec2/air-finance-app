import { CreditCard as CreditCardIcon } from 'lucide-react';
import type { CreditCard } from '@/services/creditCardService';
import type { DecisionState } from '@/components/insights/InsightRenderers';

interface CardSelectorStripProps {
  readonly cards: readonly CreditCard[];
  readonly selectedCardId: string;
  readonly onSelect: (cardId: string) => void;
  readonly isLoading?: boolean;
  readonly cardStates?: Readonly<Record<string, DecisionState>>;
}

const STATUS_DOT_COLOR: Record<DecisionState, string> = {
  'all-clear': 'bg-emerald-400',
  attention: 'bg-amber-400',
  risk: 'bg-red-400',
};

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
  cardStates,
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
        const cardState = cardStates?.[card.id];

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            className={`
              shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left
              ${
                isSelected
                  ? 'shadow-sm'
                  : 'border-border dark:border-border-dark bg-card dark:bg-card-dark hover:border-border-dark/30 dark:hover:border-border/30'
              }
            `}
            style={
              isSelected
                ? {
                    borderColor: card.color,
                    backgroundColor: `${card.color}10`,
                  }
                : undefined
            }
          >
            <div className="relative">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <CreditCardIcon className="h-3 w-3" style={{ color: card.color }} />
              </div>
              {cardState && (
                <span
                  className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card dark:ring-card-dark ${STATUS_DOT_COLOR[cardState]}`}
                />
              )}
            </div>
            <span className="text-xs font-medium whitespace-nowrap text-text dark:text-text-dark">
              {card.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
