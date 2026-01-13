import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DeleteAllUserDataModal } from '@/components/users/DeleteAllUserDataModal';
import { UserFormModal } from '@/components/users/UserFormModal';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { ViewDefault } from '@/layouts/ViewDefault';
import { User, assignCompanyRole } from '@/services/userService';
import { useCompanyStore } from '@/stores/company';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UsersHeader } from './components/UsersHeader';
import { UsersList } from './components/UsersList';
import { UserEmptyState } from './components/UserEmptyState';
import { UserFilters } from './components/UserFilters';
import { UserPermissionsModal } from './components/UserPermissionsModal';
import { useCanDeleteUser } from './hooks/useCanDeleteUser';
import { useUserDelete } from './hooks/useUserDelete';
import { useUserFilters } from './hooks/useUserFilters';
import { useUserForm } from './hooks/useUserForm';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { activeCompany } = useCompanyStore();
  const queryClient = useQueryClient();
  const { users, isLoading, error, isCreating, isUpdating, isDeleting } = useUsers();

  const { canDeleteUser } = useCanDeleteUser();
  const { showFormModal, editingUser, handleCreate, handleEdit, handleCloseModal, handleSubmit } =
    useUserForm();
  const { showConfirmDelete, handleDelete, confirmDelete, cancelDelete } = useUserDelete();
  const {
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    viewMode,
    setViewMode,
    filteredUsers,
    hasActiveFilters,
  } = useUserFilters(users);

  const [showDeleteAllDataModal, setShowDeleteAllDataModal] = useState(false);
  const [permissionsUser, setPermissionsUser] = useState<User | null>(null);

  const handleAssignRole = async (userId: string, role: string) => {
    if (!activeCompany) return;
    try {
      await assignCompanyRole(userId, activeCompany.id, role);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleViewPermissions = (user: User) => {
    setPermissionsUser(user);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Loading size="large">Carregando usuários, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="text-red-500">Erro ao carregar usuários: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <UsersHeader
            onCreateClick={handleCreate}
            onDeleteAllDataClick={() => setShowDeleteAllDataModal(true)}
            canDeleteAllData={currentUser?.role === 'god'}
          />

          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterRole={filterRole}
            onRoleChange={setFilterRole}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredUsers.length === 0 ? (
            <UserEmptyState hasFilters={hasActiveFilters} onCreateClick={handleCreate} />
          ) : (
            <UsersList
              users={filteredUsers}
              viewMode={viewMode}
              activeCompanyId={activeCompany?.id}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssignRole={handleAssignRole}
              onViewPermissions={handleViewPermissions}
              canDeleteUser={canDeleteUser}
            />
          )}
        </div>
      </div>

      <UserFormModal
        open={showFormModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={editingUser}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />

      <DeleteAllUserDataModal
        open={showDeleteAllDataModal}
        onClose={() => setShowDeleteAllDataModal(false)}
      />

      {permissionsUser && (
        <UserPermissionsModal
          open={!!permissionsUser}
          onClose={() => setPermissionsUser(null)}
          role={
            activeCompany
              ? (permissionsUser.companyRoles?.[activeCompany.id] ?? 'viewer')
              : permissionsUser.role
          }
          userName={permissionsUser.name}
        />
      )}
    </ViewDefault>
  );
}
