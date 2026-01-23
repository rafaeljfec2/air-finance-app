import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from './usePagination';
import { useTransactionFilters } from './useTransactionFilters';
import { useTransactionSorting } from './useTransactionSorting';
import type {
  FilterValue,
  SortDirection,
  SortField,
  TransactionGridTransaction,
} from '../TransactionGrid.types';
import { calculateBalance } from '../TransactionGrid.utils';

interface UseTransactionGridStateProps {
  transactions: TransactionGridTransaction[];
  resetPageKey?: string | number;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
}

export function useTransactionGridState({
  transactions,
  resetPageKey,
  onActionClick,
}: UseTransactionGridStateProps) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'date',
    direction: 'asc',
  });
  const [activeFilter, setActiveFilter] = useState<SortField | null>(null);
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const { sortTransactions } = useTransactionSorting(sortConfig);
  const { getFilteredTransactions } = useTransactionFilters(filters);
  const {
    currentPage,
    itemsPerPageSelected,
    paginate,
    handlePageChange,
    handleItemsPerPageChange,
    resetPage,
  } = usePagination(10);

  const transactionsWithBalance = useMemo(
    () => calculateBalance(transactions),
    [transactions],
  );

  const sortedAndFilteredTransactions = useMemo(() => {
    const filtered = getFilteredTransactions(transactionsWithBalance);
    return sortTransactions(filtered);
  }, [getFilteredTransactions, sortTransactions, transactionsWithBalance]);

  const { paginatedItems, totalPages, startIndex, endIndex, totalItems } = useMemo(
    () => paginate(sortedAndFilteredTransactions),
    [paginate, sortedAndFilteredTransactions],
  );

  const previousResetPageKeyRef = useRef<string | number | undefined>(resetPageKey);
  const isInitialMountRef = useRef(true);
  const previousTransactionsLengthRef = useRef(0);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousResetPageKeyRef.current = resetPageKey;
      return;
    }

    if (previousResetPageKeyRef.current !== resetPageKey) {
      resetPage();
    }
    previousResetPageKeyRef.current = resetPageKey;
  }, [resetPageKey, resetPage]);

  useEffect(() => {
    if (sortedAndFilteredTransactions.length !== previousTransactionsLengthRef.current) {
      if (currentPage !== 1) {
        resetPage();
      }
      previousTransactionsLengthRef.current = sortedAndFilteredTransactions.length;
    }
  }, [sortedAndFilteredTransactions.length, currentPage, resetPage]);

  const handleFilterClick = useCallback(
    (field: SortField) => {
      setActiveFilter(activeFilter === field ? null : field);
    },
    [activeFilter],
  );

  const handleFilter = useCallback((field: SortField, values: Set<string>) => {
    setFilters((prev) => {
      const newFilters = prev.filter((f) => f.field !== field);
      if (values.size > 0) {
        newFilters.push({ field, values });
      }
      return newFilters;
    });
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleActionClick = useCallback(
    (transaction: TransactionGridTransaction) => {
      if (onActionClick) {
        onActionClick(transaction);
      } else {
        navigate(`/transactions/edit/${transaction.id}`);
      }
    },
    [onActionClick, navigate],
  );

  return {
    sortConfig,
    activeFilter,
    filters,
    currentPage,
    itemsPerPageSelected,
    paginatedItems,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handleFilterClick,
    handleFilter,
    toggleSort,
    handleActionClick,
    handlePageChange,
    handleItemsPerPageChange,
    setActiveFilter,
  };
}
