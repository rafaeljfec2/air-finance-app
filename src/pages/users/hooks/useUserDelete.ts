import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';

/**
 * Hook to manage user deletion flow
 */
export const useUserDelete = () => {
  const { deleteUser } = useUsers();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteUser(deleteId);
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  return {
    showConfirmDelete,
    deleteId,
    handleDelete,
    confirmDelete,
    cancelDelete,
  };
};
