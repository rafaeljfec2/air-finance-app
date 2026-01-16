import type { CreateRecurringTransaction } from '@/services/recurringTransactionService';
import { formatDateToLocalISO } from '@/utils/date';

/**
 * Creates initial form state with default values
 */
export function createInitialFormState(): CreateRecurringTransaction {
  const today = new Date();
  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(today.getFullYear() + 1);

  return {
    description: '',
    value: 0,
    type: 'Expense',
    category: '',
    accountId: '',
    startDate: formatDateToLocalISO(today),
    frequency: 'monthly',
    repeatUntil: formatDateToLocalISO(oneYearLater),
    createdAutomatically: false,
  };
}

/**
 * Formats date to YYYY-MM-DD string in local timezone
 */
export function formatDateToString(date: Date): string {
  return formatDateToLocalISO(date);
}

/**
 * Parses date string to Date object
 */
export function parseDateString(dateString: string): Date {
  return new Date(dateString);
}
