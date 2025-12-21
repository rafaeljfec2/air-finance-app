import type { CreateRecurringTransaction } from '@/services/recurringTransactionService';

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
    startDate: today.toISOString().split('T')[0],
    frequency: 'monthly',
    repeatUntil: oneYearLater.toISOString().split('T')[0],
    createdAutomatically: false,
  };
}

/**
 * Formats date to YYYY-MM-DD string
 */
export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parses date string to Date object
 */
export function parseDateString(dateString: string): Date {
  return new Date(dateString);
}
