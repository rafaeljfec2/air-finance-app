import { Card } from '@/components/ui/card';
import { User } from '@/services/userService';
import { UserCard } from './UserCard';
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
  activeCompanyId?: string | null;
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onAssignRole: (userId: string, role: string) => void;
  onViewPermissions: (user: User) => void;
  canDeleteUser: (user: User) => boolean;
}

export function UsersList({
  users,
  viewMode,
  activeCompanyId,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
  onAssignRole,
  onViewPermissions,
  canDeleteUser,
}: Readonly<UsersListProps>) {
  return (
    <>
      {/* Grid View - Always visible on mobile, visible on desktop when viewMode === 'grid' */}
      <div className={viewMode === 'grid' ? 'block' : 'block md:hidden'}>
        <div className="grid grid-cols-1 gap-6">
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
              getOnboardingCompletedBadgeColor={getOnboardingCompletedBadgeColor}
              canDelete={canDeleteUser(user)}
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
                {users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    getRoleBadgeColor={getRoleBadgeColor}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getEmailVerifiedBadgeColor={getEmailVerifiedBadgeColor}
                    getOnboardingCompletedBadgeColor={getOnboardingCompletedBadgeColor}
                    activeCompanyId={activeCompanyId}
                    onAssignRole={onAssignRole}
                    onViewPermissions={onViewPermissions}
                    canDelete={canDeleteUser(user)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
