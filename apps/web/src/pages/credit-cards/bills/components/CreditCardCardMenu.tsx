import { Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CreditCard } from '@/services/creditCardService';

interface CreditCardCardMenuProps {
  readonly card: CreditCard;
  readonly onEdit: (card: CreditCard) => void;
  readonly onDelete: (card: CreditCard) => void;
  readonly linkedAccountId?: string;
}

export function CreditCardCardMenu({
  card,
  onEdit,
  onDelete,
  linkedAccountId,
}: Readonly<CreditCardCardMenuProps>) {
  const navigate = useNavigate();

  const handleEdit = () => {
    onEdit(card);
  };

  const handleDelete = () => {
    onDelete(card);
  };

  const handleConfigureSync = () => {
    if (linkedAccountId) {
      navigate(`/accounts/${linkedAccountId}/statement-schedule`);
    }
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
          aria-label="Menu do cartão"
        >
          <MoreVertical className="h-4 w-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        {linkedAccountId && (
          <>
            <DropdownMenuItem onSelect={handleConfigureSync}>
              <Clock className="h-4 w-4" />
              <span>Sincronização Automática</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onSelect={handleEdit}>
          <Pencil className="h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
          <Trash2 className="h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
