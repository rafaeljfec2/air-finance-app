import { Calculator, CircleDollarSign, ReceiptText } from 'lucide-react';

import { formatCurrency } from '@/utils/formatters';

import type { PeriodReadingPressureCard } from '../../mappers/buildPeriodReadingPressure';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface CardPalette {
  readonly icon: typeof CircleDollarSign;
  readonly surface: string;
  readonly iconCircle: string;
  readonly title: string;
  readonly bar: string;
}

const CARD_PALETTE: Readonly<Record<string, CardPalette>> = {
  installments: {
    icon: CircleDollarSign,
    surface: 'border-rose-500/25 bg-rose-500/[0.07]',
    iconCircle: 'bg-rose-500/15 text-rose-500',
    title: 'text-rose-500 dark:text-rose-400',
    bar: 'bg-rose-500',
  },
  variable: {
    icon: ReceiptText,
    surface: 'border-amber-500/25 bg-amber-500/[0.07]',
    iconCircle: 'bg-amber-500/15 text-amber-500',
    title: 'text-amber-500 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
  free: {
    icon: Calculator,
    surface: 'border-violet-500/25 bg-violet-500/[0.07]',
    iconCircle: 'bg-violet-500/15 text-violet-500',
    title: 'text-violet-500 dark:text-violet-400',
    bar: 'bg-violet-500',
  },
};

const FALLBACK_PALETTE: CardPalette = {
  icon: CircleDollarSign,
  surface: 'border-border/70 bg-background dark:border-border-dark/70 dark:bg-background-dark',
  iconCircle: 'bg-slate-500/15 text-slate-400',
  title: 'text-muted-foreground',
  bar: 'bg-slate-500',
};

interface PeriodReadingPressureProps {
  readonly cards: readonly PeriodReadingPressureCard[];
}

export function PeriodReadingPressure({ cards }: Readonly<PeriodReadingPressureProps>) {
  return (
    <section
      aria-label="Onde está a pressão?"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader
        number={2}
        title="Onde está a pressão?"
        description="Percentuais já contratados do plano — não são score."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const palette = CARD_PALETTE[card.id] ?? FALLBACK_PALETTE;
          const Icon = palette.icon;
          const pct = card.percentOfIncome;
          const width = pct == null ? 0 : Math.min(100, Math.max(0, Math.round(pct * 100)));
          return (
            <article key={card.id} className={`rounded-xl border px-4 py-4 ${palette.surface}`}>
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${palette.iconCircle}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className={`text-sm font-semibold ${palette.title}`}>{card.title}</p>
              </div>
              <p className="mt-3 text-xl font-bold tabular-nums text-text dark:text-text-dark">
                {formatCurrency(card.amount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {pct == null ? '—' : `${(pct * 100).toFixed(1).replace('.', ',')}% da renda`}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/70 dark:bg-white/10">
                <div
                  className={`h-full rounded-full ${palette.bar}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
