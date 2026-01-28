import { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  EyeOff,
  Check,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CreditCard as CreditCardType } from '@/services/creditCardService';

interface CreditCardBillHeaderProps {
  readonly creditCard: CreditCardType | null;
  readonly creditCards: ReadonlyArray<CreditCardType>;
  readonly onCardSelect: (cardId: string) => void;
  readonly onMenuClick?: () => void;
  readonly month?: string;
  readonly onPreviousMonth?: () => void;
  readonly onNextMonth?: () => void;
  readonly canGoPrevious?: boolean;
  readonly canGoNext?: boolean;
  readonly billTotal?: number;
  readonly billStatus?: 'OPEN' | 'CLOSED' | 'PAID';
  readonly dueDate?: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'Aberta';
    case 'CLOSED':
      return 'Fechada';
    case 'PAID':
      return 'Paga';
    default:
      return 'Aberta';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'bg-orange-500/20 text-orange-300';
    case 'CLOSED':
      return 'bg-green-500/20 text-green-300';
    case 'PAID':
      return 'bg-blue-500/20 text-blue-300';
    default:
      return 'bg-orange-500/20 text-orange-300';
  }
};

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
  billTotal = 0,
  billStatus = 'OPEN',
  dueDate,
}: Readonly<CreditCardBillHeaderProps>) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isValueHidden, setIsValueHidden] = useState(false);

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

  const formatDueDate = (dateStr: string) => {
    const [year, monthNum, day] = dateStr.split('-').map(Number);
    const date = new Date(year, monthNum - 1, day);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div
      className="sticky top-0 z-10 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      <div className="relative">
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
                <button className="flex-1 flex items-center justify-center gap-2 min-w-0 px-3 hover:opacity-90 transition-opacity backdrop-blur-sm bg-white/10 rounded-lg py-1.5 max-w-[calc(100%-8rem)]">
                  <CreditCard className="h-4 w-4 text-white shrink-0" />
                  <h1 className="text-sm font-bold text-white uppercase truncate text-center">
                    {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
                  </h1>
                  <ChevronDown className="h-3.5 w-3.5 text-white shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="center">
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {creditCards.map((card) => {
                    const isSelected = card.id === creditCard?.id;
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
            <div className="flex-1 flex items-center justify-center gap-2 min-w-0 px-3 max-w-[calc(100%-8rem)]">
              <CreditCard className="h-4 w-4 text-white shrink-0" />
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

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wide">
                    Valor da Fatura
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${getStatusBgColor(billStatus)}`}
                  >
                    {getStatusText(billStatus)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {isValueHidden ? 'R$ ••••••' : formatCurrency(billTotal)}
                </p>
                {dueDate && (
                  <p className="text-xs text-white/70 mt-1">Vence em {formatDueDate(dueDate)}</p>
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
          </div>
        )}
      </div>
    </div>
  );
}
