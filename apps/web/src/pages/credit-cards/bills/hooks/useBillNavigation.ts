import { useState, useMemo } from 'react';
import { format, subMonths, addMonths } from 'date-fns';

export function useBillNavigation() {
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    return format(new Date(), 'yyyy-MM');
  });

  const currentDate = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    const previousMonth = subMonths(currentDate, 1);
    setCurrentMonth(format(previousMonth, 'yyyy-MM'));
  };

  const goToNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    setCurrentMonth(format(nextMonth, 'yyyy-MM'));
  };

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
