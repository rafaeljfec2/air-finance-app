import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DeleteAllUserDataModal } from '@/components/users/DeleteAllUserDataModal';
import { UserFormModal } from '@/components/users/UserFormModal';
import { useUsers } from '@/hooks/useUsers';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { CreateUser, User } from '@/services/userService';
import { Plus, Trash2, User as UserIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { UserCard } from './components/UserCard';
import { UserEmptyState } from './components/UserEmptyState';
import { UserFilters } from './components/UserFilters';
import { UserTableRow } from './components/UserTableRow';
import { getRoleBadgeColor, getStatusBadgeColor } from './utils/userHelpers';

export function UsersPage() {
  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUsers();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteAllDataModal, setShowDeleteAllDataModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useViewMode('users-view-mode');

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleCreate = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateUser) => {
    if (editingUser) {
      updateUser({ id: editingUser.id, data });
    } else {
      createUser(data);
    }
    setShowFormModal(false);
    setEditingUser(null);
  };

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Usuários</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie usuários do sistema
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteAllDataModal(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Deletar Dados
              </Button>
              <Button
                onClick={handleCreate}
                className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Novo Usuário
              </Button>
            </div>
          </div>

          {/* Busca e Filtros */}
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

          {/* Lista de Usuários */}
          {filteredUsers.length === 0 ? (
            <UserEmptyState
              hasFilters={searchTerm !== '' || filterRole !== 'all' || filterStatus !== 'all'}
              onCreateClick={handleCreate}
            />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isUpdating={isUpdating}
                      isDeleting={isDeleting}
                      getRoleBadgeColor={getRoleBadgeColor}
                      getStatusBadgeColor={getStatusBadgeColor}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border dark:border-border-dark">
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Nome
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Email
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Função
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Status
                          </th>
                          <th className="text-right p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <UserTableRow
                            key={user.id}
                            user={user}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isUpdating={isUpdating}
                            isDeleting={isDeleting}
                            getRoleBadgeColor={getRoleBadgeColor}
                            getStatusBadgeColor={getStatusBadgeColor}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <UserFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingUser(null);
        }}
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
    </ViewDefault>
  );
}
