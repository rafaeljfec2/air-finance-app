import type { Account } from '@/services/accountService';
import type { Transaction } from '@/services/transactionService';

export interface DayCardStats {
  readonly expensesTotal: number;
  readonly expensesCount: number;
  readonly cardsTotal: number;
  readonly cardsCount: number;
  readonly installmentsTotal: number;
  readonly installmentsCount: number;
  readonly refundsTotal: number;
  readonly refundsCount: number;
}

/**
 * Aggregates a single day's transactions into the four calendar mini stats:
 * expenses, spend on credit cards, installment purchases and card refunds.
 */
export function buildDayCardStats(
  transactions: readonly Transaction[],
  accounts: readonly Account[],
): DayCardStats {
  const cardAccountIds = new Set(
    accounts.filter((account) => account.type === 'credit_card').map((account) => account.id),
  );

  let expensesTotal = 0;
  let expensesCount = 0;
  let cardsTotal = 0;
  const cardsUsed = new Set<string>();
  let installmentsTotal = 0;
  let installmentsCount = 0;
  let refundsTotal = 0;
  let refundsCount = 0;

  for (const transaction of transactions) {
    const amount = Math.abs(transaction.value);
    const isCardAccount = cardAccountIds.has(transaction.accountId);

    if (transaction.launchType === 'expense') {
      expensesTotal += amount;
      expensesCount += 1;

      if (isCardAccount) {
        cardsTotal += amount;
        cardsUsed.add(transaction.accountId);
      }

      if (transaction.quantityInstallments > 1) {
        installmentsTotal += amount;
        installmentsCount += 1;
      }
      continue;
    }

    if (isCardAccount) {
      refundsTotal += amount;
      refundsCount += 1;
    }
  }

  return {
    expensesTotal,
    expensesCount,
    cardsTotal,
    cardsCount: cardsUsed.size,
    installmentsTotal,
    installmentsCount,
    refundsTotal,
    refundsCount,
  };
}
