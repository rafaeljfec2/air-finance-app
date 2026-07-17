import { CreditCard, LineChart, Percent, PieChart } from 'lucide-react';

import type { PeriodReadingBehaviorCard } from '../../mappers/buildPeriodReadingBehaviorCards';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface BehaviorPalette {
  readonly icon: typeof LineChart;
  readonly square: string;
}

const CARD_PALETTE: Readonly<Record<string, BehaviorPalette>> = {
  peaks: {
    icon: LineChart,
    square: 'bg-violet-500/15 text-violet-400',
  },
  'top-category': {
    icon: PieChart,
    square: 'bg-rose-500/15 text-rose-400',
  },
  'card-share': {
    icon: CreditCard,
    square: 'bg-emerald-500/15 text-emerald-400',
  },
  commitment: {
    icon: Percent,
    square: 'bg-rose-500/15 text-rose-400',
  },
};

const FALLBACK_PALETTE: BehaviorPalette = {
  icon: LineChart,
  square: 'bg-slate-500/15 text-slate-400',
};

interface PeriodReadingBehaviorProps {
  readonly cards: readonly PeriodReadingBehaviorCard[];
}

export function PeriodReadingBehavior({ cards }: Readonly<PeriodReadingBehaviorProps>) {
  return (
    <section
      aria-label="Padrões do seu comportamento"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader
        number={6}
        title="Padrões do seu comportamento"
        description="Só fatos do complete-plan — assinaturas e juros ficam para uma próxima entrega."
      />
      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem padrões suficientes neste período.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {cards.map((card) => {
            const palette = CARD_PALETTE[card.id] ?? FALLBACK_PALETTE;
            const Icon = palette.icon;
            return (
              <article
                key={card.id}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-background px-4 py-4 dark:border-border-dark/70 dark:bg-background-dark"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${palette.square}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text dark:text-text-dark">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-text dark:text-text-dark">
                    {card.evidence}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {card.interpretation}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
