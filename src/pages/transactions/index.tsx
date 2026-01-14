import { TransactionEditModal } from '@/components/transactions/TransactionEditModal';
import {
  TransactionGrid,
  type TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { BusinessLogsModal } from '@/pages/business-logs/components/BusinessLogsModal';
import { TransactionFilters } from '@/pages/transactions/components/TransactionFilters';
import { TransactionHeader } from '@/pages/transactions/components/TransactionHeader';
import { TransactionSummary } from '@/pages/transactions/components/TransactionSummary';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTransactionLogic } from './hooks/useTransactionLogic';

export function Transactions() {
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

  // Atualizar selectedAccountId quando a URL mudar
  useEffect(() => {
    const accountIdFromUrl = searchParams.get('accountId');
    setSelectedAccountId(accountIdFromUrl ?? undefined);
  }, [searchParams]);
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

  const {
    transactions: filteredTransactions,
    totals,
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

  const handleEdit = (transaction: TransactionGridTransaction) => {
    const txForEdit = {
      ...transaction,
      accountId:
        (transaction as TransactionGridTransaction & { rawAccountId?: string }).rawAccountId ||
        transaction.accountId,
    };
    setTransactionToEdit(txForEdit);
    setShowEditModal(true);
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
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Não foi possível excluir a transação. Tente novamente.';
      toast({
        title: 'Erro ao excluir',
        description: errorMessage,
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
        <div className="container mx-auto px-4 py-2 sm:py-4">
          {/* Header */}
          <TransactionHeader
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onNavigateToHistory={() => navigate('/business-logs')}
            onNavigateToNew={() => navigate('/transactions/new')}
          />

          {/* Totals Summary */}
          <TransactionSummary
            totalCredits={totals.totalCredits}
            totalDebits={totals.totalDebits}
            finalBalance={totals.finalBalance}
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
