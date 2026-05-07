import { Gauge } from 'lucide-react';

import type { CompletePlanVariableSpending } from '@/services/completePlanService';

import { COMPLETE_PLAN_LABELS } from './copy';
import { formatBrl, formatPercent, formatSignedOneDecimalPercent } from './format';

export interface CompletePlanVariableSpendingCardProps {
  readonly variableSpending: CompletePlanVariableSpending;
}

const BUCKET_BADGE_CLASS: Readonly<Record<CompletePlanVariableSpending['bucketHealth'], string>> = {
  healthy:
    'border-emerald-500/35 bg-emerald-50 text-emerald-800 dark:border-emerald-400/35 dark:bg-emerald-950/35 dark:text-emerald-100',
  attention:
    'border-amber-500/40 bg-amber-50 text-amber-800 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-100',
  critical:
    'border-red-500/40 bg-red-50 text-red-800 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-100',
};

const BUCKET_LABEL: Readonly<Record<CompletePlanVariableSpending['bucketHealth'], string>> = {
  healthy: COMPLETE_PLAN_LABELS.variableSpendingBucketHealthy,
  attention: COMPLETE_PLAN_LABELS.variableSpendingBucketAttention,
  critical: COMPLETE_PLAN_LABELS.variableSpendingBucketCritical,
};

export function CompletePlanVariableSpendingCard({
  variableSpending,
}: CompletePlanVariableSpendingCardProps) {
  const momText =
    variableSpending.monthOverMonthChangePct !== null
      ? `${COMPLETE_PLAN_LABELS.variableSpendingMomLabel}: ${formatSignedOneDecimalPercent(variableSpending.monthOverMonthChangePct)}`
      : COMPLETE_PLAN_LABELS.variableSpendingMomUnavailable;

  return (
    <section
      id="complete-plan-variable-detail"
      aria-labelledby="cp-variable-title"
      className="space-y-4 rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />
          <h3
            id="cp-variable-title"
            className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            {COMPLETE_PLAN_LABELS.variableSpendingCardTitle}
          </h3>
        </div>
        <span
          role="status"
          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${BUCKET_BADGE_CLASS[variableSpending.bucketHealth]}`}
        >
          {BUCKET_LABEL[variableSpending.bucketHealth]}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-text dark:text-text-dark sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total variável
          </p>
          <p className="font-semibold">{formatBrl(variableSpending.totalVariable)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {COMPLETE_PLAN_LABELS.variableSpendingCardIncomeRowLabel}
          </p>
          <p className="font-semibold">
            {variableSpending.percentOfIncome !== null
              ? formatPercent(variableSpending.percentOfIncome)
              : '—'}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {COMPLETE_PLAN_LABELS.variableSpendingMomLabel}
          </p>
          <p className="font-medium text-gray-700 dark:text-gray-200">{momText}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {COMPLETE_PLAN_LABELS.variableSpendingTopCategoriesTitle}
        </p>
        {variableSpending.topCategories.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Não há gasto variável registrado neste mês com esse critério.
          </p>
        ) : (
          <ul className="space-y-2">
            {variableSpending.topCategories.map((category) => (
              <li key={category.name} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-text dark:text-text-dark">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatBrl(category.amount)} · {formatPercent(category.share)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-card dark:bg-card-dark">
                  <div
                    className="h-full bg-primary-500 dark:bg-primary-400"
                    style={{
                      width: `${Math.min(100, Math.round(category.share * 100))}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {COMPLETE_PLAN_LABELS.variableSpendingPeakDaysTitle}
        </p>
        {variableSpending.peakDaysOfMonth && variableSpending.peakDaysOfMonth.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {variableSpending.peakDaysOfMonth.map((day) => (
              <span
                key={day}
                className="rounded-full border border-primary-500/35 bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-800 dark:border-primary-400/35 dark:bg-primary-950/40 dark:text-primary-100"
              >
                Dia {day}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {COMPLETE_PLAN_LABELS.peakDaysEmpty}
          </p>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {COMPLETE_PLAN_LABELS.variableSpendingFootnote}
      </p>
    </section>
  );
}
