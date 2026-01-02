import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DeleteAllUserDataModal } from '@/components/users/DeleteAllUserDataModal';
import { UserFormModal } from '@/components/users/UserFormModal';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { CreateUser, User, assignCompanyRole } from '@/services/userService';
import { useCompanyStore } from '@/stores/company';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, User as UserIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { UserCard } from './components/UserCard';
import { UserEmptyState } from './components/UserEmptyState';
import { UserFilters } from './components/UserFilters';
import { UserPermissionsModal } from './components/UserPermissionsModal';
import { UserTableRow } from './components/UserTableRow';
import {
  getEmailVerifiedBadgeColor,
  getOnboardingCompletedBadgeColor,
  getRoleBadgeColor,
  getStatusBadgeColor,
} from './utils/userHelpers';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { activeCompany } = useCompanyStore();
  const queryClient = useQueryClient();

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
  const [permissionsUser, setPermissionsUser] = useState<User | null>(null);
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

  const handleSubmit = async (data: CreateUser) => {
    try {
      // Separamos o papel (role) do restante dos dados do usuário
      // Se tivermos uma empresa ativa, o papel será atribuído especificamente para ela
      const { role, ...userData } = data;

      let targetUserId = editingUser?.id;

      if (editingUser) {
        // Atualizamos os dados do usuário (Nome, Email, etc)
        // Se for edição, mantemos o papel global original envio data.role seria sobrescrever globalmente
        // Para evitar isso, enviamos apenas userData.
        // Mas se a API exigir role, enviamos 'user' ou o original.
        // A CreateUserSchema exige role? Sim.
        // Então enviamos o role original do usuário se existir, ou 'user'.
        const globalRole = editingUser.role;

        await updateUser({
          id: editingUser.id,
          data: { ...userData, role: globalRole },
        });
      } else {
        // Criação de usuário
        // Criamos com o papel global 'user' por padrão se estivermos em contexto de empresa
        // Ou usamos o papel selecionado se quisermos dar permissão global (mas a UI sugere contexto de empresa)
        // Vamos assumir que criamos como 'user' global e damos permissão na empresa
        const userToCreate = {
          ...userData,
          role: 'user', // Default global role
          companyIds: activeCompany ? [activeCompany.id] : [],
        } as CreateUser;

        const newUser = await createUser(userToCreate);
        targetUserId = newUser.id;
      }

      // Se temos uma empresa ativa e um papel selecionado, atribuímos o papel na empresa
      if (activeCompany && targetUserId && role) {
        await handleAssignRole(targetUserId, role);
      }

      // Se não tem empresa ativa (admin global gerenciando), talvez devêssemos atualizar o role global?
      // O Modal atual mostra Dropdown de papéis mistos (Globais e de Empresa).
      // Se o admin selecionou "God", ele quer transformar o cara em God.
      // Se selecionou "Visualizador", quer dar acesso 'viewer' na empresa (se tiver empresa).
      // Precisamos distinguir.
      // Os papéis 'god', 'admin', 'user' são globais.
      // 'owner', 'editor', 'viewer' são de empresa.

      const globalRoles = ['god', 'sys_admin', 'user'];
      const isGlobalRole = globalRoles.includes(role);

      if (!activeCompany && isGlobalRole && targetUserId) {
        // Estamos no contexto global, atualizando papel global
        await updateUser({
          id: targetUserId,
          data: { ...userData, role: role as any },
        });
      }

      setShowFormModal(false);
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Falha ao salvar usuário', error);
    }
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
              {currentUser?.role === 'god' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteAllDataModal(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Dados
                </Button>
              )}
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
              {/* Grid View - Always visible on mobile, visible on desktop when viewMode === 'grid' */}
              <div className={viewMode === 'grid' ? 'block' : 'block md:hidden'}>
                <div className="grid grid-cols-1 gap-6">
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
                      getEmailVerifiedBadgeColor={getEmailVerifiedBadgeColor}
                      getOnboardingCompletedBadgeColor={getOnboardingCompletedBadgeColor}
                    />
                  ))}
                </div>
              </div>

              {/* List View - Only visible on desktop when viewMode === 'list' */}
              <div className={viewMode === 'list' ? 'hidden md:block' : 'hidden'}>
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
                            Plano
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Status
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Email Verificado
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Onboarding
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
                            getEmailVerifiedBadgeColor={getEmailVerifiedBadgeColor}
                            getOnboardingCompletedBadgeColor={getOnboardingCompletedBadgeColor}
                            activeCompanyId={activeCompany?.id}
                            onAssignRole={handleAssignRole}
                            onViewPermissions={handleViewPermissions}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
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
