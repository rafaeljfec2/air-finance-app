import { formatDateToLocalISO } from '@/utils/date';

export interface StatementPeriodRange {
  readonly startDate: string;
  readonly endDate: string;
}

function clampedDate(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

export function previousOccurrence(day: number, onOrBefore: Date): Date {
  const candidate = clampedDate(onOrBefore.getFullYear(), onOrBefore.getMonth(), day);
  if (candidate.getTime() <= onOrBefore.getTime()) {
    return candidate;
  }
  return clampedDate(onOrBefore.getFullYear(), onOrBefore.getMonth() - 1, day);
}

export function nextOccurrence(day: number, onOrAfter: Date): Date {
  const candidate = clampedDate(onOrAfter.getFullYear(), onOrAfter.getMonth(), day);
  if (candidate.getTime() >= onOrAfter.getTime()) {
    return candidate;
  }
  return clampedDate(onOrAfter.getFullYear(), onOrAfter.getMonth() + 1, day);
}

/**
 * Open bill cycle window: day after the last closing through today.
 * Purchases on the closing day belong to the closed cycle.
 * When reference is the closing day, startDate > endDate (next cycle not open yet).
 */
export function getCurrentCycleRange(
  closingDay: number | undefined,
  referenceDate: Date,
): StatementPeriodRange | null {
  if (!closingDay) {
    return null;
  }

  const day = startOfLocalDay(referenceDate);
  const lastClose = previousOccurrence(closingDay, day);
  const start = addDays(lastClose, 1);

  return {
    startDate: formatDateToLocalISO(start),
    endDate: formatDateToLocalISO(day),
  };
}

/** Stable monthly index of the cycle containing `date` (by cycle-end closing). */
export function cycleIndexOf(date: Date, closingDay: number): number {
  const end = nextOccurrence(closingDay, startOfLocalDay(date));
  return end.getFullYear() * 12 + end.getMonth();
}

export function isAfterClosingDay(closingDay: number, referenceDate: Date): boolean {
  const day = startOfLocalDay(referenceDate);
  const closeThisMonth = clampedDate(day.getFullYear(), day.getMonth(), closingDay);
  return day.getTime() > closeThisMonth.getTime();
}
