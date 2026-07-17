import type { Transaction } from '@/services/transactionService';

export interface BillsCalendarDay {
  readonly day: number;
  readonly hasExpense: boolean;
  readonly hasInstallment: boolean;
  readonly hasClosing: boolean;
  readonly hasDue: boolean;
}

export interface BillsCalendar {
  readonly leadingDays: readonly number[];
  readonly trailingDays: readonly number[];
  readonly days: readonly BillsCalendarDay[];
}

interface BuildBillsCalendarParams {
  readonly referenceDate: Date;
  readonly transactions: readonly Transaction[];
  readonly closingDays: readonly number[];
  readonly dueDates: readonly string[];
}

interface MutableDayFlags {
  hasExpense: boolean;
  hasInstallment: boolean;
  hasClosing: boolean;
  hasDue: boolean;
}

function paymentDateOnly(transaction: Transaction): string {
  return transaction.paymentDate.split('T')[0] ?? transaction.paymentDate;
}

/**
 * Builds a sunday-aligned calendar for the reference month, flagging days with
 * registered expenses, installment purchases, card closings and bill due dates.
 */
export function buildBillsCalendar({
  referenceDate,
  transactions,
  closingDays,
  dueDates,
}: BuildBillsCalendarParams): BillsCalendar {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();

  const flagsByDay = new Map<number, MutableDayFlags>();
  const getFlags = (day: number): MutableDayFlags => {
    let flags = flagsByDay.get(day);
    if (!flags) {
      flags = { hasExpense: false, hasInstallment: false, hasClosing: false, hasDue: false };
      flagsByDay.set(day, flags);
    }
    return flags;
  };

  for (const transaction of transactions) {
    if (transaction.launchType !== 'expense') {
      continue;
    }
    const date = paymentDateOnly(transaction);
    if (!date.startsWith(monthPrefix)) {
      continue;
    }
    const day = Number(date.slice(-2));
    const flags = getFlags(day);
    flags.hasExpense = true;
    if (transaction.quantityInstallments > 1) {
      flags.hasInstallment = true;
    }
  }

  for (const closingDay of closingDays) {
    getFlags(Math.min(closingDay, daysInMonth)).hasClosing = true;
  }

  for (const dueDate of dueDates) {
    const dateOnly = dueDate.split('T')[0] ?? dueDate;
    if (dateOnly.startsWith(monthPrefix)) {
      getFlags(Number(dateOnly.slice(-2))).hasDue = true;
    }
  }

  const days: BillsCalendarDay[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const flags = flagsByDay.get(day);
    days.push({
      day,
      hasExpense: flags?.hasExpense ?? false,
      hasInstallment: flags?.hasInstallment ?? false,
      hasClosing: flags?.hasClosing ?? false,
      hasDue: flags?.hasDue ?? false,
    });
  }

  const leadingDays = Array.from(
    { length: firstWeekday },
    (_, index) => daysInPreviousMonth - firstWeekday + index + 1,
  );

  const trailingCount = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
  const trailingDays = Array.from({ length: trailingCount }, (_, index) => index + 1);

  return { leadingDays, trailingDays, days };
}
