import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import { toast } from '@/components/ui/toast';
import { useTransactionLogic } from '@/pages/transactions/hooks/useTransactionLogic';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';

import { computePeriodTotals } from '../utils/computePeriodTotals';
import { matchesValueRange, type ValueRangeFilter } from '../utils/valueRangeFilter';

import { useProgressiveReveal } from './useProgressiveReveal';

export interface TransactionsV2Controller {
  readonly searchTerm: string;
  readonly setSearchTerm: (value: string) => void;
  readonly startDate: string;
  readonly setStartDate: (value: string) => void;
  readonly endDate: string;
  readonly setEndDate: (value: string) => void;
  readonly selectedType: string;
  readonly setSelectedType: (value: string) => void;
  readonly selectedAccountId: string | undefined;
  readonly setSelectedAccountId: (value: string | undefined) => void;
  readonly selectedCategoryName: string | undefined;
  readonly setSelectedCategoryName: (value: string | undefined) => void;
  readonly selectedValueRange: ValueRangeFilter;
  readonly setSelectedValueRange: (value: ValueRangeFilter) => void;
  readonly activeFilterCount: number;
  readonly clearFilters: () => void;
  readonly periodTransactions: readonly TransactionGridTransaction[];
  readonly filteredTransactions: readonly TransactionGridTransaction[];
  readonly visibleTransactions: readonly TransactionGridTransaction[];
  readonly hasMore: boolean;
  readonly loadMore: () => void;
  readonly totals: {
    readonly totalCredits: number;
    readonly totalDebits: number;
    readonly finalBalance: number;
  };
  readonly movementCount: number;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly accounts: ReturnType<typeof useTransactionLogic>['accounts'];
  readonly categories: ReturnType<typeof useTransactionLogic>['categories'];
  readonly showConfirmDelete: boolean;
  readonly setShowConfirmDelete: (open: boolean) => void;
  readonly transactionToDelete: TransactionGridTransaction | null;
  readonly setTransactionToDelete: (transaction: TransactionGridTransaction | null) => void;
  readonly showEditModal: boolean;
  readonly setShowEditModal: (open: boolean) => void;
  readonly transactionToEdit: TransactionGridTransaction | null;
  readonly showCreateModal: boolean;
  readonly setShowCreateModal: (open: boolean) => void;
  readonly showHistoryModal: boolean;
  readonly setShowHistoryModal: (open: boolean) => void;
  readonly selectedTransactionId: string | null;
  readonly setSelectedTransactionId: (id: string | null) => void;
  readonly handleEdit: (transaction: TransactionGridTransaction) => void;
  readonly handleDelete: (transaction: TransactionGridTransaction) => void;
  readonly handleViewHistory: (transaction: TransactionGridTransaction) => void;
  readonly handleRetryPayment: (transaction: TransactionGridTransaction) => void;
  readonly confirmDelete: () => Promise<void>;
  readonly handlePreviousPeriod: () => void;
  readonly handleNextPeriod: () => void;
}

function shiftPeriodByMonth(startDate: string, endDate: string, direction: -1 | 1) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end) {
    return { startDate, endDate };
  }

  start.setMonth(start.getMonth() + direction);
  end.setMonth(end.getMonth() + direction);

  return {
    startDate: formatDateToLocalISO(start),
    endDate: formatDateToLocalISO(end),
  };
}

