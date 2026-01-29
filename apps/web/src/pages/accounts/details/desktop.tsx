import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { StatementScheduleConfig } from '@/components/accounts/StatementScheduleConfig';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { AccountCardsContainerDesktop } from './components/AccountCardsContainerDesktop';
import { AccountSummary } from './components/AccountSummary';
import { StatementCard } from './components/StatementCard';
import { AccountErrorState } from './components/AccountErrorState';
import { createInitialSummary } from './hooks/types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAccounts } from '@/hooks/useAccounts';
import type { Account, CreateAccount } from '@/services/accountService';

export function AccountDetailsPageDesktop() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accountId ?? '');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;
  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useStatementNavigation();

  const { updateAccount, deleteAccount, isUpdating, isDeleting } = useAccounts();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingAccount, setSchedulingAccount] = useState<Account | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const {
    accounts,
    currentStatement,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    pagination,
    isFetching,
  } = useAccountDetails(selectedAccountId, currentMonth, searchTermToSend);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const isSearching = searchInput !== debouncedSearch;

  useEffect(() => {
    if (accountId) {
      setSelectedAccountId(accountId);
    }
  }, [accountId]);

  const handleAccountSelect = (newAccountId: string) => {
    if (newAccountId !== selectedAccountId) {
      setSelectedAccountId(newAccountId);
      navigate(`/accounts/${newAccountId}/details`, { replace: true });
    }
  };

  const handleEditAccount = useCallback((account: Account) => {
    setEditingAccount(account);
    setShowFormModal(true);
  }, []);

  const handleSubmitEdit = useCallback(
    (data: CreateAccount) => {
      if (editingAccount) {
        updateAccount({ id: editingAccount.id, data });
      }
      setShowFormModal(false);
      setEditingAccount(null);
    },
    [editingAccount, updateAccount],
  );

  const handleConfigureSchedule = useCallback((account: Account) => {
    setSchedulingAccount(account);
    setShowScheduleModal(true);
  }, []);

  const handleDeleteAccount = useCallback((account: Account) => {
    setDeletingAccount(account);
    setShowConfirmDelete(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingAccount) {
      deleteAccount(deletingAccount.id);
      if (deletingAccount.id === selectedAccountId && accounts.length > 1) {
        const nextAccount = accounts.find((acc) => acc.id !== deletingAccount.id);
        if (nextAccount) {
          navigate(`/accounts/${nextAccount.id}/details`, { replace: true });
        }
      } else if (accounts.length <= 1) {
        navigate('/accounts', { replace: true });
      }
    }
    setShowConfirmDelete(false);
    setDeletingAccount(null);
  }, [deletingAccount, deleteAccount, selectedAccountId, accounts, navigate]);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setDeletingAccount(null);
  }, []);

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="-m-4 sm:-m-6 lg:-m-6">
          <AccountCardsContainerDesktop
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onEditAccount={handleEditAccount}
            onToggleAutoSync={handleConfigureSchedule}
            onDeleteAccount={handleDeleteAccount}
          />
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loading size="large">Carregando extrato, por favor aguarde...</Loading>
          </div>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="-m-4 sm:-m-6 lg:-m-6">
          <AccountCardsContainerDesktop
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onEditAccount={handleEditAccount}
            onToggleAutoSync={handleConfigureSchedule}
            onDeleteAccount={handleDeleteAccount}
          />
          <div className="container mx-auto px-4 py-4 lg:px-6">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <AccountErrorState error={error} />
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  const summary = currentStatement?.summary ?? createInitialSummary();

  return (
    <ViewDefault>
      <div className="-m-4 sm:-m-6 lg:-m-6">
        <AccountCardsContainerDesktop
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
          onEditAccount={handleEditAccount}
          onToggleAutoSync={handleConfigureSchedule}
          onDeleteAccount={handleDeleteAccount}
        />

        <AccountSummary summary={summary} />

        <div className="px-4 pb-6 lg:px-6">
          <StatementCard
            month={currentMonth}
            transactions={currentStatement?.transactions ?? []}
            totalTransactions={pagination.total}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            summary={summary}
            searchTerm={searchInput}
            onSearchChange={handleSearchChange}
            isSearching={isSearching || isFetching}
          />
        </div>
      </div>

      <AccountFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmitEdit}
        account={editingAccount}
        isLoading={isUpdating}
      />

      {schedulingAccount && (
        <StatementScheduleConfig
          open={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSchedulingAccount(null);
          }}
          accountId={schedulingAccount.id}
          accountName={schedulingAccount.name}
        />
      )}

      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão de conta"
        description={
          <div className="space-y-3">
            <p className="font-semibold">
              Tem certeza que deseja excluir a conta &quot;{deletingAccount?.name}&quot;?
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                ⚠️ Atenção: Esta ação irá deletar:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                <li>Todos os registros de transações vinculados a esta conta</li>
                <li>Todos os registros de extrato vinculados a esta conta</li>
                <li>A própria conta</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        }
        confirmLabel="Excluir tudo"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
        isLoading={isDeleting}
      />
    </ViewDefault>
  );
}

export default AccountDetailsPageDesktop;
