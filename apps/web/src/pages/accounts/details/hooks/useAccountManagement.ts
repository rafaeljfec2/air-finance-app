import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import type { Account, CreateAccount } from '@/services/accountService';
import { resyncItem } from '@/services/openiService';

interface UseAccountManagementParams {
  readonly accounts: ReadonlyArray<Account>;
  readonly selectedAccountId: string;
  readonly onSelectAccount: (id: string) => void;
  readonly companyId: string;
}

export function useAccountManagement({
  accounts,
  selectedAccountId,
  onSelectAccount,
  companyId,
}: UseAccountManagementParams) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { createAccount, updateAccount, deleteAccount, isCreating, isUpdating, isDeleting } =
    useAccounts();

  const resyncMutation = useMutation({
    mutationFn: ({ accountId, itemId }: { accountId: string; itemId: string }) =>
      resyncItem(companyId, accountId, itemId),
    onSuccess: () => {
      toast.success('Ressincronização iniciada');
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message ?? 'Erro ao ressincronizar conta';
      toast.error(message);
    },
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingAccount, setSchedulingAccount] = useState<Account | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const handleAddAccount = useCallback(() => {
    setEditingAccount(null);
    setShowFormModal(true);
  }, []);

  const handleEditAccount = useCallback((account: Account) => {
    setEditingAccount(account);
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

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingAccount(null);
  }, []);

  const handleConfigureSchedule = useCallback((account: Account) => {
    setSchedulingAccount(account);
    setShowScheduleModal(true);
  }, []);

  const handleCloseScheduleModal = useCallback(() => {
    setShowScheduleModal(false);
    setSchedulingAccount(null);
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
          onSelectAccount(nextAccount.id);
        }
      } else if (accounts.length <= 1) {
        navigate('/accounts', { replace: true });
      }
    }
    setShowConfirmDelete(false);
    setDeletingAccount(null);
  }, [deletingAccount, deleteAccount, selectedAccountId, accounts, navigate, onSelectAccount]);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setDeletingAccount(null);
  }, []);

  const handleResyncAccount = useCallback(
    (account: Account) => {
      const itemId = account.openiItemId ?? account.integration?.openFinance?.itemId;
      if (!itemId) {
        toast.error('Conta não possui conexão Open Finance para ressincronizar');
        return;
      }
      resyncMutation.mutate({ accountId: account.id, itemId });
    },
    [resyncMutation],
  );

  return {
    formModal: {
      isOpen: showFormModal,
      account: editingAccount,
      isLoading: isCreating || isUpdating,
      onClose: handleCloseFormModal,
      onSubmit: handleSubmitAccount,
    },
    scheduleModal: {
      isOpen: showScheduleModal,
      account: schedulingAccount,
      onClose: handleCloseScheduleModal,
    },
    deleteModal: {
      isOpen: showConfirmDelete,
      account: deletingAccount,
      isLoading: isDeleting,
      onConfirm: confirmDelete,
      onCancel: cancelDelete,
    },
    handlers: {
      onAddAccount: handleAddAccount,
      onEditAccount: handleEditAccount,
      onConfigureSchedule: handleConfigureSchedule,
      onResyncAccount: handleResyncAccount,
      onDeleteAccount: handleDeleteAccount,
    },
  };
}
