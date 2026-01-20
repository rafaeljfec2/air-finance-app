import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { BankingIntegrationModal } from '@/components/accounts/BankingIntegrationModal';
import { StatementScheduleConfig } from '@/components/accounts/StatementScheduleConfig';
import { PierreConnectModal } from '@/components/accounts/PierreConnectModal';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useAccounts } from '@/hooks/useAccounts';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Account, CreateAccount } from '@/services/accountService';
import { useCompanyStore } from '@/stores/company';
import { companyService } from '@/services/companyService';
import { useMemo, useState, useEffect } from 'react';
import { AccountsEmptyState } from './components/AccountsEmptyState';
import { AccountsErrorState } from './components/AccountsErrorState';
import { AccountsFilters } from './components/AccountsFilters';
import { AccountsHeader } from './components/AccountsHeader';
import { AccountsList } from './components/AccountsList';
import { useAccountFilters } from './hooks/useAccountFilters';
import { useAccountSorting } from './hooks/useAccountSorting';

export function AccountsPage() {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAccounts();
  const { activeCompany, setActiveCompany } = useCompanyStore();
  const { canCreateAccount } = usePlanLimits();

  // Ensure documentType is loaded (fix for localStorage cache issue)
  useEffect(() => {
    if (activeCompany?.id && !activeCompany.documentType) {
      companyService.getById(activeCompany.id).then((company) => {
        setActiveCompany(company);
      }).catch((err) => {
        console.error('Failed to refresh company data:', err);
      });
    }
  }, [activeCompany?.id, activeCompany?.documentType, setActiveCompany]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBankingIntegrationModal, setShowBankingIntegrationModal] = useState(false);
  const [configuringAccount, setConfiguringAccount] = useState<Account | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingAccount, setSchedulingAccount] = useState<Account | null>(null);
  const [showPierreModal, setShowPierreModal] = useState(false);
  const [viewMode, setViewMode] = useViewMode('accounts-view-mode');

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterAccounts,
    hasActiveFilters,
  } = useAccountFilters();

  const { sortConfig, handleSort, sortAccounts } = useAccountSorting();

  const filteredAndSortedAccounts = useMemo(() => {
    if (!accounts) return [];
    const filtered = filterAccounts(accounts);
    return sortAccounts(filtered);
  }, [accounts, filterAccounts, sortAccounts]);

  const handleCreate = () => {
    setEditingAccount(null);
    setShowFormModal(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateAccount) => {
    if (!activeCompany?.id) return;

    if (editingAccount) {
      updateAccount({ id: editingAccount.id, data });
    } else {
      createAccount(data);
    }
    setShowFormModal(false);
    setEditingAccount(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAccount(deleteId);
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const handleConfigureIntegration = (account: Account) => {
    setConfiguringAccount(account);
    setShowBankingIntegrationModal(true);
  };

  const handleBankingIntegrationSuccess = () => {
    // Refresh accounts list to get updated integration status
    globalThis.location.reload();
  };

  const handleConfigureSchedule = (account: Account) => {
    setSchedulingAccount(account);
    setShowScheduleModal(true);
  };

  const handleConnectPierre = () => {
    setShowPierreModal(true);
  };

  const handlePierreSuccess = () => {
    // Refresh accounts list after Pierre import
    globalThis.location.reload();
  };

  // Check if company is CPF (to show Pierre button)
  const isPierreAvailable = activeCompany?.documentType === 'CPF';

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Loading size="large">Carregando contas bancárias, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <AccountsErrorState error={error} />;
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
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
          <AccountsHeader 
            onCreate={handleCreate} 
            canCreate={canCreateAccount}
            onConnectPierre={isPierreAvailable ? handleConnectPierre : undefined}
          />

          <AccountsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedAccounts.length === 0 ? (
            <AccountsEmptyState hasFilters={hasActiveFilters} onCreate={handleCreate} />
          ) : (
            <AccountsList
              accounts={filteredAndSortedAccounts}
              viewMode={viewMode}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onConfigureIntegration={handleConfigureIntegration}
              onConfigureSchedule={handleConfigureSchedule}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AccountFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmit}
        onConfigureIntegration={handleConfigureIntegration}
        account={editingAccount}
        isLoading={isCreating || isUpdating}
      />

      {configuringAccount && (
        <BankingIntegrationModal
          open={showBankingIntegrationModal}
          onClose={() => {
            setShowBankingIntegrationModal(false);
            setConfiguringAccount(null);
          }}
          account={configuringAccount}
          onSuccess={handleBankingIntegrationSuccess}
        />
      )}

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

      {isPierreAvailable && activeCompany && (
        <PierreConnectModal
          open={showPierreModal}
          onClose={() => setShowPierreModal(false)}
          companyId={activeCompany.id}
          onSuccess={handlePierreSuccess}
        />
      )}

      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão de conta"
        description={
          <div className="space-y-3">
            <p className="font-semibold">Tem certeza que deseja excluir esta conta?</p>
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
      />
    </ViewDefault>
  );
}
