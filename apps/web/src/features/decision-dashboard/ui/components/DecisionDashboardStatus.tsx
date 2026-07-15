import { useAuthStore } from '@/stores/auth';

import { buildReceptionGreeting } from '../helpers/greeting';
import { humanizeStatusAnswer } from '../helpers/humanizeStatusAnswer';

interface DecisionDashboardStatusProps {
  readonly question: string;
  readonly status: string;
  readonly statusLines?: readonly string[];
  readonly dataState: string;
}

export function DecisionDashboardStatus({
  question,
  status,
  statusLines,
  dataState,
}: DecisionDashboardStatusProps) {
  const userName = useAuthStore((state) => state.user?.name);
  const greeting = buildReceptionGreeting(userName);
  const lines =
    statusLines && statusLines.length > 0
      ? statusLines.map((line) => humanizeStatusAnswer(line))
      : [humanizeStatusAnswer(status)];

  return (
    <section aria-label="Decision status" className="space-y-4" data-state={dataState}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-base font-semibold text-primary-600 dark:text-primary-400 tracking-tight">
            {greeting}
          </p>
          <p className="text-sm text-muted-foreground leading-snug">
            Uma decisão clara para o seu caixa hoje.
          </p>
        </div>
        <p className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">Hoje</p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{question}</p>

        <ul className="space-y-2.5">
          {lines.map((line, index) => {
            const separator = line.indexOf(':');
            const hasLabel = separator > 0 && separator < 24;
            const label = hasLabel ? line.slice(0, separator).trim() : undefined;
            const body = hasLabel ? line.slice(separator + 1).trim() : line;
            const isFocus = index === lines.length - 1;

            return (
              <li
                key={line}
                className="flex flex-col gap-0.5 sm:flex-row sm:gap-3 sm:items-baseline"
              >
                {label ? (
                  <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-28">
                    {label}
                  </span>
                ) : null}
                <span
                  className={
                    isFocus
                      ? 'text-base font-semibold text-text dark:text-text-dark leading-snug text-balance'
                      : 'text-base text-text/90 dark:text-text-dark/90 leading-snug text-balance'
                  }
                >
                  {body}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
