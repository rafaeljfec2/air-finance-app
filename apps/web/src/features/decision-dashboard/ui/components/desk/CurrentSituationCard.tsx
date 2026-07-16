import { cn } from '@/lib/utils';

import type { DecisionDashboardCardViewModel } from '../../../mappers/mapDashboardPayloadToViewModel';

interface CurrentSituationCardProps {
  readonly cards: readonly DecisionDashboardCardViewModel[];
  readonly statusLines?: readonly string[];
}

function resolveSituationRows(
  cards: readonly DecisionDashboardCardViewModel[],
  statusLines: readonly string[] | undefined,
): readonly { readonly label: string; readonly value: string }[] {
  if (cards.length > 0) {
    return cards.slice(0, 3).map((card) => ({
      label: card.title,
      value: card.summary,
    }));
  }

  return (statusLines ?? []).slice(0, 3).map((line, index) => ({
    label: `Leitura ${index + 1}`,
    value: line,
  }));
}

export function CurrentSituationCard({ cards, statusLines }: Readonly<CurrentSituationCardProps>) {
  const rows = resolveSituationRows(cards, statusLines);

  return (
    <section
      aria-label="Situação atual"
      className="flex h-full flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-background/50 dark:divide-border-dark dark:border-border-dark dark:bg-background-dark/40"
    >
      {rows.length === 0 ? (
        <div className="px-4 py-3">
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Ainda estamos reunindo as evidências do dia.
          </p>
        </div>
      ) : (
        rows.map((row) => (
          <div
            key={`${row.label}-${row.value}`}
            className="flex flex-1 items-center justify-between gap-3 px-4 py-3"
          >
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
              {row.label}
            </p>
            <p
              className={cn(
                'text-right text-sm font-bold tabular-nums',
                row.value.trim().startsWith('+')
                  ? 'text-emerald-500'
                  : 'text-text dark:text-text-dark',
              )}
            >
              {row.value}
            </p>
          </div>
        ))
      )}
    </section>
  );
}
