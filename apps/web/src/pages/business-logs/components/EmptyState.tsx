import { Card } from '@/components/ui/card';
import { History } from 'lucide-react';

export function EmptyState() {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
      <div className="p-12 text-center">
        <History className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          Nenhum log encontrado
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Não há registros para os filtros selecionados
        </p>
      </div>
    </Card>
  );
}

