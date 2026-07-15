import { Link as RouterLink } from 'react-router-dom';

/**
 * FRM Option A — period reading must not compete with today's Briefing on Home.
 */
export function DecisionHomePointer() {
  return (
    <aside
      aria-label="Today's decision is on Home"
      className="rounded-lg border border-primary-500/25 bg-primary-500/5 px-3.5 py-3 dark:border-primary-400/30 dark:bg-primary-500/10"
    >
      <p className="text-sm leading-snug text-text dark:text-text-dark">
        <span className="font-medium">A decisão de hoje está na Home</span>
        {' — '}o parecer nasce da tensão financeira do momento.
      </p>
      <RouterLink
        to="/home"
        className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
      >
        Ir para o parecer de hoje
      </RouterLink>
    </aside>
  );
}
