import { useState, useMemo, useCallback } from 'react';
import { format, subMonths, addMonths } from 'date-fns';

export function useBillNavigation() {
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    return format(new Date(), 'yyyy-MM');
  });

  const currentDate = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }, [currentMonth]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      const [year, month] = prevMonth.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      const previousMonth = subMonths(date, 1);
      return format(previousMonth, 'yyyy-MM');
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      const [year, month] = prevMonth.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      const nextMonth = addMonths(date, 1);
      return format(nextMonth, 'yyyy-MM');
    });
  }, []);

  const canGoPrevious = true;
  const canGoNext = true;

  return {
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    canGoPrevious,
    canGoNext,
  };
}
