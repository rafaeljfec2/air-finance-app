import type { Transaction } from '@/services/transactionService';

export function filterTransactionsByAccountIds(
  transactions: ReadonlyArray<Transaction>,
  accountIds: ReadonlySet<string>,
): Transaction[] {
  if (accountIds.size === 0) {
    return [];
  }

  return transactions.filter((transaction) => accountIds.has(transaction.accountId));
}
