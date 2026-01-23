import { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CreditCard } from '@/services/creditCardService';

interface CreditCardBillHeaderProps {
  creditCard: CreditCard | null;
  creditCards: CreditCard[];
  onCardSelect: (cardId: string) => void;
  onMenuClick?: () => void;
  month?: string;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export function CreditCardBillHeader({
  creditCard,
  creditCards,
  onCardSelect,
  onMenuClick,
  month,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious = true,
  canGoNext = true,
}: Readonly<CreditCardBillHeaderProps>) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardSelect = (cardId: string) => {
    onCardSelect(cardId);
    setIsOpen(false);
  };

  const hasMultipleCards = creditCards.length > 1;
  const cardColor = creditCard?.color ?? '#8A05BE';

  const formatMonth = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-').map(Number);
    const date = new Date(year, monthNum - 1, 1);
    return format(date, 'MMMM/yyyy', { locale: ptBR });
  };

  return (
    <div
      className="sticky top-0 z-10 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
      }}
    >
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      <div className="relative">
        {/* Top bar com navegação do cartão */}
        <div className="flex items-center justify-between px-4 pt-safe pb-3 min-h-[56px] gap-2">
          <button
            onClick={() => navigate('/home')}
            className="text-white hover:opacity-80 p-2 transition-opacity backdrop-blur-sm bg-white/10 rounded-full shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {hasMultipleCards ? (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center justify-center gap-1.5 min-w-0 px-3 hover:opacity-90 transition-opacity backdrop-blur-sm bg-white/10 rounded-lg py-1.5 max-w-[calc(100%-8rem)]">
                  <h1 className="text-sm font-bold text-white uppercase truncate text-center">
                    {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
                  </h1>
                  <ChevronDown className="h-3.5 w-3.5 text-white shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="center">
                <div className="max-h-[300px] overflow-y-auto">
                  {creditCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardSelect(card.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors ${
                        card.id === creditCard?.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark'
                      }`}
                    >
                      {card.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0 px-3 max-w-[calc(100%-8rem)]">
              <h1 className="text-sm font-bold text-white uppercase truncate text-center">
                {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
              </h1>
            </div>
          )}

          <button
            onClick={onMenuClick}
            className="text-white hover:opacity-80 p-2 transition-opacity backdrop-blur-sm bg-white/10 rounded-full shrink-0"
            aria-label="Menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Navegação de mês - integrada no mesmo container */}
        {month && onPreviousMonth && onNextMonth && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onPreviousMonth}
                disabled={!canGoPrevious}
                className="text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all backdrop-blur-sm bg-white/15 hover:bg-white/25 active:scale-95 disabled:active:scale-100"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex-1 flex items-center justify-center gap-2 px-4">
                <Calendar className="h-4 w-4 text-white/90 shrink-0" />
                <h2 className="text-base font-bold text-white text-center capitalize tracking-wide">
                  {formatMonth(month)}
                </h2>
              </div>

              <button
                onClick={onNextMonth}
                disabled={!canGoNext}
                className="text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all backdrop-blur-sm bg-white/15 hover:bg-white/25 active:scale-95 disabled:active:scale-100"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
