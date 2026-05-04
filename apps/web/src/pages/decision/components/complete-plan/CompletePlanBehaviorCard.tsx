import { Activity } from 'lucide-react';

import type { CompletePlanResponse } from '@/services/completePlanService';

import { COMPLETE_PLAN_LABELS } from './copy';
import { formatBrl, formatPercent } from './format';

export interface CompletePlanBehaviorCardProps {
  readonly behavior: CompletePlanResponse['behavior'];
}

export function CompletePlanBehaviorCard({ behavior }: CompletePlanBehaviorCardProps) {
  return (
    <section
      aria-labelledby="cp-behavior-title"
      className="space-y-4 rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />
        <h3
          id="cp-behavior-title"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          {COMPLETE_PLAN_LABELS.behaviorTitle}
        </h3>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {COMPLETE_PLAN_LABELS.topCategoriesTitle}
        </p>
        {behavior.topCategories.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ainda não temos dados de categoria suficientes neste mês.
          </p>
        ) : (
          <ul className="space-y-2">
            {behavior.topCategories.map((category) => (
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
                    style={{ width: `${Math.min(100, Math.round(category.share * 100))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {COMPLETE_PLAN_LABELS.peakDaysTitle}
        </p>
        {behavior.peakDaysOfMonth && behavior.peakDaysOfMonth.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {behavior.peakDaysOfMonth.map((day) => (
              <span
                key={day}
                className="rounded-full border border-amber-500/40 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-200"
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
    </section>
  );
}
