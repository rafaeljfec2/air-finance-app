import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  subYears,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} from 'date-fns';

export type PresetOption = {
  id: string;
  label: string;
  getRange: () => { start: Date; end: Date };
};

const createPresetRange = (daysAgo: number) => {
  const now = new Date();
  return {
    start: startOfDay(subDays(now, daysAgo - 1)),
    end: endOfDay(now),
  };
};

const createMonthRange = (monthsOffset: number) => {
  const now = new Date();
  const targetMonth = subMonths(now, monthsOffset);
  return {
    start: startOfDay(startOfMonth(targetMonth)),
    end: endOfDay(endOfMonth(targetMonth)),
  };
};

const createYearRange = (yearsAgo: number) => {
  const now = new Date();
  const targetYear = subYears(now, yearsAgo);
  return {
    start: startOfDay(startOfYear(targetYear)),
    end: endOfDay(endOfYear(targetYear)),
  };
};

const createCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfDay(startOfMonth(now)),
    end: endOfDay(endOfMonth(now)),
  };
};

const createCurrentYearRange = () => {
  const now = new Date();
  return {
    start: startOfDay(startOfYear(now)),
    end: endOfDay(endOfYear(now)),
  };
};

const createAllPeriodRange = () => {
  const now = new Date();
  return {
    start: startOfDay(new Date(2000, 0, 1)),
    end: endOfDay(new Date(now.getFullYear() + 10, 11, 31)),
  };
};

const createTodayRange = () => {
  const now = new Date();
  return {
    start: startOfDay(now),
    end: endOfDay(now),
  };
};

const createNextMonthRange = () => {
  const now = new Date();
  const nextMonth = subMonths(now, -1);
  return {
    start: startOfDay(startOfMonth(nextMonth)),
    end: endOfDay(endOfMonth(nextMonth)),
  };
};

const createLast6MonthsRange = () => {
  const now = new Date();
  return {
    start: startOfDay(startOfMonth(subMonths(now, 5))),
    end: endOfDay(now),
  };
};

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'today', label: 'Hoje', getRange: createTodayRange },
  { id: 'last7', label: 'Últimos 7 dias', getRange: () => createPresetRange(7) },
  { id: 'last30', label: 'Últimos 30 dias', getRange: () => createPresetRange(30) },
  { id: 'last90', label: 'Últimos 90 dias', getRange: () => createPresetRange(90) },
  { id: 'nextMonth', label: 'Mês seguinte', getRange: createNextMonthRange },
  { id: 'thisMonth', label: 'Este mês', getRange: createCurrentMonthRange },
  { id: 'lastMonth', label: 'Mês passado', getRange: () => createMonthRange(1) },
  { id: 'last6Months', label: 'Últimos 6 meses', getRange: createLast6MonthsRange },
  { id: 'thisYear', label: 'Este ano', getRange: createCurrentYearRange },
  { id: 'lastYear', label: 'Ano passado', getRange: () => createYearRange(1) },
  { id: 'all', label: 'Todo período', getRange: createAllPeriodRange },
];

export function calculateCalendarMonths(
  start: Date | undefined,
  end: Date | undefined,
): { currentMonth: Date; secondMonth: Date } {
  if (!start) {
    const now = new Date();
    return {
      currentMonth: startOfMonth(now),
      secondMonth: startOfMonth(subMonths(now, -1)),
    };
  }

  const startMonth = startOfMonth(start);
  if (!end) {
    return {
      currentMonth: startMonth,
      secondMonth: startOfMonth(subMonths(start, -1)),
    };
  }

  const endMonth = startOfMonth(end);
  if (startMonth.getTime() === endMonth.getTime()) {
    return {
      currentMonth: startMonth,
      secondMonth: startOfMonth(subMonths(startMonth, -1)),
    };
  }

  return {
    currentMonth: startMonth,
    secondMonth: endMonth,
  };
}
