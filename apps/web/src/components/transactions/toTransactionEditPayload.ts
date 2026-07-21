import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

/**
 * Restores raw account/category IDs after the grid replaces them with display labels.
 */
export function toTransactionEditPayload(
  transaction: TransactionGridTransaction,
): TransactionGridTransaction {
  return {
    ...transaction,
    accountId: transaction.rawAccountId ?? transaction.accountId,
    categoryId: transaction.rawCategoryId ?? transaction.categoryId,
  };
}
