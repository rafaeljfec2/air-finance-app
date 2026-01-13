import { Button } from '@/components/ui/button';
import { CreditCard } from '@/services/creditCardService';
import { formatCurrency } from '@/utils/formatters';
import { Edit, Trash2 } from 'lucide-react';

interface CreditCardTableRowProps {
  creditCard: CreditCard;
  onEdit: (creditCard: CreditCard) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const bankTypes = [
  { value: 'nubank', label: 'Nubank' },
  { value: 'itau', label: 'Itaú' },
  { value: 'bradesco', label: 'Bradesco' },
  { value: 'santander', label: 'Santander' },
  { value: 'bb', label: 'Banco do Brasil' },
  { value: 'caixa', label: 'Caixa Econômica' },
  { value: 'outro', label: 'Outro' },
] as const;

export function CreditCardTableRow({
  creditCard,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<CreditCardTableRowProps>) {
  const bankLabel =
    bankTypes.find((t) => t.value === creditCard.icon)?.label || 'Cartão';

  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: creditCard.color }}
          >
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium text-text dark:text-text-dark">{creditCard.name}</div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{bankLabel}</span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-text dark:text-text-dark">
          <span className="text-gray-500 dark:text-gray-400">Limite: </span>
          <span className="text-text dark:text-text-dark font-semibold">
            {formatCurrency(creditCard.limit)}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-text dark:text-text-dark">
          <span className="text-gray-500 dark:text-gray-400">Fechamento: </span>
          <span className="text-text dark:text-text-dark">{creditCard.closingDay}º dia</span>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-text dark:text-text-dark">
          <span className="text-gray-500 dark:text-gray-400">Vencimento: </span>
          <span className="text-text dark:text-text-dark">{creditCard.dueDay}º dia</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(creditCard)}
            disabled={isUpdating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(creditCard.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
