import { cn } from '@/lib/utils';
import { User, UserRole, UserStatus } from '@/services/userService';
import { CheckCircle2, Mail, XCircle, User as UserIcon, MoreVertical, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    <div className="w-full rounded-lg transition-all text-left bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Ícone do Usuário */}
          <div className="p-2 rounded-lg shrink-0 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            <UserIcon className="h-4 w-4" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Nome */}
            <h3 className="font-bold text-sm text-text dark:text-text-dark mb-0.5 line-clamp-1">
              {user.name}
            </h3>

            {/* E-mail */}
            <div className="flex items-center gap-1.5 mb-2">
              <Mail className="h-3 w-3 text-gray-400 shrink-0" />
              <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>

            {/* Badges em Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Role */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border w-fit',
                  getRoleBadgeColor(user.role),
                )}
              >
                <Shield className="h-3 w-3" />
                {(() => {
                  if (user.role === 'god') return 'God';
                  if (user.role === 'sys_admin') return 'Admin';
                  if (user.role === 'admin') return 'Admin';
                  if (user.role === 'owner') return 'Dono';
                  if (user.role === 'editor') return 'Editor';
                  if (user.role === 'operator') return 'Operador';
                  if (user.role === 'viewer') return 'Viewer';
                  return 'Usuário';
                })()}
              </span>

              {/* Status */}
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border w-fit',
                  getStatusBadgeColor(user.status),
                )}
              >
                {user.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>

              {/* E-mail Verificado */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border w-fit',
                  getEmailVerifiedBadgeColor(user.emailVerified),
                )}
              >
                {user.emailVerified === true ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Verificado
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Pendente
                  </>
                )}
              </span>

              {/* OpenAI Model */}
              {user.integrations?.openaiModel && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 w-fit">
                  🤖 {user.integrations.openaiModel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Vertical */}
        {canDelete && (
          <div className="shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-7 w-7 p-0 data-[state=open]:bg-muted"
                  disabled={isUpdating || isDeleting}
                >
                  <span className="sr-only">Abrir menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1" align="end">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
                    disabled={isUpdating || isDeleting}
                  >
                    <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
                    disabled={isUpdating || isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}
