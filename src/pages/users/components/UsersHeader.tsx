import { Button } from '@/components/ui/button';
import { Plus, Trash2, User as UserIcon } from 'lucide-react';

interface UsersHeaderProps {
  onCreateClick: () => void;
  onDeleteAllDataClick: () => void;
  canDeleteAllData: boolean;
}

export function UsersHeader({
  onCreateClick,
  onDeleteAllDataClick,
  canDeleteAllData,
}: Readonly<UsersHeaderProps>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <UserIcon className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Usuários</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie usuários do sistema</p>
      </div>
      <div className="flex gap-2">
        {canDeleteAllData && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteAllDataClick}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Deletar Dados
          </Button>
        )}
        <Button
          onClick={onCreateClick}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Usuário
        </Button>
      </div>
    </div>
  );
}
