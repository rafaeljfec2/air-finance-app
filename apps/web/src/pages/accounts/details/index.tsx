import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Loading } from '@/components/Loading';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { StatementScheduleConfig } from '@/components/accounts/StatementScheduleConfig';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useAccountDetails } from './hooks/useAccountDetails';
import { useStatementNavigation } from './hooks/useStatementNavigation';
import { AccountCardsContainer } from './components/AccountCardsContainer';
import { AccountStatementHeader } from './components/AccountStatementHeader';
import { AccountSummary } from './components/AccountSummary';
import { StatementTransactionList } from './components/StatementTransactionList';
import { AccountEmptyState } from './components/AccountEmptyState';
import { AccountErrorState } from './components/AccountErrorState';
import { AccountDetailsPageDesktop } from './desktop';
import { createInitialSummary } from './hooks/types';
import { useAccounts } from '@/hooks/useAccounts';
import type { Account, CreateAccount } from '@/services/accountService';

export function AccountDetailsPage() {
  const navigate = useNavigate();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useStatementNavigation();

  const { createAccount, updateAccount, deleteAccount, isCreating, isUpdating, isDeleting } =
    useAccounts();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingAccount, setSchedulingAccount] = useState<Account | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const {
    account,
    accounts,
    currentStatement,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    isInitialLoad,
  } = useAccountDetails(selectedAccountId, currentMonth);

  useEffect(() => {
    if (isLoading) return;

    if (accounts.length === 0) {
      navigate('/accounts', { replace: true });
      return;
    }

    if (!selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
      return;
    }

    const accountExists = accounts.some((acc) => acc.id === selectedAccountId);
    if (!accountExists) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, isLoading, navigate]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleAccountSelect = useCallback(
    (newAccountId: string) => {
      if (newAccountId !== selectedAccountId) {
        setSelectedAccountId(newAccountId);
      }
    },
    [selectedAccountId],
  );

  const handleAddAccount = useCallback(() => {
    setEditingAccount(null);
    setShowFormModal(true);
  }, []);

  const handleEditAccount = useCallback((acc: Account) => {
    setEditingAccount(acc);
    setShowFormModal(true);
  }, []);

  const handleSubmitAccount = useCallback(
    (data: CreateAccount) => {
      if (editingAccount) {
        updateAccount({ id: editingAccount.id, data });
      } else {
        createAccount(data);
      }
      setShowFormModal(false);
      setEditingAccount(null);
    },
    [editingAccount, updateAccount, createAccount],
  );

  const handleConfigureSchedule = useCallback((acc: Account) => {
    setSchedulingAccount(acc);
    setShowScheduleModal(true);
  }, []);

  const handleDeleteAccount = useCallback((acc: Account) => {
    setDeletingAccount(acc);
    setShowConfirmDelete(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingAccount) {
      deleteAccount(deletingAccount.id);
      if (deletingAccount.id === selectedAccountId && accounts.length > 1) {
        const nextAccount = accounts.find((acc) => acc.id !== deletingAccount.id);
        if (nextAccount) {
          setSelectedAccountId(nextAccount.id);
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

  const summary = currentStatement?.summary ?? createInitialSummary();

  if (isDesktop) {
    return <AccountDetailsPageDesktop />;
  }

  const renderModals = () => (
    <>
      <AccountFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmitAccount}
        account={editingAccount}
        isLoading={isCreating || isUpdating}
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
    </>
  );

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark pb-20 lg:pb-0">
          <AccountCardsContainer
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onMenuClick={() => setIsSidebarOpen(true)}
            onEditAccount={handleEditAccount}
            onToggleAutoSync={handleConfigureSchedule}
            onDeleteAccount={handleDeleteAccount}
            onAddAccount={handleAddAccount}
          />
          <div className="flex-1 flex items-center justify-center">
            <Loading size="large">Carregando extrato, por favor aguarde...</Loading>
          </div>
        </div>
        <MobileBottomNav onNewTransaction={() => setIsFabModalOpen(true)} />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
        {renderModals()}
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          <AccountCardsContainer
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onMenuClick={() => setIsSidebarOpen(true)}
            onEditAccount={handleEditAccount}
            onToggleAutoSync={handleConfigureSchedule}
            onDeleteAccount={handleDeleteAccount}
            onAddAccount={handleAddAccount}
          />
          <AccountStatementHeader
            month={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark">
            <AccountErrorState error={error} />
          </div>
        </div>
        <MobileBottomNav onNewTransaction={() => setIsFabModalOpen(true)} />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
        {renderModals()}
      </>
    );
  }

  if (!currentStatement && !isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          <AccountCardsContainer
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={handleAccountSelect}
            onMenuClick={() => setIsSidebarOpen(true)}
            onEditAccount={handleEditAccount}
            onToggleAutoSync={handleConfigureSchedule}
            onDeleteAccount={handleDeleteAccount}
            onAddAccount={handleAddAccount}
          />
          <AccountStatementHeader
            month={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            summary={summary}
          />
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark flex flex-col">
            <AccountSummary summary={summary} />
            <AccountEmptyState />
          </div>
        </div>
        <MobileBottomNav onNewTransaction={() => setIsFabModalOpen(true)} />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
        {renderModals()}
      </>
    );
  }

  if (!currentStatement || !account) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
        <AccountCardsContainer
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
          onMenuClick={() => setIsSidebarOpen(true)}
          onEditAccount={handleEditAccount}
          onToggleAutoSync={handleConfigureSchedule}
          onDeleteAccount={handleDeleteAccount}
          onAddAccount={handleAddAccount}
        />

        <AccountStatementHeader
          month={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          summary={currentStatement.summary}
        />

        <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark relative flex flex-col">
          {isLoading && !isInitialLoad && (
            <div className="absolute inset-0 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loading size="large">Carregando...</Loading>
            </div>
          )}
          <AccountSummary summary={currentStatement.summary} />

          <div className="flex-1 px-4 pb-4">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
              <StatementTransactionList
                transactions={currentStatement.transactions}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </div>
          </div>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <MobileBottomNav onNewTransaction={() => setIsFabModalOpen(true)} />

      <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      {renderModals()}
    </>
  );
}

export default AccountDetailsPage;
