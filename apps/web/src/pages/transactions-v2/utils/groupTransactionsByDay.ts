import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import { formatTransactionDate } from '@/components/transactions/TransactionGrid.utils';

export interface TimelineDayGroup {
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly transactions: readonly TransactionGridTransaction[];
}

export function getTransactionDayKey(transaction: TransactionGridTransaction): string {
  const baseDate = transaction.paymentDate || transaction.createdAt;
  return formatTransactionDate(baseDate, 'yyyy-MM-dd');
}

export function getTransactionDayLabel(dayKey: string): string {
  if (dayKey === 'previous-balance') {
    return 'Antes do período';
  }

  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function sortTransactionsByDateDesc(
  transactions: readonly TransactionGridTransaction[],
): TransactionGridTransaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.paymentDate || a.createdAt).getTime();
    const dateB = new Date(b.paymentDate || b.createdAt).getTime();

    if (dateA === dateB) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return dateB - dateA;
  });
}

function compareDayKeysDesc(a: string, b: string): number {
  if (a === 'previous-balance') return 1;
  if (b === 'previous-balance') return -1;
  return b.localeCompare(a);
}

export function groupTransactionsByDay(
  transactions: readonly TransactionGridTransaction[],
): readonly TimelineDayGroup[] {
  const groups = new Map<string, TransactionGridTransaction[]>();

  transactions.forEach((transaction) => {
    const dayKey =
      transaction.id === 'previous-balance'
        ? 'previous-balance'
        : getTransactionDayKey(transaction);

    const current = groups.get(dayKey) ?? [];
    current.push(transaction);
    groups.set(dayKey, current);
  });

  return [...groups.entries()]
    .sort(([dayA], [dayB]) => compareDayKeysDesc(dayA, dayB))
    .map(([dayKey, dayTransactions]) => ({
      dayKey,
      dayLabel: getTransactionDayLabel(dayKey),
      transactions: sortTransactionsByDateDesc(dayTransactions),
    }));
}
