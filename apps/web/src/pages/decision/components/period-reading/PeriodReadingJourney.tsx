import { ClipboardList, Gauge, PiggyBank, Receipt, Swords } from 'lucide-react';

import type { PeriodReadingJourneyStage } from '../../mappers/buildPeriodReadingJourney';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface StagePalette {
  readonly icon: typeof PiggyBank;
  readonly circle: string;
  readonly value: string;
}

const STAGE_PALETTE: Readonly<Record<string, StagePalette>> = {
  income: {
    icon: PiggyBank,
    circle: 'bg-emerald-500/15 text-emerald-500',
    value: 'text-emerald-500 dark:text-emerald-400',
  },
  commitments: {
    icon: Receipt,
    circle: 'bg-rose-500/15 text-rose-500',
    value: 'text-rose-500 dark:text-rose-400',
  },
  installments: {
    icon: ClipboardList,
    circle: 'bg-amber-500/15 text-amber-500',
    value: 'text-amber-500 dark:text-amber-400',
  },
  slack: {
    icon: Swords,
    circle: 'bg-violet-500/15 text-violet-500',
    value: 'text-text dark:text-text-dark',
  },
  pressure: {
    icon: Gauge,
    circle: 'bg-rose-500/15 text-rose-500',
    value: 'text-text dark:text-text-dark',
  },
};

const FALLBACK_PALETTE: StagePalette = {
  icon: PiggyBank,
  circle: 'bg-slate-500/15 text-slate-400',
  value: 'text-text dark:text-text-dark',
};

interface PeriodReadingJourneyProps {
  readonly stages: readonly PeriodReadingJourneyStage[];
}

export function PeriodReadingJourney({ stages }: Readonly<PeriodReadingJourneyProps>) {
  return (
    <section
      aria-labelledby="pr-journey-title"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader
        number={1}
        title="Como chegamos aqui?"
        description="Leitura factual do fluxo do período — sem culpa."
      />
      <ol className="flex flex-col gap-5 md:flex-row md:gap-0">
        {stages.map((stage, index) => {
          const palette = STAGE_PALETTE[stage.id] ?? FALLBACK_PALETTE;
          const Icon = palette.icon;
          const isLast = index === stages.length - 1;
          return (
            <li
              key={stage.id}
              className={`flex min-w-0 items-start gap-4 md:flex-col md:gap-0 ${
                isLast ? 'md:w-auto' : 'md:min-w-0 md:flex-1'
              }`}
            >
              <div className="flex items-center gap-3 md:w-full md:pr-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${palette.circle}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                {!isLast ? (
                  <span className="relative hidden min-w-0 flex-1 items-center md:flex" aria-hidden>
                    <span className="h-px w-full border-t border-dashed border-muted-foreground/40" />
                    <span className="absolute right-0 -mt-px h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-r border-t border-muted-foreground/60" />
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 md:mt-3">
                <p className="text-sm font-semibold text-text dark:text-text-dark">{stage.title}</p>
                <p className={`mt-0.5 text-base font-semibold tabular-nums ${palette.value}`}>
                  {stage.valueLabel}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stage.subtitle}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <span id="pr-journey-title" className="sr-only">
        Como chegamos aqui?
      </span>
    </section>
  );
}
