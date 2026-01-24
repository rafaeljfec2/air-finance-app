import { User } from '@/services/userService';
import { UserRole, UserStatus } from '@/types/user';
import { MoreVertical, Edit, Trash2, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onViewPermissions?: (user: User) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  getRoleBadgeColor: (role: UserRole | string) => string;
  getStatusBadgeColor: (status: UserStatus | string) => string;
  canDelete?: boolean;
}

export function UserListItem({
  user,
  onEdit,
  onDelete,
  onViewPermissions,
  isUpdating = false,
  isDeleting = false,
  getRoleBadgeColor,
  canDelete = true,
}: Readonly<UserListItemProps>) {
  // Pegar iniciais do nome
  const initials = user.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getRoleLabel = (role: UserRole | string) => {
    const roleValue = typeof role === 'string' ? role : role;
    if (roleValue === UserRole.GOD || roleValue === 'god') return 'God';
    if (roleValue === UserRole.SYS_ADMIN || roleValue === 'sys_admin') return 'Admin';
    if (roleValue === UserRole.ADMIN || roleValue === 'admin') return 'Admin';
    if (roleValue === UserRole.OWNER || roleValue === 'owner') return 'Dono';
    if (roleValue === UserRole.EDITOR || roleValue === 'editor') return 'Editor';
    if (roleValue === UserRole.OPERATOR || roleValue === 'operator') return 'Operador';
    if (roleValue === UserRole.VIEWER || roleValue === 'viewer') return 'Viewer';
    return 'Usuário';
  };

  return (
    <div className="flex items-center gap-2.5 p-2 bg-card dark:bg-card-dark hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors rounded-lg border border-border/50 dark:border-border-dark/50">
      {/* Avatar com iniciais */}
      <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-primary-700 dark:text-primary-300">{initials}</span>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[13px] text-text dark:text-text-dark truncate leading-tight">
          {user.name}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium',
              getRoleBadgeColor(user.role),
            )}
          >
            {getRoleLabel(user.role)}
          </span>
          {user.emailVerified ? (
            <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="h-3 w-3 text-gray-400" />
          )}
        </div>
      </div>

      {/* Menu de contexto - sempre visível */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            disabled={isUpdating || isDeleting}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="end">
          <div className="flex flex-col gap-1">
            {onViewPermissions && (
              <button
                onClick={() => onViewPermissions(user)}
                className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-primary-50 dark:hover:bg-primary-900/10 text-primary-600 dark:text-primary-400 transition-colors text-left gap-2"
                disabled={isUpdating || isDeleting}
              >
                <Shield className="h-4 w-4" />
                Visualizar Permissões
              </button>
            )}
            <button
              onClick={() => onEdit(user)}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Editar
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(user.id)}
                className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
                disabled={isUpdating || isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
