import { TransactionEditModal } from '@/components/transactions/TransactionEditModal';
import {
  TransactionGrid,
  type TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import { createPreviousBalanceRow } from '@/components/transactions/TransactionGrid.utils';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { usePreviousBalance, useTransactions } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { BusinessLogsModal } from '@/pages/business-logs/components/BusinessLogsModal';
import { TransactionFilters } from '@/pages/transactions/components/TransactionFilters';
import { TransactionHeader } from '@/pages/transactions/components/TransactionHeader';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {
  const navigate = useNavigate();
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
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { accounts } = useAccounts();
  const { categories } = useCategories(companyId);
  const {
    transactions = [],
    isLoading,
    isFetching,
    refetch,
    deleteTransaction,
  } = useTransactions(companyId, { startDate, endDate, accountId: selectedAccountId });

  const { previousBalance = 0 } = usePreviousBalance(companyId, startDate, selectedAccountId);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const accountMap = useMemo(() => {
    const map = new Map<string, string>();
    accounts?.forEach((a) => map.set(a.id, a.name));
    return map;
  }, [accounts]);

  const transactionsWithLabels = useMemo(
    () =>
      [...transactions].map((tx) => ({
        ...tx,
        categoryId: categoryMap.get(tx.categoryId) ?? tx.categoryId,
        accountId: accountMap.get(tx.accountId) ?? tx.accountId,
      })),
    [transactions, categoryMap, accountMap],
  );

  // Add previous balance row if startDate is set
  const transactionsWithPreviousBalance = useMemo(() => {
    let transactionsList = [...transactionsWithLabels];

    // Insert SALDO ANTERIOR if startDate exists
    if (startDate) {
      const previousBalanceRow = createPreviousBalanceRow(previousBalance, startDate);
      // Map labels for the previous balance row
      previousBalanceRow.categoryId = 'Saldo Anterior';
      previousBalanceRow.accountId = selectedAccountId
        ? (accountMap.get(selectedAccountId) ?? 'Todas')
        : 'Todas';
      transactionsList = [previousBalanceRow, ...transactionsList];
    }

    return transactionsList;
  }, [transactionsWithLabels, previousBalance, startDate, selectedAccountId, accountMap]);

  // Helper function to check if transaction matches search term
  const matchesSearchTerm = (description: string, search: string): boolean => {
    return description.toLowerCase().includes(search.toLowerCase());
  };

  // Helper function to check if transaction matches selected type
  const matchesTransactionType = (type: string, launchType: string): boolean => {
    if (type === 'all') {
      return true;
    }
    if (type === 'RECEITA' && launchType === 'revenue') {
      return true;
    }
    if (type === 'DESPESA' && launchType === 'expense') {
      return true;
    }
    return false;
  };

  // Helper function to check if transaction matches date period
  const matchesDatePeriod = (
    paymentDate: string,
    start: string | null,
    end: string | null,
  ): boolean => {
    if (!start && !end) {
      return true;
    }

    // Parse paymentDate as UTC (backend stores dates in UTC)
    const transactionDate = new Date(paymentDate);
    
    // Normalize transaction date to start of day in UTC for comparison
    const txDateUTC = new Date(Date.UTC(
      transactionDate.getUTCFullYear(),
      transactionDate.getUTCMonth(),
      transactionDate.getUTCDate(),
      0, 0, 0, 0
    ));

    if (start) {
      // Parse date string "YYYY-MM-DD" and create date in UTC
      const [year, month, day] = start.split('-').map(Number);
      const startDateUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      if (txDateUTC < startDateUTC) {
        return false;
      }
    }

    if (end) {
      // Parse date string "YYYY-MM-DD" and create date in UTC at end of day
      const [year, month, day] = end.split('-').map(Number);
      const endDateUTC = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      if (txDateUTC > endDateUTC) {
        return false;
      }
    }

    return true;
  };

  // Helper function to filter transactions
  const shouldIncludeTransaction = (transaction: TransactionGridTransaction): boolean => {
    // Always include previous balance row
    if (transaction.id === 'previous-balance') {
      return true;
    }

    const matchesSearch = matchesSearchTerm(transaction.description, searchTerm);
    const matchesType = matchesTransactionType(selectedType, transaction.launchType);
    const matchesPeriod = matchesDatePeriod(transaction.paymentDate, startDate, endDate);

    // Debug log for transactions that don't match
    if (!matchesSearch || !matchesType || !matchesPeriod) {
      console.debug('[Transaction Filter] Transaction excluded:', {
        id: transaction.id,
        description: transaction.description,
        paymentDate: transaction.paymentDate,
        launchType: transaction.launchType,
        value: transaction.value,
        matchesSearch,
        matchesType,
        matchesPeriod,
        searchTerm,
        selectedType,
        startDate,
        endDate,
      });
    }

    return matchesSearch && matchesType && matchesPeriod;
  };

  const filteredTransactions = [...transactionsWithPreviousBalance]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .filter(shouldIncludeTransaction);

  const handleEdit = (transaction: TransactionGridTransaction) => {
    // Find the original transaction with IDs (not labels) from the original transactions array
    const originalTransaction = transactions.find((tx) => tx.id === transaction.id);
    if (originalTransaction) {
      setTransactionToEdit(originalTransaction);
      setShowEditModal(true);
    }
  };

  const handleDelete = (transaction: TransactionGridTransaction) => {
    setTransactionToDelete(transaction);
    setShowConfirmDelete(true);
  };

  const handleViewHistory = (transaction: TransactionGridTransaction) => {
    setSelectedTransactionId(transaction.id);
    setShowHistoryModal(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await Promise.resolve(deleteTransaction(transactionToDelete.id));
      toast({
        title: 'Transação excluída',
        description: 'A transação foi excluída com sucesso.',
        type: 'success',
      });
      setShowConfirmDelete(false);
      setTransactionToDelete(null);
    } catch {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir a transação. Tente novamente.',
        type: 'error',
      });
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <TransactionHeader
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onNavigateToHistory={() => navigate('/business-logs')}
            onNavigateToNew={() => navigate('/transactions/new')}
          />

          {/* Filters and Search */}
          <TransactionFilters
            showFilters={showFilters}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            accounts={accounts}
            onSearch={() => refetch()}
          />

          {/* Transactions Grid */}
          <TransactionGrid
            transactions={filteredTransactions}
            isLoading={isLoading || isFetching}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewHistory={handleViewHistory}
            resetPageKey={selectedAccountId}
          />
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
      <TransactionEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        transaction={transactionToEdit}
        accounts={accounts ?? []}
        categories={categories ?? []}
      />
      <BusinessLogsModal
        open={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedTransactionId(null);
        }}
        entityId={selectedTransactionId || undefined}
        entityType="Transaction"
      />
    </ViewDefault>
  );
}
