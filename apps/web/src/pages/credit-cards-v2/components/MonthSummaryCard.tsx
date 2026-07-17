import { formatCurrency } from '@/utils/formatters';

import type { CreditCardsKpis } from '../mappers/buildCreditCardsKpis';

interface MonthSummaryCardProps {
  readonly kpis: CreditCardsKpis;
  readonly referenceLabel: string;
}

const DONUT_SIZE = 120;
const DONUT_STROKE = 12;
const RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function LegendRow({
  dotClassName,
  label,
  value,
}: Readonly<{ dotClassName: string; label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} aria-hidden />
        <span className="truncate text-xs text-muted-foreground">{label}</span>
      </span>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-text dark:text-text-dark">
        {value}
      </span>
    </div>
  );
}

function formatOrDash(value: number | null): string {
  return value === null ? '—' : formatCurrency(value);
}

export function MonthSummaryCard({ kpis, referenceLabel }: Readonly<MonthSummaryCardProps>) {
  const percent = kpis.usagePercent ?? 0;
  const usedArc = (Math.min(100, Math.max(0, percent)) / 100) * CIRCUMFERENCE;

  return (
    <section
      aria-label="Resumo do mês"
      className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
    >
      <header className="flex items-baseline gap-1.5">
        <h2 className="text-sm font-semibold text-text dark:text-text-dark">Resumo do mês</h2>
        <span className="text-[10px] text-muted-foreground">({referenceLabel})</span>
      </header>

      <div className="mt-3 flex items-center gap-4">
        <div className="relative shrink-0" aria-hidden>
          <svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}>
            <circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={DONUT_STROKE}
              className="stroke-border dark:stroke-border-dark"
            />
            <circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={DONUT_STROKE}
              strokeLinecap="round"
              strokeDasharray={`${usedArc} ${CIRCUMFERENCE - usedArc}`}
              transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
              className="stroke-emerald-500 transition-all duration-500 dark:stroke-emerald-400"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold tabular-nums text-text dark:text-text-dark">
              {kpis.usagePercent === null ? '—' : `${kpis.usagePercent}%`}
            </span>
            <span className="text-[10px] text-muted-foreground">utilizado</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <LegendRow
            dotClassName="bg-emerald-500 dark:bg-emerald-400"
            label="Utilizado"
            value={formatOrDash(kpis.limitUsed)}
          />
          <LegendRow
            dotClassName="bg-blue-500 dark:bg-blue-400"
            label="Disponível"
            value={formatOrDash(kpis.limitAvailable)}
          />
          <LegendRow
            dotClassName="bg-muted-foreground/50"
            label="Limite total"
            value={formatOrDash(kpis.limitTotal)}
          />
        </div>
      </div>
    </section>
  );
}
