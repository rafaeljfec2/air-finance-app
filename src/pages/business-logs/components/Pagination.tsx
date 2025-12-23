import { Button } from '@/components/ui/button';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly filteredItems: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  filteredItems,
  onPrevious,
  onNext,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
        Mostrando {filteredItems} de {totalItems} registros
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage === 1}>
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Ant</span>
        </Button>
        <span className="flex items-center px-2 sm:px-4 text-xs sm:text-sm text-text dark:text-text-dark">
          Página {currentPage} de {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={onNext} disabled={currentPage === totalPages}>
          <span className="hidden sm:inline">Próxima</span>
          <span className="sm:hidden">Próx</span>
        </Button>
      </div>
    </div>
  );
}
