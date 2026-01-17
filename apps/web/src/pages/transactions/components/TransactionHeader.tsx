import { Button } from '@/components/ui/button';
import { Filter, Receipt } from 'lucide-react';

interface TransactionHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onNavigateToHistory: () => void;
  onNavigateToNew: () => void;
}

export function TransactionHeader({
  showFilters,
  setShowFilters,
}: TransactionHeaderProps) {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-8 w-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-text dark:text-text-dark">Fluxo de Caixa</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie seu fluxo de caixa</p>
        </div>
      </div>

      {/* Mobile Header - Compacto */}
      <div className="md:hidden flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary-500" />
          <h1 className="text-lg font-bold text-text dark:text-text-dark">Transações</h1>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-text dark:text-text-dark"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>
    </>
  );
}
