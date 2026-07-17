import type { Transaction } from '@/services/transactionService';
import { formatDateToLocalISO } from '@/utils/date';

export type QuickAnalysisDirection = 'below' | 'above' | 'stable';

export type QuickAnalysis =
  | { readonly status: 'inconclusive' }
  | {
      readonly status: 'ready';
      readonly direction: QuickAnalysisDirection;
      readonly percent: number;
    };

const LONG_WINDOW_DAYS = 30;
const SHORT_WINDOW_DAYS = 7;

function isoDaysAgo(referenceDate: Date, days: number): string {
  const date = new Date(referenceDate);
  date.setDate(date.getDate() - days);
  return formatDateToLocalISO(date);
}

function paymentDateOnly(transaction: Transaction): string {
  return transaction.paymentDate.split('T')[0] ?? transaction.paymentDate;
}

/**
 * Compares the average daily spend of the last 7 days against the average of
 * the last 30 days. Returns `inconclusive` when there is not enough expense
 * data in the 30-day window to support a claim.
 */
export function buildQuickAnalysis(
  transactions: readonly Transaction[],
  referenceDate: Date,
): QuickAnalysis {
  const referenceIso = formatDateToLocalISO(referenceDate);
  const longWindowStart = isoDaysAgo(referenceDate, LONG_WINDOW_DAYS - 1);
  const shortWindowStart = isoDaysAgo(referenceDate, SHORT_WINDOW_DAYS - 1);

  let longTotal = 0;
  let shortTotal = 0;

  for (const transaction of transactions) {
    if (transaction.launchType !== 'expense') {
      continue;
    }
    const date = paymentDateOnly(transaction);
    if (date < longWindowStart || date > referenceIso) {
      continue;
    }
    const amount = Math.abs(transaction.value);
    longTotal += amount;
    if (date >= shortWindowStart) {
      shortTotal += amount;
    }
  }

  if (longTotal <= 0) {
    return { status: 'inconclusive' };
  }

  const longDailyAverage = longTotal / LONG_WINDOW_DAYS;
  const shortDailyAverage = shortTotal / SHORT_WINDOW_DAYS;
  const percent = Math.round(((shortDailyAverage - longDailyAverage) / longDailyAverage) * 100);

  if (percent === 0) {
    return { status: 'ready', direction: 'stable', percent: 0 };
  }

  return {
    status: 'ready',
    direction: percent < 0 ? 'below' : 'above',
    percent: Math.abs(percent),
  };
}
