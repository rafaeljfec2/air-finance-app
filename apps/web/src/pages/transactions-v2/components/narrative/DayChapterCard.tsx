import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

import type { DayNarrative } from '../../utils/buildDayNarrative';

interface DayChapterCardProps {
  readonly narrative: DayNarrative;
  readonly compact?: boolean;
  readonly className?: string;
}

function formatDayHeadline(dayKey: string): {
  readonly weekday: string;
  readonly dayMonth: string;
} {
  if (dayKey === 'previous-balance') {
    return { weekday: 'Antes do período', dayMonth: 'PONTO DE PARTIDA' };
  }

  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return {
    weekday: format(date, 'EEEE', { locale: ptBR }),
    dayMonth: format(date, "dd MMM'.'", { locale: ptBR }).toUpperCase(),
  };
}

export function DayChapterCard({
  narrative,
  compact = false,
  className,
}: Readonly<DayChapterCardProps>) {
  const { weekday, dayMonth } = formatDayHeadline(narrative.dayKey);
  const movementLabel = narrative.movementCount === 1 ? 'movimento' : 'movimentos';

  if (narrative.dayKey === 'previous-balance') {
    return (
      <aside
        className={cn(
          'rounded-xl border border-primary-500/20 bg-primary-500/5 p-3 dark:border-primary-400/20 dark:bg-primary-500/10',
          className,
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
          {weekday}
        </p>
        <p className="mt-1 text-sm font-bold text-primary-600 dark:text-primary-400">{dayMonth}</p>
      </aside>
    );
  }

  if (compact) {
    return (
      <aside
        className={cn(
          'flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-background/60 px-3 py-2 dark:border-border-dark dark:bg-background-dark/60',
          className,
        )}
      >
        <div>
          <p className="text-[10px] capitalize text-text-muted dark:text-text-muted-dark">
            {weekday}
          </p>
          <p className="text-sm font-bold text-text dark:text-text-dark">{dayMonth}</p>
        </div>
        <span className="text-[11px] text-text-muted dark:text-text-muted-dark">
          {narrative.movementCount} {movementLabel}
        </span>
        {narrative.totalOutflows > 0 ? (
          <span className="text-[11px] font-medium text-red-500">
            Saídas {formatCurrency(narrative.totalOutflows)}
          </span>
        ) : null}
        {narrative.endOfDayBalance !== null ? (
          <span className="ml-auto text-[11px] font-semibold text-text dark:text-text-dark">
            Saldo {formatCurrency(narrative.endOfDayBalance)}
          </span>
        ) : null}
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'rounded-xl border border-border bg-background/70 p-3 dark:border-border-dark dark:bg-background-dark/70',
        className,
      )}
    >
      <p className="text-[10px] font-medium capitalize text-text-muted dark:text-text-muted-dark">
        {weekday}
      </p>
      <p className="mt-0.5 text-lg font-bold tracking-tight text-text dark:text-text-dark">
        {dayMonth}
      </p>

      <dl className="mt-3 space-y-2 text-[11px]">
        <div>
          <dt className="text-text-muted dark:text-text-muted-dark">Movimentos</dt>
          <dd className="font-semibold text-text dark:text-text-dark">
            {narrative.movementCount} {movementLabel}
          </dd>
        </div>

        {narrative.totalOutflows > 0 ? (
          <div>
            <dt className="text-text-muted dark:text-text-muted-dark">Saídas</dt>
            <dd className="font-semibold text-red-500">
              {formatCurrency(narrative.totalOutflows)}
            </dd>
          </div>
        ) : null}

        {narrative.totalInflows > 0 ? (
          <div>
            <dt className="text-text-muted dark:text-text-muted-dark">Entradas</dt>
            <dd className="font-semibold text-green-500">
              {formatCurrency(narrative.totalInflows)}
            </dd>
          </div>
        ) : null}

        {narrative.biggestExpense ? (
          <div>
            <dt className="text-text-muted dark:text-text-muted-dark">Maior gasto</dt>
            <dd className="truncate font-medium text-text dark:text-text-dark">
              {narrative.biggestExpense.description}
            </dd>
          </div>
        ) : null}

        {narrative.endOfDayBalance !== null ? (
          <div className="border-t border-border pt-2 dark:border-border-dark">
            <dt className="text-text-muted dark:text-text-muted-dark">Saldo ao final do dia</dt>
            <dd className="text-sm font-bold text-text dark:text-text-dark">
              {formatCurrency(narrative.endOfDayBalance)}
            </dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}
