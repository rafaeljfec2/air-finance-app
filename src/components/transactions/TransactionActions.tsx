import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import type { TransactionActionsProps } from './TransactionGrid.types';

interface TransactionActionsPropsReadonly extends Readonly<TransactionActionsProps> {}

export function TransactionActions({
  transaction,
  onEdit,
  onDelete,
  onActionClick,
  variant = 'table',
}: TransactionActionsPropsReadonly) {
  const buttonClassName =
    variant === 'table'
      ? 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'
      : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 -m-2';

  const deleteButtonClassName =
    variant === 'table'
      ? 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
      : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 -m-2';

  const renderEditButton = () => {
    if (!onEdit) return null;
    return (
      <Tooltip content="Editar transação">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(transaction);
          }}
          className={buttonClassName}
          aria-label="Editar transação"
        >
          <Edit className="h-4 w-4" />
        </button>
      </Tooltip>
    );
  };

  const renderActionButton = () => {
    if (!onActionClick) return null;
    return (
      <Tooltip content="Mais ações">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActionClick(transaction);
          }}
          className="text-gray-500 dark:text-gray-400 hover:text-text dark:hover:text-text-dark transition-colors"
          aria-label="Mais ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </Tooltip>
    );
  };

  const actionButton = renderEditButton() || renderActionButton();

  return (
    <div
      className={
        variant === 'table' ? 'flex items-center gap-2' : 'flex items-center justify-end gap-2'
      }
    >
      {actionButton}
      {onDelete && (
        <Tooltip content="Excluir transação">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transaction);
            }}
            className={deleteButtonClassName}
            aria-label="Deletar transação"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
