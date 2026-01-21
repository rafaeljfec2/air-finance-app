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
    <div className="mb-2 flex flex-row items-center justify-between gap-1 sm:gap-2 border-b border-border dark:border-border-dark pb-2 overflow-x-auto">
      <div className="flex flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="text-xs bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md py-0.5 px-1.5 sm:px-2 flex-shrink-0"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
          por página
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
          Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems}
        </p>
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
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
        <output className="text-xs font-medium text-text dark:text-text-dark px-1 sm:px-2 whitespace-nowrap">
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
