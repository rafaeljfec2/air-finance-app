import { CreditCard } from '@/services/creditCardService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, CreditCard as CreditCardIcon, Landmark, Wallet, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const bankTypes = [
  { value: 'nubank', label: 'Nubank', icon: CreditCardIcon },
  { value: 'itau', label: 'Itaú', icon: Banknote },
  { value: 'bradesco', label: 'Bradesco', icon: Banknote },
  { value: 'santander', label: 'Santander', icon: Banknote },
  { value: 'bb', label: 'Banco do Brasil', icon: Banknote },
  { value: 'caixa', label: 'Caixa Econômica', icon: Banknote },
  { value: 'outro', label: 'Outro', icon: Landmark },
] as const;

function getBankLabel(icon: string): string {
  return bankTypes.find((t) => t.value === icon)?.label || 'Cartão';
}

function getBankIcon(icon: string) {
  return bankTypes.find((t) => t.value === icon)?.icon || CreditCardIcon;
}

interface CreditCardCardProps {
  creditCard: CreditCard;
  onEdit: (creditCard: CreditCard) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function CreditCardCard({
  creditCard,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<CreditCardCardProps>) {
  const Icon = getBankIcon(creditCard.icon);

  return (
    <div className="w-full rounded-lg transition-all text-left bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Ícone com cor personalizada */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: creditCard.color }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Nome */}
            <h3 className="font-bold text-sm text-text dark:text-text-dark mb-0.5 line-clamp-1">
              {creditCard.name}
            </h3>

            {/* Banco */}
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
              {getBankLabel(creditCard.icon)}
            </p>

            {/* Informações em Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {/* Limite */}
              <div className="flex items-center gap-1.5 min-w-0 col-span-2">
                <Wallet className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 text-[10px]">Limite:</span>
                <span className="text-text dark:text-text-dark font-bold">
                  {formatCurrency(creditCard.limit)}
                </span>
              </div>

              {/* Fechamento */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 text-[11px]">
                  Fech: Dia {creditCard.closingDay}
                </span>
              </div>

              {/* Vencimento */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 text-[11px]">
                  Venc: Dia {creditCard.dueDay}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Vertical */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 data-[state=open]:bg-muted"
                disabled={isUpdating || isDeleting}
              >
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onEdit(creditCard)}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
                  disabled={isUpdating || isDeleting}
                >
                  <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(creditCard.id)}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
