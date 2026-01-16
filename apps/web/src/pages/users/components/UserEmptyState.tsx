import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, User as UserIcon } from 'lucide-react';

interface UserEmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
}

export function UserEmptyState({ hasFilters, onCreateClick }: Readonly<UserEmptyStateProps>) {
  const emptyTitle = hasFilters ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado';
  const emptyDescription = hasFilters
    ? 'Tente ajustar os filtros de busca'
    : 'Comece criando seu primeiro usuário';

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="p-12 text-center">
        <UserIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">{emptyTitle}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{emptyDescription}</p>
        {!hasFilters && (
          <Button
            onClick={onCreateClick}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Usuário
          </Button>
        )}
      </div>
    </Card>
  );
}

