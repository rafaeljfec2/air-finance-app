import { CreditCard, Wallet } from 'lucide-react';

import type { CompletePlanResponse } from '@/services/completePlanService';

import { ACCOUNT_TYPE_LABEL_PT, COMPLETE_PLAN_LABELS, PRIORITY_LABEL_PT } from './copy';
import { formatBrl, formatDateBr } from './format';

export interface CompletePlanInstallmentsCardProps {
  readonly strategy: CompletePlanResponse['installmentsStrategy'];
}

const PRIORITY_BADGE_CLASSES: Readonly<Record<'high' | 'medium' | 'low', string>> = {
  high: 'border-red-500/40 bg-red-50 text-red-700 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200',
  medium:
    'border-amber-500/40 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-200',
  low: 'border-primary-500/40 bg-primary-50 text-primary-700 dark:border-primary-400/40 dark:bg-primary-900/40 dark:text-primary-200',
};

export function CompletePlanInstallmentsCard({ strategy }: CompletePlanInstallmentsCardProps) {
  return (
    <section
      aria-labelledby="cp-installments-title"
      className="space-y-3 rounded-md border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark"
    >
      <h3
        id="cp-installments-title"
        className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
      >
        {COMPLETE_PLAN_LABELS.installmentsTitle}
      </h3>
      {strategy.items.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {COMPLETE_PLAN_LABELS.installmentsEmpty}
        </p>
      ) : (
        <ul className="space-y-2">
          {strategy.items.map((item) => (
            <li
              key={`${item.accountId}::${item.description}`}
              className="flex flex-col gap-2 rounded-md bg-card px-3 py-3 dark:bg-card-dark sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                {item.accountType === 'credit_card' ? (
                  <CreditCard
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400"
                    aria-hidden
                  />
                ) : (
                  <Wallet
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400"
                    aria-hidden
                  />
                )}
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium text-text dark:text-text-dark">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatBrl(item.monthlyValue)} / mês · {item.remaining} parcela
                    {item.remaining === 1 ? '' : 's'} · termina em {formatDateBr(item.endDate)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {ACCOUNT_TYPE_LABEL_PT[item.accountType]}
                  </p>
                </div>
              </div>
              <span
                className={`w-fit rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE_CLASSES[item.priority]}`}
              >
                {PRIORITY_LABEL_PT[item.priority]}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-300">{strategy.suggestion}</p>
    </section>
  );
}
