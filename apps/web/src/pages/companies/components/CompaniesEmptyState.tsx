import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, Plus } from 'lucide-react';

interface CompaniesEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
}

export function CompaniesEmptyState({ hasFilters, onCreate }: Readonly<CompaniesEmptyStateProps>) {
  const emptyTitle = hasFilters ? 'Nenhum perfil encontrado' : 'Nenhum perfil cadastrado';
  const emptyDescription = hasFilters
    ? 'Tente ajustar os filtros de busca'
    : 'Comece criando seu primeiro perfil';

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="p-12 text-center">
        <Building2 className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">{emptyTitle}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{emptyDescription}</p>
        {!hasFilters && (
          <Button onClick={onCreate} className="bg-primary-500 hover:bg-primary-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Perfil
          </Button>
        )}
      </div>
    </Card>
  );
}
