import type { DecisionDashboardCardViewModel } from '../../mappers/mapDashboardPayloadToViewModel';

interface DecisionDashboardSecondaryProps {
  readonly cards: readonly DecisionDashboardCardViewModel[];
  readonly expanded: boolean;
  readonly onExpand: () => void;
  readonly onCollapse: () => void;
}

export function DecisionDashboardSecondary({
  cards,
  expanded,
  onExpand,
  onCollapse,
}: DecisionDashboardSecondaryProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section aria-label="Secondary context" className="space-y-2">
      {!expanded ? (
        <button
          type="button"
          onClick={onExpand}
          className="min-h-9 text-xs text-muted-foreground hover:text-text dark:hover:text-text-dark transition-colors"
        >
          Ver um pouco mais →
        </button>
      ) : (
        <div className="max-h-28 overflow-y-auto space-y-2 pr-1">
          <ul className="space-y-2">
            {cards.map((card) => (
              <li key={card.code} className="space-y-0.5">
                <h3 className="text-xs font-medium text-text dark:text-text-dark">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{card.summary}</p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onCollapse}
            className="min-h-9 text-xs text-muted-foreground hover:text-text dark:hover:text-text-dark transition-colors"
          >
            Ocultar
          </button>
        </div>
      )}
    </section>
  );
}
