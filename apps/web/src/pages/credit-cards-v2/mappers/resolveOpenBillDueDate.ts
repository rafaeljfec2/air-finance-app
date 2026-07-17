import { formatDateToLocalISO } from '@/utils/date';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function clampedDate(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function nextOccurrence(day: number, after: Date): Date {
  const candidate = clampedDate(after.getFullYear(), after.getMonth(), day);
  if (candidate.getTime() >= after.getTime()) {
    return candidate;
  }
  return clampedDate(after.getFullYear(), after.getMonth() + 1, day);
}

/**
 * Due date of the open (not yet closed) bill: the first dueDay after the next
 * closing of the current cycle.
 */
export function resolveOpenBillDueDate(
  closingDay: number | undefined,
  dueDay: number | undefined,
  referenceDate: Date,
): string | null {
  if (!closingDay || !dueDay) {
    return null;
  }

  const nextClosing = nextOccurrence(closingDay, referenceDate);
  const dueAfterClosing = nextOccurrence(dueDay, new Date(nextClosing.getTime() + MS_PER_DAY));
  return formatDateToLocalISO(dueAfterClosing);
}
