import { BadgeStatus, CardContainer, CardHeader } from '@/components/budget';
import { CreditCardBrandIcon } from '@/components/budget/CreditCardBrandIcon';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { CreditCardBill, CreditCard as CreditCardType } from '@/types/budget';
import { CreditCard, Maximize2 } from 'lucide-react';

interface CreditCardsCardProps {
  cards: CreditCardType[];
  isLoading: boolean;
  activeCardId: string;
  activeBill: CreditCardBill | undefined;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onChangeActiveCard: (cardId: string) => void;
  onExpand: () => void;
}

export function CreditCardsCard({
  cards,
  isLoading,
  activeCardId,
  activeBill,
  currentPage,
  itemsPerPage,
  onPageChange,
  onChangeActiveCard,
  onExpand,
}: Readonly<CreditCardsCardProps>) {
  const transactions = activeBill?.transactions ?? [];
  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    onPageChange(Math.max(1, safePage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, safePage + 1));
  };

  return (
    <CardContainer color="violet" className="min-h-[420px]">
      <CardHeader icon={<CreditCard size={20} />} title="Cartões de Crédito">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-300"
          onClick={onExpand}
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Expandir
        </Button>
      </CardHeader>
      <div className="mt-3 flex flex-col justify-between min-h-[320px]">
        {isLoading ? (
          <div className="mt-6 flex justify-center">
            <Spinner size="md" className="text-violet-500" />
          </div>
        ) : (
          <>
            <div className="flex gap-1.5 mb-3 mt-3">
              {cards.map((card) => {
                const isActive = activeCardId === card.id;
                let activeClass = '';
                if (isActive) {
                  if (card.brand === 'nubank') {
                    activeClass = 'bg-[#8A05BE] text-white border-[#8A05BE]';
                  } else if (card.brand === 'itau') {
                    activeClass = 'bg-[#FF6900] text-white border-[#FF6900]';
                  } else {
                    activeClass = 'bg-primary-600 text-white dark:bg-primary-500';
                  }
                } else {
                  activeClass =
                    'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-500';
                }
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => onChangeActiveCard(card.id)}
                    className={`px-2 py-1 rounded font-medium border transition-colors text-[11px] ${activeClass}`}
                  >
                    <div className="flex items-center gap-1">
                      <CreditCardBrandIcon brand={card.brand} />
                      {card.name}
                    </div>
                  </button>
                );
              })}
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                  <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                  <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Categoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                {Array.from({ length: itemsPerPage }).map((_, idx) => {
                  const t = paginatedTransactions[idx];
                  const key = t ? t.id : `card-placeholder-${idx}`;
                  return t ? (
                    <tr key={key}>
                      <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                        {t.description}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                        R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <BadgeStatus status={t.category === 'Parcelado' ? 'success' : 'default'}>
                          {t.category}
                        </BadgeStatus>
                      </td>
                    </tr>
                  ) : (
                    <tr key={key}>
                      <td className="px-2 py-1.5" colSpan={3}>
                        &nbsp;
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <button
                  type="button"
                  className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={safePage === 1}
                >
                  Anterior
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Página {safePage} de {totalPages}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                  onClick={handleNext}
                  disabled={safePage === totalPages}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </CardContainer>
  );
}
