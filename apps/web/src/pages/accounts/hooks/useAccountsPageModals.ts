import { useState, useCallback } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useCompanyStore } from '@/stores/company';
import { companyService } from '@/services/companyService';
import type { Account, CreateAccount } from '@/services/accountService';

interface OpenFinanceCompanyData {
  readonly openiTenantId?: string;
  readonly companyDocument?: string;
}

export function useAccountsPageModals() {
  const { activeCompany, setActiveCompany } = useCompanyStore();
  const { createAccount, updateAccount, deleteAccount, isCreating, isUpdating, isDeleting } =
    useAccounts();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBankingIntegrationModal, setShowBankingIntegrationModal] = useState(false);
  const [configuringAccount, setConfiguringAccount] = useState<Account | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingAccount, setSchedulingAccount] = useState<Account | null>(null);
  const [showPierreModal, setShowPierreModal] = useState(false);
  const [showOpenFinanceModal, setShowOpenFinanceModal] = useState(false);
  const [openFinanceCompanyData, setOpenFinanceCompanyData] =
    useState<OpenFinanceCompanyData | null>(null);

  const handleCreate = useCallback(() => {
    setEditingAccount(null);
    setShowFormModal(true);
  }, []);

  const handleEdit = useCallback((account: Account) => {
    setEditingAccount(account);
    setShowFormModal(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingAccount(null);
  }, []);

  const handleSubmit = useCallback(
    (data: CreateAccount) => {
      if (!activeCompany?.id) return;

      if (editingAccount) {
        updateAccount({ id: editingAccount.id, data });
      } else {
        createAccount(data);
      }
      setShowFormModal(false);
      setEditingAccount(null);
    },
    [activeCompany?.id, editingAccount, updateAccount, createAccount],
  );

  const handleDelete = useCallback((id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      deleteAccount(deleteId);
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  }, [deleteId, deleteAccount]);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  }, []);

  const handleConfigureIntegration = useCallback((account: Account) => {
    setConfiguringAccount(account);
    setShowBankingIntegrationModal(true);
  }, []);

  const handleCloseBankingIntegrationModal = useCallback(() => {
    setShowBankingIntegrationModal(false);
    setConfiguringAccount(null);
  }, []);

  const handleConfigureSchedule = useCallback((account: Account) => {
    setSchedulingAccount(account);
    setShowScheduleModal(true);
  }, []);

  const handleCloseScheduleModal = useCallback(() => {
    setShowScheduleModal(false);
    setSchedulingAccount(null);
  }, []);

  const handleConnectPierre = useCallback(() => {
    setShowPierreModal(true);
  }, []);

  const handleClosePierreModal = useCallback(() => {
    setShowPierreModal(false);
  }, []);

  const handleConnectOpenFinance = useCallback(async () => {
    if (activeCompany?.id) {
      try {
        const company = await companyService.getById(activeCompany.id);
        setActiveCompany(company);
        setOpenFinanceCompanyData({
          openiTenantId: company.openiTenantId,
          companyDocument: company.cnpj,
        });
        setShowOpenFinanceModal(true);
      } catch (err) {
        console.error('Failed to refresh company data:', err);
        setOpenFinanceCompanyData({
          openiTenantId: activeCompany.openiTenantId,
          companyDocument: activeCompany.cnpj,
        });
        setShowOpenFinanceModal(true);
      }
    } else {
      setOpenFinanceCompanyData(null);
      setShowOpenFinanceModal(true);
    }
  }, [activeCompany, setActiveCompany]);

  const handleCloseOpenFinanceModal = useCallback(() => {
    setShowOpenFinanceModal(false);
    setOpenFinanceCompanyData(null);
  }, []);

  const handleIntegrationSuccess = useCallback(async () => {
    if (activeCompany?.id) {
      try {
        const updatedCompany = await companyService.getById(activeCompany.id);
        setActiveCompany(updatedCompany);
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        console.error('Failed to refresh company data:', err);
      }
    }
    globalThis.location.reload();
  }, [activeCompany?.id, setActiveCompany]);

  return {
    formModal: {
      isOpen: showFormModal,
      account: editingAccount,
      isLoading: isCreating || isUpdating,
      onClose: handleCloseFormModal,
      onSubmit: handleSubmit,
    },
    deleteModal: {
      isOpen: showConfirmDelete,
      isLoading: isDeleting,
      onConfirm: confirmDelete,
      onCancel: cancelDelete,
    },
    bankingIntegrationModal: {
      isOpen: showBankingIntegrationModal,
      account: configuringAccount,
      onClose: handleCloseBankingIntegrationModal,
      onSuccess: handleIntegrationSuccess,
    },
    scheduleModal: {
      isOpen: showScheduleModal,
      account: schedulingAccount,
      onClose: handleCloseScheduleModal,
    },
    pierreModal: {
      isOpen: showPierreModal,
      onClose: handleClosePierreModal,
      onSuccess: handleIntegrationSuccess,
    },
    openFinanceModal: {
      isOpen: showOpenFinanceModal,
      companyData: openFinanceCompanyData,
      onClose: handleCloseOpenFinanceModal,
      onSuccess: handleIntegrationSuccess,
    },
    handlers: {
      onCreate: handleCreate,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onConfigureIntegration: handleConfigureIntegration,
      onConfigureSchedule: handleConfigureSchedule,
      onConnectPierre: handleConnectPierre,
      onConnectOpenFinance: handleConnectOpenFinance,
    },
  };
}
