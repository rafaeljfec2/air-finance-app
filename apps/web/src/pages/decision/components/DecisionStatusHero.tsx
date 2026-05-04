import { cn } from '@/lib/utils';
import type { DecisionEngineStatus } from '@/services/decisionEngineService';

const STATUS_VISUAL: Readonly<
  Record<
    DecisionEngineStatus,
    { readonly label: string; readonly containerClass: string; readonly badgeClass: string }
  >
> = {
  healthy: {
    label: 'Situação em dia',
    containerClass:
      'border-green-500/70 bg-green-50/90 dark:border-green-500/50 dark:bg-green-950/40',
    badgeClass: 'bg-green-600 text-white hover:bg-green-600 dark:bg-green-500 dark:text-gray-950',
  },
  attention: {
    label: 'Precisa de atenção',
    containerClass:
      'border-amber-500/80 bg-amber-50/90 dark:border-amber-500/50 dark:bg-amber-950/35',
    badgeClass: 'bg-amber-600 text-white hover:bg-amber-600 dark:bg-amber-500 dark:text-gray-950',
  },
  critical: {
    label: 'Situação crítica',
    containerClass: 'border-red-500/80 bg-red-50/90 dark:border-red-500/50 dark:bg-red-950/35',
    badgeClass: 'bg-red-600 text-white hover:bg-red-600 dark:bg-red-500 dark:text-gray-950',
  },
};

export interface DecisionStatusHeroProps {
  readonly status: DecisionEngineStatus;
  readonly primaryIssueLabel: string;
  readonly orderingRationale: string;
}

export function DecisionStatusHero({
  status,
  primaryIssueLabel,
  orderingRationale,
}: DecisionStatusHeroProps) {
  const visual = STATUS_VISUAL[status];

  return (
    <section
      className={cn(
        'rounded-xl border-2 p-4 shadow-sm sm:p-6',
        'text-foreground dark:text-foreground',
        visual.containerClass,
      )}
      aria-live="polite"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span
            className={cn(
              'inline-flex min-h-[44px] min-w-[44px] items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm',
              visual.badgeClass,
            )}
            role="status"
          >
            {visual.label}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground dark:text-muted-foreground">
              Foco agora
            </p>
            <p className="text-lg font-semibold leading-snug sm:text-xl">{primaryIssueLabel}</p>
          </div>
        </div>
      </div>
      {orderingRationale.trim() !== '' ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground dark:text-muted-foreground">
          {orderingRationale}
        </p>
      ) : null}
    </section>
  );
}
