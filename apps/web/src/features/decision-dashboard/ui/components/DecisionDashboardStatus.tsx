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
  const leadLines = lines.slice(0, -1);
  const closingLine = lines[lines.length - 1] ?? '';

  return (
    <section aria-label="Decision status" className="space-y-4" data-state={dataState}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-tight">
            {greeting}
          </p>
          <p className="text-xs text-muted-foreground leading-snug">
            Olhamos com calma. Sem culpa — só clareza para decidir.
          </p>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
          Parecer de hoje
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{question}</p>

        <div className="space-y-2">
          {leadLines.map((line) => (
            <p
              key={line}
              className="text-base sm:text-lg text-text/85 dark:text-text-dark/85 leading-snug text-balance"
            >
              {line}
            </p>
          ))}
          <h1 className="text-xl sm:text-2xl font-semibold text-text dark:text-text-dark leading-snug tracking-tight text-balance">
            {closingLine}
          </h1>
        </div>
      </div>
    </section>
  );
}
