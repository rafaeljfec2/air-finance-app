import { Check, Lightbulb, Lock, TrendingUp } from 'lucide-react';

import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

import type {
  DashboardLoadingStep,
  DashboardLoadingStepStatus,
} from '../../hooks/resolveDashboardLoadingPhase';

interface DecisionDashboardLoadingProps {
  readonly steps: readonly DashboardLoadingStep[];
}

function StepIndicator({ status }: { readonly status: DashboardLoadingStepStatus }) {
  if (status === 'done') {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  }

  if (status === 'active') {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-400 bg-emerald-500/15 shadow-[0_0_14px_rgba(16,185,129,0.45)]"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 motion-safe:animate-pulse dark:bg-emerald-400" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/80 dark:border-border-dark/80"
    />
  );
}

function AnalysisRing() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl motion-safe:animate-pulse"
      />
      <svg
        viewBox="0 0 96 96"
        aria-hidden
        className="absolute inset-0 h-full w-full motion-safe:animate-spin [animation-duration:2.6s]"
      >
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          strokeWidth="4"
          className="stroke-muted/40 dark:stroke-muted/20"
        />
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="88 44 30 102"
          className="stroke-emerald-500 dark:stroke-emerald-400"
        />
      </svg>
      <TrendingUp aria-hidden className="relative h-8 w-8 text-emerald-600 dark:text-emerald-400" />
    </div>
  );
}

function EvidenceSparkline() {
  return (
    <svg
      viewBox="0 0 132 52"
      aria-hidden
      className="h-[52px] w-[132px] shrink-0 text-muted-foreground"
    >
      <defs>
        <linearGradient id="dashboard-loading-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M4 34 C 22 32, 34 13, 52 12 C 66 11, 74 19, 85 26 C 98 33, 114 36, 128 36 L 128 42 L 4 42 Z"
        fill="url(#dashboard-loading-spark)"
        stroke="none"
      />
      <path
        d="M4 34 C 22 32, 34 13, 52 12 C 66 11, 74 19, 85 26 C 98 33, 114 36, 128 36"
        fill="none"
        strokeWidth="1.5"
        className="stroke-emerald-500 dark:stroke-emerald-400"
      />
      <line
        x1="85"
        y1="6"
        x2="85"
        y2="40"
        strokeWidth="1"
        strokeDasharray="3 3"
        className="stroke-current opacity-50"
      />
      <circle cx="85" cy="26" r="3" className="fill-emerald-500 dark:fill-emerald-400" />
      <text x="4" y="50" fontSize="7" className="fill-current opacity-70">
        1
      </text>
      <text x="42" y="50" fontSize="7" className="fill-current opacity-70">
        10
      </text>
      <text x="80" y="50" fontSize="7" className="fill-current opacity-70">
        20
      </text>
      <text x="122" y="50" fontSize="7" className="fill-current opacity-70">
        30
      </text>
    </svg>
  );
}

export function DecisionDashboardLoading({ steps }: DecisionDashboardLoadingProps) {
  return (
    <div
      className="relative flex min-h-[calc(100dvh-11rem)] w-full items-center justify-center px-3 py-8 sm:min-h-[calc(100dvh-9rem)] sm:px-4"
      aria-busy="true"
      aria-label="Analisando seu sistema financeiro"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl"
      />

      <div className="w-full max-w-[420px]">
        <div className="rounded-3xl border border-border/60 bg-card px-6 py-7 shadow-2xl dark:border-border-dark/60 dark:bg-card-dark sm:px-7">
          <div className="flex flex-col items-center space-y-5 text-center">
            <Logo className="scale-75" />

            <AnalysisRing />

            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-text dark:text-text-dark sm:text-xl">
                Analisando seu sistema financeiro
              </h2>
              <p className="mx-auto max-w-[290px] text-sm leading-relaxed text-muted-foreground text-balance">
                Estamos conectando os fatos mais importantes para entender o momento atual.
              </p>
            </div>
          </div>

          <ol aria-label="Loading progress" className="mt-7">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li key={step.id} className={cn('relative flex gap-3', !isLast && 'pb-5')}>
                  {!isLast && (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute bottom-0 left-[13px] top-8 w-px',
                        step.status === 'done'
                          ? 'bg-emerald-500/40'
                          : 'bg-border/80 dark:bg-border-dark/80',
                      )}
                    />
                  )}
                  <StepIndicator status={step.status} />
                  <div className="min-w-0 space-y-0.5 pt-0.5">
                    <p
                      className={cn(
                        'text-sm leading-snug',
                        step.status === 'done' && 'font-semibold text-text dark:text-text-dark',
                        step.status === 'active' &&
                          'font-semibold text-emerald-600 dark:text-emerald-400',
                        step.status === 'pending' && 'font-medium text-muted-foreground/60',
                      )}
                      aria-live={step.status === 'active' ? 'polite' : undefined}
                    >
                      {step.label}
                    </p>
                    <p
                      className={cn(
                        'text-xs leading-snug',
                        step.status === 'pending'
                          ? 'text-muted-foreground/50'
                          : 'text-muted-foreground',
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 border-t border-border/60 pt-5 dark:border-border-dark/60">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                <Lightbulb className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Evidências do período
                </p>
                <p className="text-xs leading-snug text-muted-foreground">
                  Cruzando seu fluxo diário para localizar onde a pressão se concentra.
                </p>
              </div>
              <EvidenceSparkline />
            </div>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 border-t border-border/60 pt-4 text-[11px] text-muted-foreground/70 dark:border-border-dark/60">
            <Lock aria-hidden className="h-3 w-3" />
            Seus dados estão seguros e criptografados.
          </p>
        </div>
      </div>
    </div>
  );
}
