import { Check } from 'lucide-react';

import type { DecisionDashboardCardViewModel } from '../../mappers/mapDashboardPayloadToViewModel';

interface PriorityDecisionCardsProps {
  readonly cards: readonly DecisionDashboardCardViewModel[];
}

function toEvidenceLine(card: DecisionDashboardCardViewModel): string {
  const raw = card.summary.trim() || card.title.trim();
  return raw.replace(/\bo ciclo\b/gi, 'o mês').replace(/\bpressão do ciclo\b/gi, 'pressão do mês');
}

export function PriorityDecisionCards({ cards }: PriorityDecisionCardsProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section aria-label="Conclusion evidence" className="space-y-2.5">
      <p className="text-sm text-muted-foreground">Por quê</p>
      <p className="sr-only">Chegamos a essa conclusão porque…</p>
      <ul className="flex flex-col gap-2 sm:gap-2.5">
        {cards.map((card) => (
          <li
            key={card.code}
            className="flex gap-2.5 items-start rounded-lg bg-background/60 dark:bg-background-dark/40 px-3 py-2"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400"
              aria-hidden
            />
            <p className="text-sm text-text dark:text-text-dark leading-snug">
              {toEvidenceLine(card)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
