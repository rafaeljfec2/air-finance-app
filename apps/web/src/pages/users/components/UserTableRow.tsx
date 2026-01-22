import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/utils/formatters';
import { User, UserRole, UserStatus } from '@/services/userService';
import { CheckCircle2, Edit, Mail, Shield, Trash2, XCircle } from 'lucide-react';

export interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  getRoleBadgeColor: (role: UserRole) => string;
  getStatusBadgeColor: (status: UserStatus) => string;
  getEmailVerifiedBadgeColor: (emailVerified: boolean | undefined) => string;
  getOnboardingCompletedBadgeColor: (onboardingCompleted: boolean | undefined) => string;
  onViewPermissions: (user: User) => void;
  canDelete?: boolean;
}

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  business: 'Business',
  free: 'Gratuito',
};

const PLAN_STYLES: Record<string, string> = {
  pro: 'bg-purple-100/50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  business:
    'bg-amber-100/50 text-amber-700 dark:bg-amber-900/10 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  free: 'bg-green-100/50 text-green-700 dark:bg-green-900/10 dark:text-green-400 border-green-200 dark:border-green-800',
};

export function UserTableRow({
  user,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
  getRoleBadgeColor,
  getStatusBadgeColor,
  getEmailVerifiedBadgeColor,
  getOnboardingCompletedBadgeColor,
  onViewPermissions,
  canDelete = true,
}: Readonly<UserTableRowProps>) {
  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="py-2 px-3">
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {user.createdAt ? formatDateTime(user.createdAt) : '-'}
          </div>
        </div>
      </td>
      <td className="py-2 px-3">
        <div>
          <div className="text-sm font-medium text-text dark:text-text-dark">{user.name}</div>
        </div>
      </td>
      <td className="py-2 px-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
        </div>
      </td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
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

          <button
            onClick={() => onViewPermissions(user)}
            className="text-gray-400 hover:text-primary-500 transition-colors p-0.5"
            title="Visualizar Permissões"
          >
            <Shield className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
      <td className="py-2 px-3">
        <div>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
              PLAN_STYLES[user.plan] || PLAN_STYLES.free,
            )}
          >
            {PLAN_LABELS[user.plan] || 'Gratuito'}
          </span>
        </div>
      </td>
      <td className="py-2 px-3">
        <div>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
              getStatusBadgeColor(user.status),
            )}
          >
            {user.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </td>
      <td className="py-2 px-3">
        <div>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
              getEmailVerifiedBadgeColor(user.emailVerified),
            )}
          >
            {user.emailVerified === true ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            <Mail className="h-3 w-3" />
            {user.emailVerified === true ? 'Verificado' : 'Não Verificado'}
          </span>
        </div>
      </td>
      <td className="py-2 px-3">
        <div>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
              getOnboardingCompletedBadgeColor(user.onboardingCompleted),
            )}
          >
            {user.onboardingCompleted === true ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {user.onboardingCompleted === true ? 'Completo' : 'Pendente'}
          </span>
        </div>
      </td>
      <td className="py-2 px-3">
        <div className="flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user)}
            disabled={isUpdating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark h-7 px-2 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          {canDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(user.id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50 h-7 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
