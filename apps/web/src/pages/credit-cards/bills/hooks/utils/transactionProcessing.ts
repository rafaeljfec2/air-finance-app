import type { Extract, ExtractTransaction } from '@/services/creditCardService';

export interface BillTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export const generateTransactionId = (
  extractId: string | undefined,
  extractIndex: number,
  tx: ExtractTransaction,
  txIndex: number,
): string => {
  const extractIdValue = extractId ?? `extract-${extractIndex}`;
  return tx.fitId
    ? `${extractIdValue}-${tx.fitId}-${txIndex}`
    : `${extractIdValue}-${txIndex}-${tx.date}-${tx.description}-${tx.amount}`;
};

export const mapTransactionToBillTransaction = (
  tx: ExtractTransaction,
  extractId: string | undefined,
  extractIndex: number,
  txIndex: number,
): BillTransaction => {
  return {
    id: generateTransactionId(extractId, extractIndex, tx, txIndex),
    date: tx.date,
    description: tx.description,
    amount: typeof tx.amount === 'string' ? Number.parseFloat(tx.amount) : tx.amount,
    category: undefined,
  };
};

export const processExtractTransactions = (
  extracts: Extract[],
): BillTransaction[] => {
  // Backend already handles pagination, so we just process all transactions received
  const allTransactions = extracts.flatMap((extract, extractIndex) => {
    if (!extract?.transactions || !Array.isArray(extract.transactions) || extract.transactions.length === 0) {
      return [];
    }
    return extract.transactions.map((tx: ExtractTransaction, txIndex) =>
      mapTransactionToBillTransaction(tx, extract.id, extractIndex, txIndex),
    );
  });

  // Sort by date descending, then by id for consistent ordering
  return allTransactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return a.id.localeCompare(b.id);
  });
};

export const removeDuplicates = (transactions: BillTransaction[]): BillTransaction[] => {
  const seenIds = new Set<string>();
  return transactions.filter((tx) => {
    if (seenIds.has(tx.id)) {
      return false;
    }
    seenIds.add(tx.id);
    return true;
  });
};
