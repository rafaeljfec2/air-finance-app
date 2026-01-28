import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ChevronDown, CreditCard, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { CreditCard as CreditCardType } from '@/services/creditCardService';
import { formatCurrency, calculateUsagePercentage } from '../utils';

interface CreditCardHeaderProps {
  readonly creditCard: CreditCardType | null;
  readonly creditCards: ReadonlyArray<CreditCardType>;
  readonly onBack: () => void;
  readonly onCardSelect: (cardId: string) => void;
  readonly selectedCardId: string;
  readonly limitUsed: number;
  readonly limitTotal: number;
}

const getUsageColorClass = (percentage: number): string => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 50) return 'bg-amber-500';
  return 'bg-green-500';
};

export function CreditCardHeader({
  creditCard,
  creditCards,
  onBack,
  onCardSelect,
  selectedCardId,
  limitUsed,
  limitTotal,
}: CreditCardHeaderProps) {
  const [isValueHidden, setIsValueHidden] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hasMultipleCards = creditCards.length > 1;
  const cardColor = creditCard?.color ?? '#8A05BE';
  const usagePercentage = calculateUsagePercentage(limitUsed, limitTotal);
  const usageColorClass = getUsageColorClass(usagePercentage);
  const progressWidth = Math.min(usagePercentage, 100);

  const handleCardSelect = (cardId: string) => {
    onCardSelect(cardId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="sticky top-0 z-20 bg-background dark:bg-background-dark pt-4 pb-2 lg:pt-6">
      <div
        className="relative overflow-hidden mx-4 lg:mx-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 rounded-2xl" />

        <div className="relative px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>

              {hasMultipleCards ? (
                <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors">
                      <CreditCard className="h-4 w-4 text-white shrink-0" />
                      <span className="text-sm font-bold text-white uppercase">
                        {creditCard?.name ?? 'Cartão de Crédito'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-white/80" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-2" align="start" sideOffset={8}>
                    <div className="space-y-1">
                      {creditCards.map((card) => {
                        const isSelected = card.id === selectedCardId;
                        return (
                          <button
                            key={card.id}
                            onClick={() => handleCardSelect(card.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-primary-500/10 dark:bg-primary-500/20'
                                : 'hover:bg-background dark:hover:bg-background-dark'
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                              style={{ backgroundColor: card.color ?? '#8A05BE' }}
                            >
                              <CreditCard className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p
                                className={`text-sm truncate ${
                                  isSelected
                                    ? 'font-semibold text-primary-600 dark:text-primary-400'
                                    : 'font-medium text-text dark:text-text-dark'
                                }`}
                              >
                                {card.name}
                              </p>
                              <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">
                                Cartão de Crédito
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/10">
                  <CreditCard className="h-4 w-4 text-white shrink-0" />
                  <h1 className="text-sm font-bold text-white uppercase">
                    {creditCard?.name ?? 'Cartão de Crédito'}
                  </h1>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsValueHidden(!isValueHidden)}
              className="p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isValueHidden ? 'Mostrar valor' : 'Ocultar valor'}
            >
              {isValueHidden ? (
                <EyeOff className="h-5 w-5 text-white" />
              ) : (
                <Eye className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          <div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">
              Limite Utilizado
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white tracking-tight">
                {isValueHidden ? 'R$ ••••••' : formatCurrency(limitUsed)}
              </p>
              <span className="text-sm text-white/60">
                de {isValueHidden ? 'R$ ••••••' : formatCurrency(limitTotal)}
              </span>
            </div>

            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${usageColorClass}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1.5">{usagePercentage.toFixed(1)}% utilizado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
