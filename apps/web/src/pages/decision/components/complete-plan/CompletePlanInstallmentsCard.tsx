import { ChevronDown, CreditCard, Wallet } from 'lucide-react';

import type { CompletePlanInstallment, CompletePlanResponse } from '@/services/completePlanService';

import {
  ACCOUNT_TYPE_LABEL_PT,
  COMPLETE_PLAN_LABELS,
  installmentsCollapsedSummaryLabel,
  PRIORITY_LABEL_PT,
} from './copy';
import { formatBrl, formatDateBr } from './format';
import { partitionInstallmentsHeadAndRest } from './installmentsPartition';

export interface CompletePlanInstallmentsCardProps {
  readonly strategy: CompletePlanResponse['installmentsStrategy'];
}

const PRIORITY_BADGE_CLASSES: Readonly<Record<'high' | 'medium' | 'low', string>> = {
  high: 'border-red-500/40 bg-red-50 text-red-700 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200',
  medium:
    'border-amber-500/40 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-200',
  low: 'border-primary-500/40 bg-primary-50 text-primary-700 dark:border-primary-400/40 dark:bg-primary-900/40 dark:text-primary-200',
};

function InstallmentRow({ item }: { readonly item: CompletePlanInstallment }) {
  return (
    <li className="flex flex-col gap-1.5 rounded-md bg-card px-2.5 py-2 dark:bg-card-dark sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-2.5">
        {item.accountType === 'credit_card' ? (
          <CreditCard
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500 dark:text-primary-400"
            aria-hidden
          />
        ) : (
          <Wallet
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500 dark:text-primary-400"
            aria-hidden
          />
        )}
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm font-medium text-text dark:text-text-dark">
            {item.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {`${formatBrl(item.monthlyValue)} / mês · ${item.remaining} ${item.remaining === 1 ? 'parcela' : 'parcelas'} · termina em ${formatDateBr(item.endDate)}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {ACCOUNT_TYPE_LABEL_PT[item.accountType]}
          </p>
        </div>
      </div>
      <span
        className={`w-fit rounded-full border px-2 py-0.5 text-[11px] font-medium sm:text-xs ${PRIORITY_BADGE_CLASSES[item.priority]}`}
      >
        {PRIORITY_LABEL_PT[item.priority]}
      </span>
    </li>
  );
}

export function CompletePlanInstallmentsCard({ strategy }: CompletePlanInstallmentsCardProps) {
  const { head, rest } = partitionInstallmentsHeadAndRest(strategy.items);
  const restCount = rest.length;

  return (
    <section
      aria-labelledby="cp-installments-title"
      className="space-y-2 rounded-md border border-border bg-background px-3 py-3 dark:border-border-dark dark:bg-background-dark"
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
        <>
          <ul className="space-y-1.5">
            {head.map((item) => (
              <InstallmentRow key={`${item.accountId}::${item.description}`} item={item} />
            ))}
          </ul>
          {restCount > 0 ? (
            <details className="rounded-md border border-border/70 dark:border-border-dark/70 [&[open]>summary_svg]:rotate-180">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-md px-2 py-2 text-sm font-medium text-primary-600 hover:bg-gray-100 dark:text-primary-400 dark:hover:bg-gray-800/60 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 text-left">
                  {installmentsCollapsedSummaryLabel(restCount)}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
              </summary>
              <p className="px-2 pb-1 text-xs text-gray-500 dark:text-gray-400">
                {COMPLETE_PLAN_LABELS.installmentsCollapsedHint}
              </p>
              <ul className="space-y-1.5 border-t border-border/60 px-1 pb-1 pt-2 dark:border-border-dark/60">
                {rest.map((item) => (
                  <InstallmentRow key={`${item.accountId}::${item.description}`} item={item} />
                ))}
              </ul>
            </details>
          ) : null}
        </>
      )}
      <p className="text-xs leading-snug text-gray-600 dark:text-gray-300 sm:text-sm">
        {strategy.suggestion}
      </p>
    </section>
  );
}