export function useTransactionsV2Controller(): TransactionsV2Controller {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return formatDateToLocalISO(firstDay);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return formatDateToLocalISO(lastDay);
  });
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    searchParams.get('accountId') ?? undefined,
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | undefined>(undefined);
  const [selectedValueRange, setSelectedValueRange] = useState<ValueRangeFilter>('any');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const accountIdFromUrl = searchParams.get('accountId');
    setSelectedAccountId(accountIdFromUrl ?? undefined);
  }, [searchParams]);

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const {
    transactions: periodTransactions,
    isLoading,
    isFetching,
    accounts,
    categories,
    deleteTransaction,
  } = useTransactionLogic({
    companyId,
    startDate,
    endDate,
    selectedAccountId,
    searchTerm,
    selectedType,
  });

  const filteredTransactions = useMemo(
    () =>
      periodTransactions.filter((transaction) => {
        if (transaction.id === 'previous-balance') {
          return true;
        }

        if (
          selectedCategoryName &&
          (transaction.categoryId || 'Sem categoria') !== selectedCategoryName
        ) {
          return false;
        }

        return matchesValueRange(Math.abs(transaction.value), selectedValueRange);
      }),
    [periodTransactions, selectedCategoryName, selectedValueRange],
  );

  const liquidAccountIds = useMemo(
    () =>
      new Set(
        accounts
          ?.filter((account) => ['checking', 'digital_wallet'].includes(account.type))
          .map((account) => account.id) ?? [],
      ),
    [accounts],
  );

  const totals = useMemo(
    () => computePeriodTotals(filteredTransactions, liquidAccountIds, selectedAccountId),
    [filteredTransactions, liquidAccountIds, selectedAccountId],
  );

  const revealResetKey = `${selectedAccountId}-${startDate}-${endDate}-${searchTerm}-${selectedType}-${selectedCategoryName}-${selectedValueRange}`;

  const {
    visibleCount,
    hasMore,
    revealMore: loadMore,
  } = useProgressiveReveal({
    totalCount: filteredTransactions.length,
    chunkSize: 20,
    resetKey: revealResetKey,
  });

  const visibleTransactions = useMemo(
    () => filteredTransactions.slice(0, visibleCount),
    [filteredTransactions, visibleCount],
  );

  const movementCount = useMemo(
    () =>
      filteredTransactions.filter((transaction) => transaction.id !== 'previous-balance').length,
    [filteredTransactions],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count += 1;
    if (selectedAccountId) count += 1;
    if (selectedCategoryName) count += 1;
    if (selectedType !== 'all') count += 1;
    if (selectedValueRange !== 'any') count += 1;
    return count;
  }, [searchTerm, selectedAccountId, selectedCategoryName, selectedType, selectedValueRange]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedAccountId(undefined);
    setSelectedCategoryName(undefined);
    setSelectedType('all');
    setSelectedValueRange('any');
  }, []);

  const handleEdit = useCallback((transaction: TransactionGridTransaction) => {
    const txForEdit = {
      ...transaction,
      accountId:
        (transaction as TransactionGridTransaction & { rawAccountId?: string }).rawAccountId ??
        transaction.accountId,
    };
    setTransactionToEdit(txForEdit);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((transaction: TransactionGridTransaction) => {
    setTransactionToDelete(transaction);
    setShowConfirmDelete(true);
  }, []);

  const handleViewHistory = useCallback((transaction: TransactionGridTransaction) => {
    setSelectedTransactionId(transaction.id);
    setShowHistoryModal(true);
  }, []);

  const handleRetryPayment = useCallback(
    (transaction: TransactionGridTransaction) => {
      if (!transaction.bankingPaymentId) return;
      const accountId = transaction.rawAccountId ?? transaction.accountId;
      navigate(`/payments/new?retry=${transaction.bankingPaymentId}&accountId=${accountId}`);
    },
    [navigate],
  );

  const confirmDelete = useCallback(async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete.id);
      toast({
        title: 'Transação excluída',
        description: 'A transação foi excluída com sucesso.',
        type: 'success',
      });
      setShowConfirmDelete(false);
      setTransactionToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Não foi possível excluir a transação. Tente novamente.';
      toast({
        title: 'Erro ao excluir',
        description: errorMessage,
        type: 'error',
      });
    }
  }, [deleteTransaction, transactionToDelete]);

  const handlePreviousPeriod = useCallback(() => {
    const next = shiftPeriodByMonth(startDate, endDate, -1);
    setStartDate(next.startDate);
    setEndDate(next.endDate);
  }, [startDate, endDate]);

  const handleNextPeriod = useCallback(() => {
    const next = shiftPeriodByMonth(startDate, endDate, 1);
    setStartDate(next.startDate);
    setEndDate(next.endDate);
  }, [startDate, endDate]);

  return {
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedType,
    setSelectedType,
    selectedAccountId,
    setSelectedAccountId,
    selectedCategoryName,
    setSelectedCategoryName,
    selectedValueRange,
    setSelectedValueRange,
    activeFilterCount,
    clearFilters,
    periodTransactions,
    filteredTransactions,
    visibleTransactions,
    hasMore,
    loadMore,
    totals,
    movementCount,
    isLoading,
    isFetching,
    accounts,
    categories,
    showConfirmDelete,
    setShowConfirmDelete,
    transactionToDelete,
    setTransactionToDelete,
    showEditModal,
    setShowEditModal,
    transactionToEdit,
    showCreateModal,
    setShowCreateModal,
    showHistoryModal,
    setShowHistoryModal,
    selectedTransactionId,
    setSelectedTransactionId,
    handleEdit,
    handleDelete,
    handleViewHistory,
    handleRetryPayment,
    confirmDelete,
    handlePreviousPeriod,
    handleNextPeriod,
  };
}
