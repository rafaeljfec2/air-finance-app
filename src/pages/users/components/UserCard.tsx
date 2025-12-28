import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User } from '@/services/userService';
import { Edit, Trash2 } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  getRoleBadgeColor: (role: 'admin' | 'user') => string;
  getStatusBadgeColor: (status: 'active' | 'inactive') => string;
}

export function UserCard({
  user,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
  getRoleBadgeColor,
  getStatusBadgeColor,
}: Readonly<UserCardProps>) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header do Card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2 truncate">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
              getRoleBadgeColor(user.role),
            )}
          >
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </span>
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
              getStatusBadgeColor(user.status),
            )}
          >
            {user.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
          {user.integrations?.openaiModel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
              🤖 {user.integrations.openaiModel}
            </span>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user)}
            disabled={isUpdating}
            className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
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
      </div>
    </Card>
  );
}

