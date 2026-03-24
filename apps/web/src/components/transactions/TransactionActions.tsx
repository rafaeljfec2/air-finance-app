import { Edit, History, MoreVertical, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import type { TransactionActionsProps } from './TransactionGrid.types';

export function TransactionActions({
  transaction,
  onEdit,
  onDelete,
  onViewHistory,
}: Readonly<TransactionActionsProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 p-0 data-[state=open]:bg-muted"
          onClick={(e) => e.stopPropagation()} // Prevent row click
        >
          <span className="sr-only">Abrir menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="flex flex-col gap-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(transaction);
              }}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
            >
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Editar
            </button>
          )}
          {onViewHistory && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory(transaction);
              }}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
            >
              <History className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Histórico
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(transaction);
              }}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
