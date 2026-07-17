import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import type { BalanceHistoryPoint } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

import { buildExpenseCalendar } from '../utils/buildExpenseCalendar';

const WEEKDAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'] as const;

interface ExpenseCalendarCardProps {
  readonly referenceDate: Date;
  readonly monthLabel: string;
  readonly points: readonly BalanceHistoryPoint[];
  readonly isCurrentMonth: boolean;
  readonly onPreviousMonth: () => void;
  readonly onNextMonth: () => void;
}

function AdjacentMonthDay({ day }: Readonly<{ day: number }>) {
  return (
    <span className="flex h-10 flex-col items-center justify-center text-sm tabular-nums text-muted-foreground/40">
      {day}
    </span>
  );
}

export function ExpenseCalendarCard({
  referenceDate,
  monthLabel,
  points,
  isCurrentMonth,
  onPreviousMonth,
  onNextMonth,
}: ExpenseCalendarCardProps) {
  const calendar = useMemo(
    () => buildExpenseCalendar(referenceDate, points),
    [referenceDate, points],
  );

  return (
    <section
      aria-label="Mapa de despesas do mês"
      className="flex flex-col rounded-xl border border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark"
    >
      <header className="space-y-0.5 px-4 pt-4">
        <h3 className="text-sm font-semibold text-text dark:text-text-dark">
          Mapa de despesas do mês
        </h3>
        <p className="text-xs text-muted-foreground">Dias em que houve despesas registradas.</p>
      </header>

      <div className="flex items-center justify-between px-2 pt-3">
        <button
          type="button"
          onClick={onPreviousMonth}
          aria-label="Mês anterior"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-text dark:hover:text-text-dark"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-text dark:text-text-dark">{monthLabel}</span>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={isCurrentMonth}
          aria-label="Próximo mês"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-text disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-text-dark"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid flex-1 grid-cols-7 gap-x-1 gap-y-1.5 px-4 pb-4 pt-2 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="pb-1 text-[10px] font-semibold tracking-wide text-muted-foreground"
            aria-hidden
          >
            {label}
          </span>
        ))}
        {calendar.leadingDays.map((day) => (
          <AdjacentMonthDay key={`prev-${day}`} day={day} />
        ))}
        {calendar.days.map((day) => (
          <span
            key={day.day}
            title={day.hasExpense ? `${formatCurrency(day.expenses)} em despesas` : undefined}
            className={cn(
              'flex h-10 flex-col items-center justify-center rounded-lg text-sm tabular-nums',
              day.hasExpense
                ? 'bg-emerald-500/10 font-semibold text-text dark:bg-emerald-500/15 dark:text-text-dark'
                : 'text-text/80 dark:text-text-dark/80',
            )}
          >
            {day.day}
            <span
              className={cn(
                'mt-0.5 h-1 w-1 rounded-full',
                day.hasExpense ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-transparent',
              )}
              aria-hidden
            />
          </span>
        ))}
        {calendar.trailingDays.map((day) => (
          <AdjacentMonthDay key={`next-${day}`} day={day} />
        ))}
      </div>

      <footer className="flex items-center gap-2 border-t border-border/60 px-4 py-3 dark:border-border-dark/60">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" aria-hidden />
        <span className="text-xs text-muted-foreground">Houve despesa</span>
      </footer>
    </section>
  );
}
