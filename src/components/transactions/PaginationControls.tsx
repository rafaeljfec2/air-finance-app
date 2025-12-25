import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly itemsPerPage: number;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
  readonly onItemsPerPageChange: (value: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) {
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 border-t border-border dark:border-border-dark pt-4">
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-center sm:justify-start text-center sm:text-left">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="text-xs bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md py-1 px-2"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems}
        </p>
      </div>
      <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'p-1 rounded-md',
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
          )}
          aria-label="Primeira página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-1 rounded-md',
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <output className="text-xs font-medium text-text dark:text-text-dark px-2">
          Página {currentPage} de {totalPages}
        </output>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-1 rounded-md',
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
          )}
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-1 rounded-md',
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
          )}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
