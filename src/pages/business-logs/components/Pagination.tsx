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
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Mostrando {filteredItems} de {totalItems} registros
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage === 1}>
          Anterior
        </Button>
        <span className="flex items-center px-4 text-sm text-text dark:text-text-dark">
          Página {currentPage} de {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={onNext} disabled={currentPage === totalPages}>
          Próxima
        </Button>
      </div>
    </div>
  );
}
