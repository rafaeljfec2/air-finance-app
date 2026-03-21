import { useState, useCallback } from 'react';

import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import type { Account, CreateAccount } from '@/services/accountService';
import { companyService } from '@/services/companyService';
import { openBankingService, type OpenBankingEntitlement } from '@/services/subscriptionService';
import { useCompanyStore } from '@/stores/company';

interface OpenFinanceCompanyData {
  readonly openiTenantId?: string;
  readonly companyDocument?: string;
}

interface UseAccountsPageModalsOptions {
  readonly isGod?: boolean;
}

export function useAccountsPageModals({ isGod = false }: UseAccountsPageModalsOptions = {}) {
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
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallEntitlement, setPaywallEntitlement] = useState<OpenBankingEntitlement | null>(null);

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
    if (!activeCompany?.id) {
      setOpenFinanceCompanyData(null);
      setShowOpenFinanceModal(true);
      return;
    }

    try {
      const [company, entitlement] = await Promise.all([
        companyService.getById(activeCompany.id),
        openBankingService.getEntitlement(activeCompany.id),
      ]);

      setActiveCompany(company);

      const godBypass = isGod || entitlement.isGodBypass;

      if (!godBypass && (entitlement.entitledSlots === 0 || !entitlement.canConnect)) {
        setPaywallEntitlement(entitlement);
        setShowPaywallModal(true);
        return;
      }

      setOpenFinanceCompanyData({
        openiTenantId: company.openiTenantId,
        companyDocument: company.cnpj,
      });
      setShowOpenFinanceModal(true);
    } catch (err) {
      console.error('Failed to check Open Banking entitlement:', err);
      toast.error('Não foi possível verificar o acesso ao Open Banking. Tente novamente.');
    }
  }, [activeCompany, setActiveCompany, isGod]);

  const handleCloseOpenFinanceModal = useCallback(() => {
    setShowOpenFinanceModal(false);
    setOpenFinanceCompanyData(null);
  }, []);

  const handleClosePaywallModal = useCallback(() => {
    setShowPaywallModal(false);
    setPaywallEntitlement(null);
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
    paywallModal: {
      isOpen: showPaywallModal,
      entitlement: paywallEntitlement,
      onClose: handleClosePaywallModal,
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
