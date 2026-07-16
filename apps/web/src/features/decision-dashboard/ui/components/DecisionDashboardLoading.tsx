import { Check, Circle, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import type {
  DashboardLoadingStep,
  DashboardLoadingStepStatus,
} from '../../hooks/resolveDashboardLoadingPhase';

interface DecisionDashboardLoadingProps {
  readonly message: string;
  readonly steps: readonly DashboardLoadingStep[];
}

function StepIndicator({ status }: { readonly status: DashboardLoadingStepStatus }) {
  if (status === 'done') {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-600 dark:bg-primary-500/25 dark:text-primary-400"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }

  if (status === 'active') {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500/15 ring-2 ring-primary-500/30 text-primary-600 dark:text-primary-400"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground/40"
    >
      <Circle className="h-3 w-3" fill="currentColor" strokeWidth={0} />
    </span>
  );
}

export function DecisionDashboardLoading({ message, steps }: DecisionDashboardLoadingProps) {
  const completedCount = steps.filter((step) => step.status === 'done').length;
  const progressPercent =
    steps.length === 0 ? 0 : Math.round(((completedCount + 0.35) / steps.length) * 100);

  return (
    <div
      className="flex min-h-[calc(100dvh-11rem)] w-full items-center justify-center px-3 py-8 sm:min-h-[calc(100dvh-9rem)] sm:px-4"
      aria-busy="true"
      aria-label="Montando parecer de hoje"
    >
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-3xl border border-border/60 bg-card/90 px-6 py-8 shadow-lg backdrop-blur-sm dark:border-border-dark/60 dark:bg-card-dark/90 sm:px-8 sm:py-10">
          <div className="mx-auto flex max-w-md flex-col items-center space-y-7 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary-500/10 motion-safe:animate-pulse"
              />
              <span
                aria-hidden
                className="absolute inset-2 rounded-full border border-primary-500/20"
              />
              <Loader2
                className="relative h-10 w-10 animate-spin text-primary-600 dark:text-primary-400"
                aria-hidden
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-text dark:text-text-dark sm:text-2xl text-balance">
                Montando seu parecer de hoje
              </h2>
              <p
                aria-live="polite"
                className="text-base text-muted-foreground leading-relaxed text-balance"
              >
                {message}
              </p>
            </div>

            <div className="w-full space-y-2">
              <div
                className="h-2.5 overflow-hidden rounded-full bg-muted/50 dark:bg-muted/25"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                aria-label="Progresso do parecer"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-[width] duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs font-medium tabular-nums text-muted-foreground">
                {completedCount} de {steps.length} etapas concluídas
              </p>
            </div>
          </div>

          <ol aria-label="Loading progress" className="mt-8 space-y-2.5">
            {steps.map((step) => (
              <li
                key={step.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  step.status === 'active' &&
                    'border border-primary-500/20 bg-primary-500/10 dark:border-primary-400/25 dark:bg-primary-500/15',
                  step.status === 'done' && 'opacity-80',
                )}
              >
                <StepIndicator status={step.status} />
                <span
                  className={cn(
                    'text-sm leading-snug sm:text-base',
                    step.status === 'active' && 'font-semibold text-text dark:text-text-dark',
                    step.status === 'done' && 'text-muted-foreground',
                    step.status === 'pending' && 'text-muted-foreground/50',
                  )}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
