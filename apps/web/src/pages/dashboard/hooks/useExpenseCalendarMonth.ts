import { format, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback, useMemo, useState } from 'react';

import type { DashboardFilters } from '@/types/dashboard';

export interface UseExpenseCalendarMonthResult {
  readonly filters: DashboardFilters;
  readonly monthLabel: string;
  readonly isCurrentMonth: boolean;
  readonly goToPreviousMonth: () => void;
  readonly goToNextMonth: () => void;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function resolveInitialMonth(initialReferenceDate?: string): Date {
  if (!initialReferenceDate) {
    return startOfMonth(new Date());
  }
  const parsed = new Date(initialReferenceDate);
  if (Number.isNaN(parsed.getTime())) {
    return startOfMonth(new Date());
  }
  return startOfMonth(parsed);
}

/**
 * Calendar-local month navigation. Starts at the dashboard month when provided,
 * then moves independently without changing the dashboard period.
 */
export function useExpenseCalendarMonth(
  initialReferenceDate?: string,
): UseExpenseCalendarMonthResult {
  const [referenceMonth, setReferenceMonth] = useState(() =>
    resolveInitialMonth(initialReferenceDate),
  );

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return (
      referenceMonth.getFullYear() === now.getFullYear() &&
      referenceMonth.getMonth() === now.getMonth()
    );
  }, [referenceMonth]);

  const goToPreviousMonth = useCallback(() => {
    setReferenceMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setReferenceMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      return next > startOfMonth(new Date()) ? current : next;
    });
  }, []);

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange: 'month',
      referenceDate: referenceMonth.toISOString(),
    }),
    [referenceMonth],
  );

  const monthLabel = useMemo(
    () => capitalize(format(referenceMonth, "MMMM 'de' yyyy", { locale: ptBR })),
    [referenceMonth],
  );

  return { filters, monthLabel, isCurrentMonth, goToPreviousMonth, goToNextMonth };
}
