import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

import { getTransactionDayKey, groupTransactionsByDay } from './groupTransactionsByDay';

export interface DayBiggestExpense {
  readonly description: string;
  readonly absValue: number;
}

export interface DayNarrative {
  readonly dayKey: string;
  readonly movementCount: number;
  readonly totalOutflows: number;
  readonly totalInflows: number;
  readonly biggestExpense: DayBiggestExpense | null;
  readonly biggestExpenseId: string | null;
  readonly endOfDayBalance: number | null;
  readonly hasInflow: boolean;
}

function isRealMovement(transaction: TransactionGridTransaction): boolean {
  return transaction.id !== 'previous-balance';
}

function sortByChronologicalAsc(
  transactions: readonly TransactionGridTransaction[],
): TransactionGridTransaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.paymentDate || a.createdAt).getTime();
    const dateB = new Date(b.paymentDate || b.createdAt).getTime();

    if (dateA === dateB) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return dateA - dateB;
  });
}

export function buildDayNarrative(
  dayKey: string,
  transactions: readonly TransactionGridTransaction[],
): DayNarrative {
  const movements = transactions.filter(isRealMovement);

  if (dayKey === 'previous-balance' || movements.length === 0) {
    return {
      dayKey,
      movementCount: 0,
      totalOutflows: 0,
      totalInflows: 0,
      biggestExpense: null,
      biggestExpenseId: null,
      endOfDayBalance: null,
      hasInflow: false,
    };
  }

  let totalOutflows = 0;
  let totalInflows = 0;
  let biggestExpense: DayBiggestExpense | null = null;
  let biggestExpenseId: string | null = null;

  movements.forEach((transaction) => {
    if (transaction.launchType === 'revenue' || transaction.value > 0) {
      totalInflows += Math.abs(transaction.value);
      return;
    }

    const absValue = Math.abs(transaction.value);
    totalOutflows += absValue;

    if (!biggestExpense || absValue > biggestExpense.absValue) {
      biggestExpense = {
        description: transaction.description,
        absValue,
      };
      biggestExpenseId = transaction.id;
    }
  });

  const chronological = sortByChronologicalAsc(movements);
  const lastOfDay = chronological[chronological.length - 1];
  const endOfDayBalance = lastOfDay?.balance ?? null;

  return {
    dayKey,
    movementCount: movements.length,
    totalOutflows,
    totalInflows,
    biggestExpense,
    biggestExpenseId,
    endOfDayBalance,
    hasInflow: totalInflows > 0,
  };
}

export function buildDayNarrativesByKey(
  transactions: readonly TransactionGridTransaction[],
): Map<string, DayNarrative> {
  const groups = groupTransactionsByDay(transactions);
  const map = new Map<string, DayNarrative>();

  groups.forEach((group) => {
    map.set(group.dayKey, buildDayNarrative(group.dayKey, group.transactions));
  });

  return map;
}

export function resolveTransactionMonthKey(transaction: TransactionGridTransaction): string {
  return getTransactionDayKey(transaction).slice(0, 7);
}

export function resolvePeriodEndBalance(
  transactions: readonly TransactionGridTransaction[],
): number | null {
  const movements = transactions.filter(isRealMovement);
  if (movements.length === 0) {
    return null;
  }

  const chronological = sortByChronologicalAsc(movements);
  const last = chronological[chronological.length - 1];
  return last?.balance ?? null;
}
