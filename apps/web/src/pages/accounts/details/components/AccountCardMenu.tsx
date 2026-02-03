import type { MouseEvent } from 'react';
import { MoreVertical, Pencil, RefreshCw, RotateCw, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Account } from '@/services/accountService';

interface AccountCardMenuProps {
  readonly account: Account;
  readonly onEdit: (account: Account) => void;
  readonly onToggleAutoSync: (account: Account) => void;
  readonly onResync?: (account: Account) => void;
  readonly onDelete: (account: Account) => void;
}

export function AccountCardMenu({
  account,
  onEdit,
  onToggleAutoSync,
  onResync,
  onDelete,
}: Readonly<AccountCardMenuProps>) {
  const hasIntegration = account.integration?.enabled ?? false;
  const hasOpeniItem = Boolean(account.openiItemId);

  const handleEdit = () => {
    onEdit(account);
  };

  const handleToggleAutoSync = () => {
    onToggleAutoSync(account);
  };

  const handleResync = () => {
    onResync?.(account);
  };

  const handleDelete = () => {
    onDelete(account);
  };

  const handleTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={handleTriggerClick}
          className="p-1.5 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Menu da conta"
        >
          <MoreVertical className="h-4 w-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem onSelect={handleEdit}>
          <Pencil className="h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>

        {hasIntegration && (
          <DropdownMenuItem onSelect={handleToggleAutoSync}>
            <RefreshCw className="h-4 w-4" />
            <span>Editar Sincronização</span>
          </DropdownMenuItem>
        )}

        {hasOpeniItem && onResync && (
          <DropdownMenuItem onSelect={handleResync}>
            <RotateCw className="h-4 w-4" />
            <span>Resincronizar a conta</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
          <Trash2 className="h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
