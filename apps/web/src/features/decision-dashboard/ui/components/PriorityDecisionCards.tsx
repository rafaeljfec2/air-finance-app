import type { DecisionDashboardCardViewModel } from '../../mappers/mapDashboardPayloadToViewModel';

interface PriorityDecisionCardsProps {
  readonly cards: readonly DecisionDashboardCardViewModel[];
}

function toEvidenceLine(card: DecisionDashboardCardViewModel): string {
  const raw = card.summary.trim() || card.title.trim();
  return raw.replace(/\bo ciclo\b/gi, 'o mês').replace(/\bpressão do ciclo\b/gi, 'pressão do mês');
}

function isFactReadout(cards: readonly DecisionDashboardCardViewModel[]): boolean {
  return cards.every(
    (card) =>
      card.title.trim().length > 0 &&
      !/^evidência\s*\d*$/i.test(card.title.trim()) &&
      card.summary.trim().length > 0 &&
      card.summary.trim().length <= 80,
  );
}

export function PriorityDecisionCards({ cards }: PriorityDecisionCardsProps) {
  if (cards.length === 0) {
    return null;
  }

  if (isFactReadout(cards)) {
    return (
      <section aria-label="Conclusion evidence" className="space-y-3">
        <p className="text-sm text-muted-foreground">Por quê</p>
        <p className="sr-only">Chegamos a essa conclusão porque…</p>
        <ul className="overflow-hidden rounded-xl border border-border/70 divide-y divide-border/60 dark:border-border-dark/70 dark:divide-border-dark/60">
          {cards.map((card) => (
            <li
              key={card.code}
              className="flex flex-col gap-0.5 px-3.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.title}
              </p>
              <p className="text-sm sm:text-base font-semibold text-text dark:text-text-dark text-pretty sm:text-right">
                {card.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-label="Conclusion evidence" className="space-y-3">
      <p className="text-sm text-muted-foreground">Por quê</p>
      <p className="sr-only">Chegamos a essa conclusão porque…</p>
      <ul className="flex flex-col gap-2.5">
        {cards.map((card) => (
          <li key={card.code} className="flex gap-3 items-start">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400/80 dark:bg-primary-500/70"
              aria-hidden
            />
            <p className="text-sm text-text/90 dark:text-text-dark/90 leading-relaxed">
              {toEvidenceLine(card)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
