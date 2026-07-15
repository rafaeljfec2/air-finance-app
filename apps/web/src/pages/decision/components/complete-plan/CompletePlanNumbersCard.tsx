import type { CompletePlanNumbers } from '@/services/completePlanService';

import { CompletePlanInfoHint } from './CompletePlanInfoHint';
import { COMPLETE_PLAN_LABELS } from './copy';
import { formatBrl, formatPercent } from './format';

export interface CompletePlanNumbersCardProps {
  readonly numbers: CompletePlanNumbers;
}

export function CompletePlanNumbersCard({ numbers }: CompletePlanNumbersCardProps) {
  const overTarget = numbers.committedPct > numbers.healthyTargetPct;
  const reduceLegend =
    numbers.reductionNeeded > 0
      ? COMPLETE_PLAN_LABELS.numbersReduceLegendPositive
      : COMPLETE_PLAN_LABELS.numbersReduceLegendZero;

  return (
    <section
      aria-labelledby="cp-numbers-title"
      className="space-y-3 rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <h3
        id="cp-numbers-title"
        className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
      >
        {COMPLETE_PLAN_LABELS.numbersTitle}
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-card p-3 dark:bg-card-dark">
          <div className="flex items-start justify-between gap-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {COMPLETE_PLAN_LABELS.numbersToday}
            </p>
            <CompletePlanInfoHint
              testId="committed-pct-legend"
              ariaLabel={COMPLETE_PLAN_LABELS.numbersInfoToggle}
              content={COMPLETE_PLAN_LABELS.numbersCompositionLegend}
            />
          </div>
          <p
            className={`mt-1 text-lg font-semibold ${
              overTarget ? 'text-red-600 dark:text-red-400' : 'text-text dark:text-text-dark'
            }`}
          >
            {formatPercent(numbers.committedPct)}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formatBrl(numbers.totalCommitted)} / mês
          </p>
        </div>
        <div className="rounded-md bg-card p-3 dark:bg-card-dark">
          <div className="flex items-start justify-between gap-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {COMPLETE_PLAN_LABELS.numbersHealthy}
            </p>
            <CompletePlanInfoHint
              testId="healthy-target-legend"
              ariaLabel={COMPLETE_PLAN_LABELS.numbersInfoToggle}
              content={COMPLETE_PLAN_LABELS.numbersHealthyLegend}
            />
          </div>
          <p className="mt-1 text-lg font-semibold text-primary-600 dark:text-primary-400">
            {formatPercent(numbers.healthyTargetPct)}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">da renda</p>
        </div>
        <div className="rounded-md bg-card p-3 dark:bg-card-dark">
          <div className="flex items-start justify-between gap-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {COMPLETE_PLAN_LABELS.numbersReduce}
            </p>
            <CompletePlanInfoHint
              testId="reduction-needed-legend"
              ariaLabel={COMPLETE_PLAN_LABELS.numbersInfoToggle}
              content={reduceLegend}
            />
          </div>
          <p
            className={`mt-1 text-lg font-semibold ${
              numbers.reductionNeeded > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-primary-600 dark:text-primary-400'
            }`}
          >
            {formatBrl(numbers.reductionNeeded)}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">por mês</p>
        </div>
      </div>
    </section>
  );
}
