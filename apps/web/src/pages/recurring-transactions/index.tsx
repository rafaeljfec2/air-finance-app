import { Loading } from '@/components/Loading';
import { RecurringTransactionFormModal } from '@/components/recurring-transactions/RecurringTransactionFormModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useRecurringTransactions } from '@/hooks/useRecurringTransactions';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import {
  CreateRecurringTransaction,
  RecurringTransaction,
} from '@/services/recurringTransactionService';
import { useCompanyStore } from '@/stores/company';
import { useMemo, useState } from 'react';
import { RecurringTransactionsEmptyState } from './components/RecurringTransactionsEmptyState';
import { RecurringTransactionsErrorState } from './components/RecurringTransactionsErrorState';
import { RecurringTransactionsFilters } from './components/RecurringTransactionsFilters';
import { RecurringTransactionsHeader } from './components/RecurringTransactionsHeader';
import { RecurringTransactionsList } from './components/RecurringTransactionsList';
import { useRecurringTransactionFilters } from './hooks/useRecurringTransactionFilters';
import { useRecurringTransactionSorting } from './hooks/useRecurringTransactionSorting';

export function RecurringTransactionsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const {
    recurringTransactions,
    isLoading,
    error,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRecurringTransactions(companyId);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRecurringTransaction, setEditingRecurringTransaction] =
    useState<RecurringTransaction | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode('recurring-transactions-view-mode');

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterFrequency,
    setFilterFrequency,
    filterTransactions,
    hasActiveFilters,
  } = useRecurringTransactionFilters();

  const { sortConfig, handleSort, sortTransactions } = useRecurringTransactionSorting(companyId);

  const filteredAndSortedTransactions = useMemo(() => {
    if (!recurringTransactions) return [];
    const filtered = filterTransactions(recurringTransactions);
    return sortTransactions(filtered);
  }, [recurringTransactions, filterTransactions, sortTransactions]);

  const handleCreate = () => {
    setEditingRecurringTransaction(null);
    setShowFormModal(true);
  };

  const handleEdit = (recurringTransaction: RecurringTransaction) => {
    setEditingRecurringTransaction(recurringTransaction);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateRecurringTransaction) => {
    if (editingRecurringTransaction) {
      updateRecurringTransaction({ id: editingRecurringTransaction.id, data });
    } else {
      createRecurringTransaction(data);
    }
    setShowFormModal(false);
    setEditingRecurringTransaction(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteRecurringTransaction(deleteId);
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Loading size="large">Carregando transações recorrentes, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <RecurringTransactionsErrorState error={error} />;
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar transações recorrentes, você precisa criar uma empresa primeiro.
            </p>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <RecurringTransactionsHeader onCreate={handleCreate} />

          <RecurringTransactionsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            filterFrequency={filterFrequency}
            onFilterFrequencyChange={setFilterFrequency}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedTransactions.length === 0 ? (
            <RecurringTransactionsEmptyState
              hasFilters={hasActiveFilters}
              onCreate={handleCreate}
            />
          ) : (
            <RecurringTransactionsList
              transactions={filteredAndSortedTransactions}
              viewMode={viewMode}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <RecurringTransactionFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingRecurringTransaction(null);
        }}
        onSubmit={handleSubmit}
        recurringTransaction={editingRecurringTransaction}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação recorrente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
