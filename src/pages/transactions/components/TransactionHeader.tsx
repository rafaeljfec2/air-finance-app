import { Button } from '@/components/ui/button';
import { Filter, History, Plus, Receipt } from 'lucide-react';

interface TransactionHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onNavigateToHistory: () => void;
  onNavigateToNew: () => void;
}

export function TransactionHeader({
  showFilters,
  setShowFilters,
  onNavigateToHistory,
  onNavigateToNew,
}: TransactionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Receipt className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Fluxo de Caixa</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie seu fluxo de caixa</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full sm:w-auto lg:hidden flex items-center justify-center gap-2 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
        <Button
          onClick={onNavigateToHistory}
          variant="outline"
          className="w-full sm:w-auto bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
        >
          <History className="h-5 w-5" />
          Histórico
        </Button>
        <Button
          onClick={onNavigateToNew}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo lançamento
        </Button>
      </div>
    </div>
  );
}
