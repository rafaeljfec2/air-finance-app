import { useAuthStore } from '@/stores/auth';

import { buildReceptionGreeting } from '../helpers/greeting';
import { humanizeStatusAnswer } from '../helpers/humanizeStatusAnswer';

interface DecisionDashboardStatusProps {
  readonly question: string;
  readonly status: string;
  readonly dataState: string;
}

export function DecisionDashboardStatus({
  question,
  status,
  dataState,
}: DecisionDashboardStatusProps) {
  const userName = useAuthStore((state) => state.user?.name);
  const greeting = buildReceptionGreeting(userName);
  const conclusion = humanizeStatusAnswer(status);

  return (
    <section aria-label="Decision status" className="space-y-4" data-state={dataState}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-tight">
          {greeting}
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Parecer de hoje
        </p>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-semibold text-text dark:text-text-dark leading-tight tracking-tight text-balance">
          {conclusion}
        </h1>
        <p className="text-sm text-muted-foreground">{question}</p>
      </div>
    </section>
  );
}
