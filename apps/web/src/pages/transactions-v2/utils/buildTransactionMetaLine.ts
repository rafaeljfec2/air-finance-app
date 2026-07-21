import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

export function buildTransactionMetaLine(transaction: TransactionGridTransaction): string {
  const category = transaction.categoryId?.trim() || 'Sem categoria';
  const account = transaction.accountId?.trim() || 'Sem conta';
  return `${category} · ${account}`;
}
