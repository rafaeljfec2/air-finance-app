import { cn } from '@/lib/utils';

import type { TransactionContext } from '../../utils/deriveTransactionContext';

interface ContextBadgeProps {
  readonly context: TransactionContext;
  readonly className?: string;
}

const KIND_CLASS: Record<TransactionContext['kind'], string> = {
  inflow: 'bg-green-500/10 text-green-600 dark:bg-green-500/15 dark:text-green-400',
  recurring: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  installment: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'biggest-day-expense': 'bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  'first-category': 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  'nth-category': 'bg-background text-text-muted dark:bg-background-dark dark:text-text-muted-dark',
};

export function ContextBadge({ context, className }: Readonly<ContextBadgeProps>) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-none',
        KIND_CLASS[context.kind],
        className,
      )}
    >
      {context.label}
    </span>
  );
}
