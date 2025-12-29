import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User } from '@/services/userService';
import { CheckCircle2, Edit, Mail, Trash2, XCircle } from 'lucide-react';

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  getRoleBadgeColor: (role: 'god' | 'admin' | 'user') => string;
  getStatusBadgeColor: (status: 'active' | 'inactive') => string;
  getEmailVerifiedBadgeColor: (emailVerified: boolean | undefined) => string;
  getOnboardingCompletedBadgeColor: (onboardingCompleted: boolean | undefined) => string;
}

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
}: Readonly<UserTableRowProps>) {
  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="font-medium text-text dark:text-text-dark">{user.name}</div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
      </td>
      <td className="p-4">
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            getRoleBadgeColor(user.role),
          )}
        >
          {(() => {
            if (user.role === 'god') return 'God';
            if (user.role === 'admin') return 'Administrador';
            return 'Usuário';
          })()}
        </span>
      </td>
      <td className="p-4">
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            getStatusBadgeColor(user.status),
          )}
        >
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="p-4">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
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
      </td>
      <td className="p-4">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
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
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user)}
            disabled={isUpdating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
