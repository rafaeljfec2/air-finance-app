export type TransactionVisualWeight = 'micro' | 'standard' | 'relevant';

export const TRANSACTION_RELEVANCE_THRESHOLD = 500;
export const TRANSACTION_MICRO_THRESHOLD = 100;

export function classifyTransactionVisualWeight(absValue: number): TransactionVisualWeight {
  if (absValue >= TRANSACTION_RELEVANCE_THRESHOLD) {
    return 'relevant';
  }

  if (absValue < TRANSACTION_MICRO_THRESHOLD) {
    return 'micro';
  }

  return 'standard';
}
