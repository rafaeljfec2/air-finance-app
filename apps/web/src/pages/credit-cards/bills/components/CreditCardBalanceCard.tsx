import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Eye, EyeOff, CreditCard } from 'lucide-react';
import type { CreditCard as CreditCardType } from '@/services/creditCardService';
import { CreditCardCardMenu } from './CreditCardCardMenu';

interface CreditCardBalanceCardProps {
  readonly card: CreditCardType;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly limitUsed?: number;
  readonly onEdit?: (card: CreditCardType) => void;
  readonly onDelete?: (card: CreditCardType) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatHiddenCurrency = (): string => 'R$ ••••••';

const getCardGradient = (card: CreditCardType): string => {
  const baseColor = card.color ?? '#8A05BE';
  return `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}dd 100%)`;
};

const calculateUsagePercentage = (used: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min((used / total) * 100, 100);
};

const getUsageColorClass = (percentage: number): string => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 50) return 'bg-amber-500';
  return 'bg-green-500';
};

export function CreditCardBalanceCard({
  card,
  isSelected,
  onClick,
  limitUsed = 0,
  onEdit,
  onDelete,
}: Readonly<CreditCardBalanceCardProps>) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const gradient = getCardGradient(card);
  const hasMenuActions = onEdit && onDelete;
  const usagePercentage = calculateUsagePercentage(limitUsed, card.limit);
  const usageColorClass = getUsageColorClass(usagePercentage);
  const progressWidth = Math.min(usagePercentage, 100);

  const handleToggleBalance = (e: MouseEvent) => {
    e.stopPropagation();
    setIsBalanceHidden((prev) => !prev);
  };

  const cardClassName = `
    relative flex-shrink-0 w-[280px] min-w-[280px] rounded-xl overflow-hidden
    transition-all duration-200 text-left
    ${isSelected ? 'scale-[1.02] shadow-lg' : 'opacity-80 hover:opacity-100'}
  `;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className={cardClassName}
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden">
              <CreditCard className="h-6 w-6" style={{ color: card.color ?? '#8A05BE' }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate max-w-[130px]">{card.name}</h3>
              <p className="text-[10px] text-white/70 font-medium">Cartão de Crédito</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleBalance}
              className="p-1.5 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isBalanceHidden ? 'Mostrar valor' : 'Ocultar valor'}
            >
              {isBalanceHidden ? (
                <EyeOff className="h-4 w-4 text-white" />
              ) : (
                <Eye className="h-4 w-4 text-white" />
              )}
            </button>

            {hasMenuActions && (
              <CreditCardCardMenu card={card} onEdit={onEdit} onDelete={onDelete} />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-medium text-white/70 uppercase tracking-wide">
            Limite Utilizado
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-white tracking-tight">
              {isBalanceHidden ? formatHiddenCurrency() : formatCurrency(limitUsed)}
            </p>
            <span className="text-xs text-white/60">
              de {isBalanceHidden ? formatHiddenCurrency() : formatCurrency(card.limit)}
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${usageColorClass}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        <p className="text-[10px] text-white/60 mt-1">{usagePercentage.toFixed(1)}% utilizado</p>
      </div>
    </div>
  );
}
