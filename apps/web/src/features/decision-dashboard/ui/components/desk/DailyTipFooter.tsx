import { Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DailyTipFooterProps {
  readonly tip: string;
}

export function DailyTipFooter({ tip }: Readonly<DailyTipFooterProps>) {
  return (
    <footer
      aria-label="Dica do dia"
      className="flex min-h-[74px] flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-2 shadow-sm dark:border-border-dark dark:bg-card-dark"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-muted dark:border-border-dark dark:text-text-muted-dark">
          <Lightbulb className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text dark:text-text-dark">Dica do dia</p>
          <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">{tip}</p>
        </div>
      </div>
      <Link
        to="/insights"
        className="shrink-0 text-sm font-medium text-emerald-500 hover:text-emerald-400"
      >
        Ver mais dicas →
      </Link>
    </footer>
  );
}
