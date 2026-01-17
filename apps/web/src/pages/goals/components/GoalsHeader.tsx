import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';

interface GoalsHeaderProps {
  onCreate: () => void;
}

export function GoalsHeader({ onCreate }: Readonly<GoalsHeaderProps>) {
  return (
    <div className="mb-4">
      {/* Título com ícone */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-primary-500/20">
          <Target className="h-6 w-6 text-primary-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text dark:text-text-dark">Metas</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gerencie seus objetivos financeiros
          </p>
        </div>
      </div>

      {/* Botão de ação */}
      <Button
        onClick={onCreate}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 h-11 rounded-xl font-medium"
      >
        <Plus className="h-5 w-5" />
        Nova Meta
      </Button>
    </div>
  );
}
