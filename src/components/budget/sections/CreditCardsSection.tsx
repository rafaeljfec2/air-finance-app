import { BadgeStatus, CardStat } from '@/components/budget';
import { CreditCardBrandIcon } from '@/components/budget/CreditCardBrandIcon';
import { Spinner } from '@/components/ui/spinner';
import type { CreditCard, CreditCardBill } from '@/types/budget';
import { formatDate } from '@/utils/date';

interface CreditCardsSectionProps {
  cards: CreditCard[];
  activeBill: CreditCardBill | undefined;
  activeCardLimit: number;
  activeCardBillTotal: number;
  activeCardAvailable: number | null;
  activeCardTab: string;
  isLoading: boolean;
  onActiveCardChange: (cardId: string) => void;
}

export function CreditCardsSection({
  cards,
  activeBill,
  activeCardLimit,
  activeCardBillTotal,
  activeCardAvailable,
  activeCardTab,
  isLoading,
  onActiveCardChange,
}: Readonly<CreditCardsSectionProps>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" className="text-violet-500" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <CardStat label="Limite do cartão" value={activeCardLimit} highlight />
        <CardStat label="Total da fatura" value={activeCardBillTotal} negative />
        {activeCardAvailable !== null && (
          <CardStat
            label="Limite disponível"
            value={activeCardAvailable}
            positive={activeCardAvailable >= 0}
            negative={activeCardAvailable < 0}
          />
        )}
      </div>
      {activeBill && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          Vencimento:{' '}
          <span className="font-medium text-text dark:text-text-dark">
            {formatDate(activeBill.dueDate)}
          </span>
        </p>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {cards.map((card) => {
          const isActive = activeCardTab === card.id;
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
              onClick={() => onActiveCardChange(card.id)}
              className={`px-3 py-1.5 rounded font-medium border transition-colors text-xs ${activeClass}`}
            >
              <div className="flex items-center gap-1">
                <CreditCardBrandIcon brand={card.brand} />
                {card.name}
              </div>
            </button>
          );
        })}
      </div>
      <div className="max-h-[50vh] overflow-y-auto pr-1">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-gray-400 w-[45%]">Descrição</th>
              <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
              <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Categoria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
            {activeBill?.transactions.map((t) => (
              <tr key={t.id}>
                <td className="px-3 py-2 text-left text-text dark:text-text-dark truncate">
                  {t.description}
                </td>
                <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
                  R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-3 py-2 text-center">
                  <BadgeStatus status={t.category === 'Parcelado' ? 'success' : 'default'}>
                    {t.category}
                  </BadgeStatus>
                </td>
              </tr>
            )) || null}
            {(!activeBill || activeBill.transactions.length === 0) && (
              <tr>
                <td className="px-3 py-4 text-center text-gray-500 dark:text-gray-400" colSpan={3}>
                  Nenhuma transação de cartão neste período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
