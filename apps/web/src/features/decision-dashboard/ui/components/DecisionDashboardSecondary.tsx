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
    <section
      aria-label="Secondary context"
      className="border-t border-border/50 pt-3 dark:border-border-dark/50"
    >
      {!expanded ? (
        <button
          type="button"
          onClick={onExpand}
          className="min-h-9 text-sm text-muted-foreground transition-colors hover:text-text dark:hover:text-text-dark"
        >
          Ver um pouco mais →
        </button>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-2.5">
            {cards.map((card) => (
              <li key={card.code} className="space-y-0.5">
                <h3 className="text-sm font-medium text-text dark:text-text-dark">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-snug">{card.summary}</p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onCollapse}
            className="min-h-9 text-sm text-muted-foreground transition-colors hover:text-text dark:hover:text-text-dark"
          >
            Ocultar
          </button>
        </div>
      )}
    </section>
  );
}
