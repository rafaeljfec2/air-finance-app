import { useUsers } from '@/hooks/useUsers';
import { useCompanyStore } from '@/stores/company';
import { CreateUser, User, assignCompanyRole } from '@/services/userService';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Hook to manage user form state and submission logic
 */
export const useUserForm = () => {
  const { activeCompany } = useCompanyStore();
  const queryClient = useQueryClient();
  const { createUser, updateUser } = useUsers();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleCreate = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingUser(null);
  };

  const handleAssignRole = async (userId: string, role: string) => {
    if (!activeCompany) return;
    try {
      await assignCompanyRole(userId, activeCompany.id, role);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleSubmit = async (data: CreateUser) => {
    try {
      const { role, ...userData } = data;
      let targetUserId = editingUser?.id;

      if (editingUser) {
        // Update existing user - preserve global role
        // CRITICAL: Use ONLY the companies from userData (which comes from the form)
        // NEVER add the active company automatically when editing
        const globalRole = editingUser.role;
        await updateUser({
          id: editingUser.id,
          data: { ...userData, role: globalRole },
        });
        // DO NOT assign company role when editing - userData already contains the correct companies
      } else {
        // Create new user with default global role
        const userToCreate = {
          ...userData,
          role: 'user',
          companyIds: activeCompany ? [activeCompany.id] : [],
        } as CreateUser;

        const newUser = await createUser(userToCreate);
        targetUserId = newUser.id;

        // Assign company role if active company and role provided (only for new users)
        if (activeCompany && targetUserId && role) {
          await handleAssignRole(targetUserId, role);
        }
      }

      // Handle global role update if no active company
      const globalRoles = ['god', 'sys_admin', 'user'];
      const isGlobalRole = globalRoles.includes(role);

      if (!activeCompany && isGlobalRole && targetUserId) {
        await updateUser({
          id: targetUserId,
          data: { ...userData, role: role as 'god' | 'sys_admin' | 'user' | 'admin' },
        });
      }

      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Falha ao salvar usuário', error);
      throw error;
    }
  };

  return {
    showFormModal,
    editingUser,
    handleCreate,
    handleEdit,
    handleCloseModal,
    handleSubmit,
  };
};
