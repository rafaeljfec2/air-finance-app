import { addMonths, startOfMonth } from 'date-fns';

import { formatDateToLocalISO } from '@/utils/date';

import type { StatementPeriodRange } from './getCurrentCycleRange';

const SLICE_MONTHS = 3;
const HISTORY_MONTHS = 12;

/**
 * Splits a long lookback into smaller date windows so Open Finance transaction
 * fetches stay under the provider page cap (~1000 rows).
 */
export function buildHistoryFetchSlices(
  referenceDate: Date,
  historyMonths: number = HISTORY_MONTHS,
  sliceMonths: number = SLICE_MONTHS,
): StatementPeriodRange[] {
  const earliest = startOfMonth(addMonths(referenceDate, -historyMonths));

  const slices: StatementPeriodRange[] = [];
  let cursorEnd = referenceDate;

  while (cursorEnd.getTime() > earliest.getTime()) {
    const cursorStart = addMonths(cursorEnd, -sliceMonths);
    const startDate =
      cursorStart.getTime() < earliest.getTime()
        ? formatDateToLocalISO(earliest)
        : formatDateToLocalISO(cursorStart);

    slices.push({
      startDate,
      endDate: formatDateToLocalISO(cursorEnd),
    });

    if (startDate <= formatDateToLocalISO(earliest)) {
      break;
    }

    cursorEnd = addMonths(cursorEnd, -sliceMonths);
    // Avoid overlapping the previous slice end with the next end
    cursorEnd = new Date(cursorEnd);
    cursorEnd.setDate(cursorEnd.getDate() - 1);
  }

  return slices;
}

export function dedupeTransactionsById<T extends { readonly id: string }>(
  transactions: ReadonlyArray<T>,
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const tx of transactions) {
    if (seen.has(tx.id)) {
      continue;
    }
    seen.add(tx.id);
    result.push(tx);
  }
  return result;
}
