import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn , SortConfig } from '@/components/ui/SortableColumn';
import { User } from '@/services/userService';
import { UserCard } from './UserCard';
import { UserListItem } from './UserListItem';
import { UserTableRow } from './UserTableRow';
import {
  getEmailVerifiedBadgeColor,
  getOnboardingCompletedBadgeColor,
  getRoleBadgeColor,
  getStatusBadgeColor,
} from '../utils/userHelpers';

interface UsersListProps {
  users: User[];
  viewMode: 'grid' | 'list';
  isUpdating: boolean;
  isDeleting: boolean;
  sortConfig: SortConfig<'name' | 'email' | 'role' | 'status' | 'plan' | 'createdAt'> | null;
  onSort: (field: 'name' | 'email' | 'role' | 'status' | 'plan' | 'createdAt') => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onViewPermissions: (user: User) => void;
  canDeleteUser: (user: User) => boolean;
}

export function UsersList({
  users,
  viewMode,
  isUpdating,
  isDeleting,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onViewPermissions,
  canDeleteUser,
}: Readonly<UsersListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            getRoleBadgeColor={getRoleBadgeColor}
            getStatusBadgeColor={getStatusBadgeColor}
            getEmailVerifiedBadgeColor={getEmailVerifiedBadgeColor}
            canDelete={canDeleteUser(user)}
          />
        ))}
      </RecordsGrid>
    );
  }

  return (
    <>
      {/* Desktop: Table view */}
      <Card className="hidden md:block bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border-dark">
                <SortableColumn field="name" currentSort={sortConfig} onSort={onSort}>
                  Nome
                </SortableColumn>
                <SortableColumn field="email" currentSort={sortConfig} onSort={onSort}>
                  Email
                </SortableColumn>
                <SortableColumn field="role" currentSort={sortConfig} onSort={onSort}>
                  Função
                </SortableColumn>
                <SortableColumn field="plan" currentSort={sortConfig} onSort={onSort}>
                  Plano
                </SortableColumn>
                <SortableColumn field="status" currentSort={sortConfig} onSort={onSort}>
                  Status
                </SortableColumn>
                <th className="text-left p-3 text-sm font-semibold text-text dark:text-text-dark">
                  Email Verificado
                </th>
                <th className="text-left p-3 text-sm font-semibold text-text dark:text-text-dark">
                  Onboarding
                </th>
                <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  onViewPermissions={onViewPermissions}
                  getRoleBadgeColor={getRoleBadgeColor}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getEmailVerifiedBadgeColor={getEmailVerifiedBadgeColor}
                  getOnboardingCompletedBadgeColor={getOnboardingCompletedBadgeColor}
                  canDelete={canDeleteUser(user)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile: List view */}
      <div className="md:hidden space-y-1">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewPermissions={onViewPermissions}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            getRoleBadgeColor={getRoleBadgeColor}
            getStatusBadgeColor={getStatusBadgeColor}
            canDelete={canDeleteUser(user)}
          />
        ))}
      </div>
    </>
  );
}
