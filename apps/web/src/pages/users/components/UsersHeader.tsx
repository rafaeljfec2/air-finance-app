import { Button } from '@/components/ui/button';
import { Plus, Trash2, Users as UsersIcon } from 'lucide-react';

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
    <div className="mb-4">
      {/* Título com ícone */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-primary-500/20">
          <UsersIcon className="h-6 w-6 text-primary-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text dark:text-text-dark">Usuários</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gerencie usuários do sistema
          </p>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onCreateClick}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 h-11 rounded-xl font-medium"
        >
          <Plus className="h-5 w-5" />
          Novo Usuário
        </Button>
        {canDeleteAllData && (
          <Button
            variant="destructive"
            onClick={onDeleteAllDataClick}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl font-medium text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Deletar Todos os Dados
          </Button>
        )}
      </div>
    </div>
  );
}
