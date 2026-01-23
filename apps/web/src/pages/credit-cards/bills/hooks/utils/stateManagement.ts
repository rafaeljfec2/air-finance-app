import type { BillTransaction } from './transactionProcessing';
import { removeDuplicates } from './transactionProcessing';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  totalAmount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const createInitialPaginationState = (): PaginationState => ({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  totalAmount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

export const updateTransactionsForFirstPage = (
  pageTransactions: BillTransaction[],
  setAllTransactions: (transactions: BillTransaction[]) => void,
): void => {
  const uniqueTransactions = removeDuplicates(pageTransactions);
  setAllTransactions(uniqueTransactions);
};

export const updateTransactionsForNextPage = (
  pageTransactions: BillTransaction[],
  _currentTransactions: BillTransaction[],
  setAllTransactions: (updater: (prev: BillTransaction[]) => BillTransaction[]) => void,
): void => {
  setAllTransactions((prev) => {
    const existingIds = new Set(prev.map((t) => t.id));
    const newTransactions = pageTransactions.filter((t) => !existingIds.has(t.id));
    const uniqueNewTransactions = removeDuplicates(newTransactions);
    return [...prev, ...uniqueNewTransactions];
  });
};

export const updateTransactionsState = (
  pageTransactions: BillTransaction[],
  currentPage: number,
  currentTransactions: BillTransaction[],
  setAllTransactions: {
    (transactions: BillTransaction[]): void;
    (updater: (prev: BillTransaction[]) => BillTransaction[]): void;
  },
): void => {
  if (currentPage === 1) {
    updateTransactionsForFirstPage(pageTransactions, setAllTransactions);
  } else {
    updateTransactionsForNextPage(pageTransactions, currentTransactions, setAllTransactions);
  }
};
