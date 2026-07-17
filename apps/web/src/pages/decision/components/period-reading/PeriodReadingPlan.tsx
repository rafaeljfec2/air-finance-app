import { formatCurrency } from '@/utils/formatters';

import type { PeriodReadingPlanStep } from '../../mappers/buildPeriodReadingPlanSteps';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface StepPalette {
  readonly surface: string;
  readonly circle: string;
  readonly title: string;
  readonly dot: string;
}

const STEP_PALETTE: Readonly<Record<PeriodReadingPlanStep['tone'], StepPalette>> = {
  critical: {
    surface: 'border-rose-500/20 bg-rose-500/[0.04]',
    circle: 'bg-rose-500/15 text-rose-500',
    title: 'text-rose-500 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  attention: {
    surface: 'border-amber-500/20 bg-amber-500/[0.04]',
    circle: 'bg-amber-500/15 text-amber-500',
    title: 'text-amber-500 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  positive: {
    surface: 'border-emerald-500/20 bg-emerald-500/[0.04]',
    circle: 'bg-emerald-500/15 text-emerald-500',
    title: 'text-emerald-500 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
};

const STEP_TAGLINE: Readonly<Record<PeriodReadingPlanStep['number'], string>> = {
  1: 'Estabilizar o mês atual.',
  2: 'Reduzir a pressão financeira.',
  3: 'Aumentar sua folga mensal.',
};

interface PeriodReadingPlanProps {
  readonly steps: readonly PeriodReadingPlanStep[];
  readonly reductionNeeded: number;
  readonly targetCommitted: number;
}

export function PeriodReadingPlan({
  steps,
  reductionNeeded,
  targetCommitted,
}: Readonly<PeriodReadingPlanProps>) {
  return (
    <section
      aria-label="O plano para recuperar sua liberdade"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader
        number={3}
        title="O plano para recuperar sua liberdade"
        description="Leitura do plano já existente — não é uma nova decisão do dia."
      />
      <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(200px,0.85fr)]">
        {steps.map((step) => {
          const palette = STEP_PALETTE[step.tone];
          return (
            <article key={step.number} className={`rounded-xl border px-4 py-4 ${palette.surface}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${palette.circle}`}
                >
                  {step.number}
                </span>
                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold ${palette.title}`}>{step.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {STEP_TAGLINE[step.number]}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-text dark:text-text-dark">
                {step.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${palette.dot}`}
                      aria-hidden
                    />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
        <aside className="rounded-xl border border-border/70 bg-background px-4 py-4 dark:border-border-dark/70 dark:bg-background-dark">
          <p className="text-sm font-semibold text-text dark:text-text-dark">Seu compromisso</p>
          <p className="mt-2 text-sm leading-snug text-muted-foreground">
            Em cerca de 90 dias, o comprometimento mensal pode se aproximar de
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-500 dark:text-emerald-400">
            {formatCurrency(targetCommitted)}
          </p>
          {reductionNeeded > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Redução sugerida no período: {formatCurrency(reductionNeeded)}/mês
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Comprometimento já dentro da faixa saudável do plano.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
