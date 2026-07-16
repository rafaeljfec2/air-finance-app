import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

export interface PeriodTotals {
  readonly totalCredits: number;
  readonly totalDebits: number;
  readonly finalBalance: number;
}

export function computePeriodTotals(
  transactions: readonly TransactionGridTransaction[],
  liquidAccountIds: ReadonlySet<string>,
  selectedAccountId: string | undefined,
): PeriodTotals {
  let totalCredits = 0;
  let totalDebits = 0;

  transactions.forEach((transaction) => {
    if (transaction.id === 'previous-balance') {
      return;
    }

    if (!selectedAccountId) {
      const rawId = transaction.rawAccountId;
      if (rawId && !liquidAccountIds.has(rawId)) {
        return;
      }
    }

    if (transaction.launchType === 'revenue') {
      totalCredits += Math.abs(transaction.value);
    } else if (transaction.launchType === 'expense') {
      totalDebits += Math.abs(transaction.value);
    }
  });

  return {
    totalCredits,
    totalDebits,
    finalBalance: totalCredits - totalDebits,
  };
}
