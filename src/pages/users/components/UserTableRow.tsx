import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/ComboBox';
import { cn } from '@/lib/utils';
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
  activeCompanyId?: string | null;
  onAssignRole?: (userId: string, role: string) => void;
  onViewPermissions: (user: User) => void;
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
  activeCompanyId,
  onAssignRole,
  onViewPermissions,
}: Readonly<UserTableRowProps>) {
  const currentRole = activeCompanyId ? (user.companyRoles?.[activeCompanyId] ?? 'viewer') : user.role;

  return (
    <>
      <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
        <td className="p-4">
          <div className="font-medium text-text dark:text-text-dark">{user.name}</div>
        </td>
        <td className="p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            {activeCompanyId ? (
              <ComboBox
                options={[
                  { value: 'owner', label: 'Dono' },
                  { value: 'admin', label: 'Administrador' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Visualizador' },
                ]}
                value={currentRole}
                onValueChange={(val: string | null) => {
                  if (val && onAssignRole) onAssignRole(user.id, val);
                }}
                disabled={!onAssignRole || user.role === 'god'}
                className="h-7 w-[140px] text-xs bg-transparent border-gray-200 dark:border-gray-700"
                searchable={false}
              />
            ) : (
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
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
            )}
            
            <button
              onClick={() => onViewPermissions(user)}
              className="text-gray-400 hover:text-primary-500 transition-colors p-1"
              title="Visualizar Permissões"
            >
              <Shield className="h-4 w-4" />
            </button>
          </div>
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
    </>
  );
}
