import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid';
import type { Account } from '@/services/accountService';
import type { ExtractResponse, ExtractTransaction } from '@/services/transactionService';

export type ExtractGridTransaction = TransactionGridTransaction & { accountKey?: string };

export function transformExtractTransactions(
  extracts: ExtractResponse[],
  accounts: Account[] | undefined,
  categoryMap: Map<string, string>,
  companyId: string,
): ExtractGridTransaction[] {
  if (!extracts || extracts.length === 0) {
    return [];
  }

  const seenKeys = new Set<string>();

  return extracts.flatMap((extract, extractIndex) => {
    if (!extract?.transactions || extract.transactions.length === 0) {
      return [];
    }

    let matchedAccount = undefined;
    if (extract.accountId) {
      matchedAccount = accounts?.find((acc) => acc.id === extract.accountId);
    }
    if (!matchedAccount && extract.header?.account) {
      matchedAccount = accounts?.find((acc) => acc.accountNumber === extract.header?.account);
    }

    const accountNumberDisplay =
      matchedAccount?.accountNumber || extract.header?.account || extract.accountId || '';

    const accountLabel = matchedAccount
      ? `${matchedAccount.name} (${matchedAccount.accountNumber})`
      : accountNumberDisplay;

    const accountKey =
      matchedAccount?.id || extract.accountId || extract.header?.account || 'unknown';

    return extract.transactions.flatMap((tx: ExtractTransaction, index: number) => {
      // Some banks reuse fitId for linked transactions (e.g. IOF and Credits).
      // uniqueKey considers amount and date to distinguish valid collisions
      // while catching true duplicates (same file imported twice).
      const compositeKey = tx.fitId
        ? `${tx.fitId}-${tx.amount}-${tx.date}`
        : `${extract.id}-${extractIndex}-${index}`;

      if (seenKeys.has(compositeKey)) {
        return [];
      }
      seenKeys.add(compositeKey);

      const isoDate = tx.date ? `${tx.date}T00:00:00` : new Date().toISOString();
      const amountNum = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount) || 0;
      const isRevenue = amountNum >= 0;
      const normalizedValue = isRevenue ? Math.abs(amountNum) : -Math.abs(amountNum);

      const uniqueId = tx.fitId
        ? `${tx.fitId}_${extractIndex}_${index}`
        : `${extract.id ?? 'extract'}_${extractIndex}_${index}`;

      const categoryName = tx.categoryId
        ? (categoryMap.get(tx.categoryId) ?? 'Extrato bancário')
        : 'Extrato bancário';

      return [
        {
          id: uniqueId,
          description: tx.description || 'Sem descrição',
          value: normalizedValue,
          launchType: isRevenue ? 'revenue' : 'expense',
          valueType: 'fixed',
          companyId: extract.companyId || companyId || 'sem-company',
          accountId: accountLabel,
          accountKey,
          categoryId: categoryName,
          paymentDate: isoDate,
          issueDate: isoDate,
          quantityInstallments: 1,
          repeatMonthly: false,
          observation: tx.fitId,
          reconciled: true,
          createdAt: isoDate,
          updatedAt: isoDate,
        } as ExtractGridTransaction,
      ];
    });
  });
}
