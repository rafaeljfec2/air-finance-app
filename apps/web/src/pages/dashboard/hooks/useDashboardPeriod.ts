import { format, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback, useMemo, useState } from 'react';

import type { DashboardFilters } from '@/types/dashboard';

export interface UseDashboardPeriodResult {
  readonly filters: DashboardFilters;
  readonly monthLabel: string;
  readonly isCurrentMonth: boolean;
  readonly goToPreviousMonth: () => void;
  readonly goToNextMonth: () => void;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Selected month state for the dashboard — navigable backwards, capped at the current month. */
export function useDashboardPeriod(): UseDashboardPeriodResult {
  const [referenceMonth, setReferenceMonth] = useState(() => startOfMonth(new Date()));

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
