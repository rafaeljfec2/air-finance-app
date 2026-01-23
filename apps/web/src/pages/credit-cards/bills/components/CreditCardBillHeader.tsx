import { useState } from 'react';
import { ArrowLeft, MoreVertical, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { CreditCard } from '@/services/creditCardService';

interface CreditCardBillHeaderProps {
  creditCard: CreditCard | null;
  creditCards: CreditCard[];
  onCardSelect: (cardId: string) => void;
  onMenuClick?: () => void;
}

export function CreditCardBillHeader({
  creditCard,
  creditCards,
  onCardSelect,
  onMenuClick,
}: Readonly<CreditCardBillHeaderProps>) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardSelect = (cardId: string) => {
    onCardSelect(cardId);
    setIsOpen(false);
  };

  const hasMultipleCards = creditCards.length > 1;

  return (
    <div className="sticky top-0 z-10 bg-card dark:bg-card-dark border-b border-border dark:border-border-dark">
      <div className="flex items-center justify-between px-4 py-3.5 min-h-[56px]">
        <button
          onClick={() => navigate('/home')}
          className="text-text dark:text-text-dark hover:opacity-80 p-2 -ml-2 transition-opacity"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {hasMultipleCards ? (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 flex items-center justify-center gap-1.5 min-w-0 px-2 hover:opacity-80 transition-opacity">
                <h1 className="text-sm font-bold text-text dark:text-text-dark uppercase truncate text-center">
                  {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
                </h1>
                <ChevronDown className="h-4 w-4 text-text dark:text-text-dark shrink-0" />
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
          <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0 px-2">
            <h1 className="text-sm font-bold text-text dark:text-text-dark uppercase truncate text-center">
              {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
            </h1>
          </div>
        )}

        <button
          onClick={onMenuClick}
          className="text-text dark:text-text-dark hover:opacity-80 p-2 -mr-2 transition-opacity"
          aria-label="Menu"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
