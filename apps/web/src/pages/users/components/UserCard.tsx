import { RecordCard } from '@/components/ui/RecordCard';
import { cn } from '@/lib/utils';
import { User, UserRole, UserStatus } from '@/services/userService';
import { CheckCircle2, Mail, XCircle } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  getRoleBadgeColor: (role: UserRole) => string;
  getStatusBadgeColor: (status: UserStatus) => string;
  getEmailVerifiedBadgeColor: (emailVerified: boolean | undefined) => string;
  canDelete?: boolean;
}

export function UserCard({
  user,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  getRoleBadgeColor,
  getStatusBadgeColor,
  getEmailVerifiedBadgeColor,
  canDelete = true,
}: Readonly<UserCardProps>) {
  return (
    <RecordCard
      onEdit={() => onEdit(user)}
      onDelete={canDelete ? () => onDelete(user.id) : undefined}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      showActions={canDelete}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-1 truncate leading-tight">
            {user.name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate leading-tight">
            {user.email}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border leading-tight',
            getRoleBadgeColor(user.role),
          )}
        >
          {(() => {
            if (user.role === 'god') return 'God';
            if (user.role === 'sys_admin') return 'Admin Sistema';
            if (user.role === 'admin') return 'Admin Empresa';
            if (user.role === 'owner') return 'Dono';
            if (user.role === 'editor') return 'Editor';
            if (user.role === 'operator') return 'Operador';
            if (user.role === 'viewer') return 'Visualizador';
            return 'Usuário';
          })()}
        </span>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border leading-tight',
            getStatusBadgeColor(user.status),
          )}
        >
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border leading-tight',
            getEmailVerifiedBadgeColor(user.emailVerified),
          )}
        >
          {user.emailVerified === true ? (
            <CheckCircle2 className="h-2.5 w-2.5" />
          ) : (
            <XCircle className="h-2.5 w-2.5" />
          )}
          <Mail className="h-2.5 w-2.5" />
        </span>
        {user.integrations?.openaiModel && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30 leading-tight">
            🤖 {user.integrations.openaiModel}
          </span>
        )}
      </div>
    </RecordCard>
  );
}
