import { formatDateToLocalISO } from '@/utils/date';

export interface StatementPeriodRange {
  readonly startDate: string;
  readonly endDate: string;
}

function clampedDate(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function previousOccurrence(day: number, onOrBefore: Date): Date {
  const candidate = clampedDate(onOrBefore.getFullYear(), onOrBefore.getMonth(), day);
  if (candidate.getTime() <= onOrBefore.getTime()) {
    return candidate;
  }
  return clampedDate(onOrBefore.getFullYear(), onOrBefore.getMonth() - 1, day);
}

/**
 * Open bill cycle window: from the last closing day (inclusive) through today.
 * Used to fetch PENDING Open Finance transactions that compose the open bill.
 */
export function getCurrentCycleRange(
  closingDay: number | undefined,
  referenceDate: Date,
): StatementPeriodRange | null {
  if (!closingDay) {
    return null;
  }

  const start = previousOccurrence(closingDay, referenceDate);
  return {
    startDate: formatDateToLocalISO(start),
    endDate: formatDateToLocalISO(referenceDate),
  };
}
