import { Clock3, Gauge, Leaf, Wallet } from 'lucide-react';

import { formatCurrency } from '@/utils/formatters';

import type { PeriodReadingHeroMetrics } from '../../hooks/usePeriodReadingHeroMetrics';
import type { PeriodReadingHeadline } from '../../mappers/buildPeriodReadingHeroNarrative';

interface PeriodReadingHeroProps {
  readonly headline: PeriodReadingHeadline;
  readonly explanation: string;
  readonly improvementBanner: string | null;
  readonly metrics: PeriodReadingHeroMetrics;
}

function MetricRow({
  icon: Icon,
  label,
  value,
  valueClassName,
  footer,
}: Readonly<{
  icon: typeof Wallet;
  label: string;
  value: string;
  valueClassName?: string;
  footer?: string;
}>) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={
            valueClassName ??
            'mt-0.5 break-words text-base font-bold leading-snug tabular-nums text-text dark:text-text-dark'
          }
        >
          {value}
        </p>
        {footer !== undefined ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{footer}</p>
        ) : null}
      </div>
    </div>
  );
}

export function PeriodReadingHero({
  headline,
  explanation,
  improvementBanner,
  metrics,
}: Readonly<PeriodReadingHeroProps>) {
  const monthPlan = metrics.monthPlanBalance;
  const monthPlanLabel =
    monthPlan == null ? '—' : `${monthPlan > 0 ? '+' : ''}${formatCurrency(monthPlan)}`;

  return (
    <section
      aria-label="Sua situação hoje"
      className="relative overflow-hidden rounded-2xl border border-border bg-card dark:border-border-dark dark:bg-card-dark"
    >
      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(240px,0.85fr)] lg:items-stretch lg:p-6">
        <div className="relative z-10 flex min-w-0 flex-col justify-center space-y-4">
          <span className="inline-flex w-fit rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:border-border-dark">
            Sua situação hoje
          </span>
          <h2 className="text-2xl font-semibold leading-tight text-text dark:text-text-dark sm:text-3xl">
            {headline.lead}{' '}
            <span className="text-emerald-500 dark:text-emerald-400">{headline.emphasis}</span>
          </h2>
          {explanation.trim() !== '' ? (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{explanation}</p>
          ) : null}
          {improvementBanner != null ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3.5 py-3">
              <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
              <p className="text-sm leading-snug text-text dark:text-text-dark">
                {improvementBanner}
              </p>
            </div>
          ) : null}
        </div>

        <div className="pointer-events-none relative -my-5 hidden min-h-[220px] lg:-my-6 lg:block">
          <img
            src="/images/period-reading-hero.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent dark:from-card-dark" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent dark:from-card-dark" />
        </div>

        <aside className="relative z-10 flex flex-col justify-center rounded-xl border border-border/80 bg-background/80 px-4 py-4 backdrop-blur-sm dark:border-border-dark/80 dark:bg-background-dark/80 sm:px-5 sm:py-5">
          {metrics.isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Carregando métricas…</p>
          ) : (
            <div className="flex flex-col gap-5">
              <MetricRow
                icon={Wallet}
                label="Na conta hoje"
                value={metrics.balanceToday == null ? '—' : formatCurrency(metrics.balanceToday)}
              />
              <MetricRow
                icon={Leaf}
                label="No plano do mês"
                value={monthPlanLabel}
                valueClassName={
                  monthPlan != null && monthPlan > 0
                    ? 'mt-0.5 break-words text-base font-bold leading-snug tabular-nums text-emerald-500 dark:text-emerald-400'
                    : 'mt-0.5 break-words text-base font-bold leading-snug tabular-nums text-text dark:text-text-dark'
                }
              />
              <MetricRow
                icon={Clock3}
                label="Próxima entrada"
                value={
                  metrics.nextReceivable == null
                    ? 'Sem entrada prevista'
                    : `${metrics.nextReceivable.description} · ${formatCurrency(metrics.nextReceivable.value)}`
                }
                footer={metrics.nextReceivableLabel ?? undefined}
              />
            </div>
          )}
          {metrics.isPartial ? (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Algumas métricas não puderam ser carregadas.
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
