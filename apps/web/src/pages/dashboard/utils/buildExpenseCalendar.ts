import type { BalanceHistoryPoint } from '@/types/dashboard';

export interface ExpenseCalendarDay {
  readonly day: number;
  readonly expenses: number;
  readonly hasExpense: boolean;
}

export interface ExpenseCalendar {
  readonly leadingDays: readonly number[];
  readonly trailingDays: readonly number[];
  readonly days: readonly ExpenseCalendarDay[];
}

/**
 * Builds a sunday-aligned calendar grid for the month of `referenceDate`,
 * marking days that registered expenses in the balance history. Leading and
 * trailing day numbers from adjacent months complete the first and last rows.
 */
export function buildExpenseCalendar(
  referenceDate: Date,
  points: readonly BalanceHistoryPoint[],
): ExpenseCalendar {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();

  const expensesByDay = new Map<number, number>();
  for (const point of points) {
    const date = new Date(point.date);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month) {
      continue;
    }
    const day = date.getUTCDate();
    expensesByDay.set(day, (expensesByDay.get(day) ?? 0) + point.expenses);
  }

  const days: ExpenseCalendarDay[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const expenses = Math.round((expensesByDay.get(day) ?? 0) * 100) / 100;
    days.push({ day, expenses, hasExpense: expenses > 0 });
  }

  const leadingDays = Array.from(
    { length: firstWeekday },
    (_, index) => daysInPreviousMonth - firstWeekday + index + 1,
  );

  const trailingCount = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
  const trailingDays = Array.from({ length: trailingCount }, (_, index) => index + 1);

  return { leadingDays, trailingDays, days };
}
