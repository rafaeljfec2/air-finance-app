import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Tooltip } from '@/components/ui/tooltip';
import { useDashboardBalanceHistory } from '@/hooks/useDashboard';
import { cn } from '@/lib/utils';
import type { DashboardFilters } from '@/types/dashboard';
import { formatDateToLocalISO } from '@/utils/date';

import { useExpenseCalendarMonth } from '../hooks/useExpenseCalendarMonth';
import { buildExpenseCalendar } from '../utils/buildExpenseCalendar';
import { formatExpenseDayTooltip } from '../utils/formatExpenseDayTooltip';

import { DayExpensesModal } from './DayExpensesModal';

const WEEKDAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'] as const;
const SKELETON_CELL_COUNT = 42;

interface ExpenseCalendarCardProps {
  readonly companyId: string;
  readonly initialReferenceDate?: string;
}

function AdjacentMonthDay({ day }: Readonly<{ day: number }>) {
  return (
    <span className="flex h-10 flex-col items-center justify-center text-sm tabular-nums text-muted-foreground/40">
      {day}
    </span>
  );
}

function CalendarSkeleton() {
  return (
    <div
      data-testid="expense-calendar-skeleton"
      className="grid flex-1 grid-cols-7 gap-x-1 gap-y-1.5 px-4 pb-4 pt-2"
      aria-hidden
    >
      {Array.from({ length: SKELETON_CELL_COUNT }, (_, index) => (
        <span
          key={`skeleton-${index}`}
          className="h-10 w-full animate-pulse rounded-lg bg-muted/40 dark:bg-muted/20"
        />
      ))}
    </div>
  );
}

export function ExpenseCalendarCard({ companyId, initialReferenceDate }: ExpenseCalendarCardProps) {
  const { filters, monthLabel, isCurrentMonth, goToPreviousMonth, goToNextMonth } =
    useExpenseCalendarMonth(initialReferenceDate);

  const calendarFilters = useMemo<DashboardFilters>(
    () => ({ ...filters, accountScope: 'all' }),
    [filters],
  );

  const historyQuery = useDashboardBalanceHistory(companyId, calendarFilters);
  const isLoading = historyQuery.isLoading;
  const isFetching = historyQuery.isFetching;
  const isBusy = isLoading || isFetching;

  const referenceDate = useMemo(
    () => (filters.referenceDate ? new Date(filters.referenceDate) : new Date()),
    [filters.referenceDate],
  );

  const calendar = useMemo(
    () => buildExpenseCalendar(referenceDate, historyQuery.data ?? []),
    [referenceDate, historyQuery.data],
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleSelectDay = (dayNumber: number) => {
    const selected = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), dayNumber);
    setSelectedDate(formatDateToLocalISO(selected));
  };

  return (
    <section
      aria-label="Mapa de despesas do mês"
      aria-busy={isBusy}
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
          onClick={goToPreviousMonth}
          disabled={isBusy}
          aria-label="Mês anterior"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-text disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-text-dark"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-text dark:text-text-dark">{monthLabel}</span>
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={isCurrentMonth || isBusy}
          aria-label="Próximo mês"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-text disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-text-dark"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <>
          <div className="grid grid-cols-7 gap-x-1 px-4 pt-2 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="pb-1 text-[10px] font-semibold tracking-wide text-muted-foreground"
                aria-hidden
              >
                {label}
              </span>
            ))}
          </div>
          <CalendarSkeleton />
        </>
      ) : (
        <div
          className={cn(
            'grid flex-1 grid-cols-7 gap-x-1 gap-y-1.5 px-4 pb-4 pt-2 text-center transition-opacity',
            isFetching && 'opacity-50',
          )}
        >
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
          {calendar.days.map((day) => {
            const dayClassName = cn(
              'flex h-10 w-full flex-col items-center justify-center rounded-lg text-sm tabular-nums',
              day.hasExpense
                ? 'bg-emerald-500/10 font-semibold text-text dark:bg-emerald-500/15 dark:text-text-dark'
                : 'text-text/80 dark:text-text-dark/80',
            );
            const markerClassName = cn(
              'mt-0.5 h-1 w-1 rounded-full',
              day.hasExpense ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-transparent',
            );

            if (!day.hasExpense) {
              return (
                <span key={day.day} className={dayClassName}>
                  {day.day}
                  <span className={markerClassName} aria-hidden />
                </span>
              );
            }

            const tooltip = formatExpenseDayTooltip(day.expenses, day.expenseTransactionCount);

            return (
              <Tooltip key={day.day} content={tooltip}>
                <button
                  type="button"
                  className={cn(
                    dayClassName,
                    'transition hover:ring-2 hover:ring-emerald-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                  )}
                  aria-label={`Ver despesas do dia ${day.day}. ${tooltip}`}
                  onClick={() => handleSelectDay(day.day)}
                >
                  {day.day}
                  <span className={markerClassName} aria-hidden />
                </button>
              </Tooltip>
            );
          })}
          {calendar.trailingDays.map((day) => (
            <AdjacentMonthDay key={`next-${day}`} day={day} />
          ))}
        </div>
      )}

      <footer className="flex items-center gap-2 border-t border-border/60 px-4 py-3 dark:border-border-dark/60">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" aria-hidden />
        <span className="text-xs text-muted-foreground">Houve despesa</span>
      </footer>

      <DayExpensesModal
        companyId={companyId}
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </section>
  );
}
