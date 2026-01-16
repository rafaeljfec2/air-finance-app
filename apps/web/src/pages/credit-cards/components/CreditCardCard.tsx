import { RecordCard } from '@/components/ui/RecordCard';
import { CreditCard } from '@/services/creditCardService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, CreditCard as CreditCardIcon, Landmark } from 'lucide-react';

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
    <RecordCard
      onEdit={() => onEdit(creditCard)}
      onDelete={() => onDelete(creditCard.id)}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: creditCard.color }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-1 truncate leading-tight">
              {creditCard.name}
            </h3>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">{getBankLabel(creditCard.icon)}</span>
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-1">
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Limite: </span>
          <span className="text-text dark:text-text-dark font-semibold">
            {formatCurrency(creditCard.limit)}
          </span>
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Fechamento: </span>
          <span className="text-text dark:text-text-dark">{creditCard.closingDay}º dia</span>
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Vencimento: </span>
          <span className="text-text dark:text-text-dark">{creditCard.dueDay}º dia</span>
        </div>
      </div>
    </RecordCard>
  );
}
