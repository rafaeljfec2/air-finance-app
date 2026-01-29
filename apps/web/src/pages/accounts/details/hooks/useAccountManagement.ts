import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '@/hooks/useAccounts';
import type { Account, CreateAccount } from '@/services/accountService';

interface UseAccountManagementParams {
  readonly accounts: ReadonlyArray<Account>;
  readonly selectedAccountId: string;
  readonly onSelectAccount: (id: string) => void;
}

export function useAccountManagement({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: UseAccountManagementParams) {
  const navigate = useNavigate();
  const { createAccount, updateAccount, deleteAccount, isCreating, isUpdating, isDeleting } =
    useAccounts();

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
      onDeleteAccount: handleDeleteAccount,
    },
  };
}
