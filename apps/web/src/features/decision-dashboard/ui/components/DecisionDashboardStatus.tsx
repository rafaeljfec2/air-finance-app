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
    <section aria-label="Decision status" className="space-y-3 sm:space-y-4" data-state={dataState}>
      <p className="text-sm font-medium text-primary-500 dark:text-primary-400 tracking-tight">
        {greeting}
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text dark:text-text-dark leading-tight tracking-tight text-balance">
        {conclusion}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground">{question}</p>
    </section>
  );
}
