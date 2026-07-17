import { AlertTriangle, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

export function CapacityHypothesis({
  synthesis,
  critical = false,
}: Readonly<{
  synthesis: string;
  critical?: boolean;
}>) {
  const Icon = critical ? AlertTriangle : Info;

  return (
    <section
      aria-label="Hipótese de capacidade"
      className={cn(
        'rounded-xl border border-l-4 bg-card px-4 py-4 shadow-sm dark:bg-card-dark sm:px-5',
        critical
          ? 'border-border border-l-red-500 dark:border-border-dark dark:border-l-red-500'
          : 'border-border border-l-primary-500 dark:border-border-dark dark:border-l-primary-400',
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          className={cn(
            'mt-0.5 shrink-0',
            critical ? 'text-red-500' : 'text-primary-600 dark:text-primary-300',
          )}
          aria-hidden
        />
        <div className="min-w-0 space-y-1.5">
          <h2 className="text-sm font-semibold tracking-tight text-text dark:text-text-dark">
            Hipótese de capacidade
          </h2>
          <p className="text-sm leading-relaxed text-text/90 dark:text-text-dark/90">{synthesis}</p>
          <p className="text-xs text-muted-foreground">
            A hipótese amarra a leitura dos pilares sem recomendar gesto do dia. Capacidade ≠
            parecer da Home.
          </p>
        </div>
      </div>
    </section>
  );
}
