import { CalendarClock } from 'lucide-react';

import type {
  CompletePlanProjectionStep,
  CompletePlanResponse,
} from '@/services/completePlanService';

import { COMPLETE_PLAN_LABELS } from './copy';
import { formatBrl, formatPercent } from './format';

export interface CompletePlanProjectionCardProps {
  readonly projection: CompletePlanResponse['projection'];
}

interface StepRow {
  readonly label: string;
  readonly step: CompletePlanProjectionStep;
}

export function CompletePlanProjectionCard({ projection }: CompletePlanProjectionCardProps) {
  const rows: StepRow[] = [
    { label: COMPLETE_PLAN_LABELS.projection30, step: projection.in30Days },
    { label: COMPLETE_PLAN_LABELS.projection60, step: projection.in60Days },
    { label: COMPLETE_PLAN_LABELS.projection90, step: projection.in90Days },
  ];

  return (
    <section
      aria-labelledby="cp-projection-title"
      className="space-y-3 rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />
        <h3
          id="cp-projection-title"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          {COMPLETE_PLAN_LABELS.projectionTitle}
        </h3>
      </div>
      <ol className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2 dark:bg-card-dark"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {row.label}
              </p>
              <p className="text-sm font-medium text-text dark:text-text-dark">
                {formatBrl(row.step.totalCommitted)} ({formatPercent(row.step.committedPct)})
              </p>
            </div>
            {row.step.installmentsEnding > 0 ? (
              <span className="rounded-full border border-primary-500/40 bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:border-primary-400/40 dark:bg-primary-900/40 dark:text-primary-200">
                {row.step.installmentsEnding === 1
                  ? '1 parcela termina'
                  : `${row.step.installmentsEnding} parcelas terminam`}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="text-sm text-gray-600 dark:text-gray-300">{projection.ifNoChange}</p>
    </section>
  );
}
