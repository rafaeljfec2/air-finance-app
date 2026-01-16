import { BadgeStatus, CardStat } from '@/components/budget';
import { CreditCardBrandIcon } from '@/components/budget/CreditCardBrandIcon';
import { Spinner } from '@/components/ui/spinner';
import type { CreditCard, CreditCardBill } from '@/types/budget';
import { formatDate } from '@/utils/date';
import { useCallback, useMemo } from 'react';

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
  activeCardAvailable: _activeCardAvailable, // eslint-disable-line @typescript-eslint/no-unused-vars
  activeCardTab,
  isLoading,
  onActiveCardChange,
}: Readonly<CreditCardsSectionProps>) {
  // Extract installment info from description
  const extractInstallment = (desc: string): { current: number; total: number } | null => {
    const regex1 = /parcela\s+(\d+)\/(\d+)/i;
    const regex2 = /(?:^|\s|-)(\d+)\/(\d+)(?:\s|$)/;
    let match = regex1.exec(desc);
    if (!match) {
      match = regex2.exec(desc);
    }
    if (!match) return null;
    const current = Number.parseInt(match[1] ?? '0', 10);
    const total = Number.parseInt(match[2] ?? '0', 10);
    if (current <= 0 || total <= 0 || current > total) return null;
    return { current, total };
  };

  // Filter out credit transactions (payments received, credits, etc.)
  const isDebitTransaction = useCallback(
    (transaction: { description: string; category: string }): boolean => {
      const description = transaction.description.toLowerCase();
      const category = transaction.category.toLowerCase();

      // Keywords that indicate credit transactions (payments received)
      const creditKeywords = [
        'pagamento recebido',
        'recebido',
        'crédito',
        'credit',
        'estorno',
        'reembolso',
        'devolução',
      ];

      // Categories that indicate income/revenue
      const creditCategories = [
        'salario',
        'salário',
        'aluguel recebido',
        'rendimento',
        'receita',
        'income',
        'revenue',
      ];

      // Check if description contains credit keywords
      const hasCreditKeyword = creditKeywords.some(keyword => description.includes(keyword));

      // Check if category indicates credit
      const hasCreditCategory = creditCategories.some(cat => category.includes(cat));

      // Exclude if it's a credit transaction
      return !hasCreditKeyword && !hasCreditCategory;
    },
    [],
  );

  // Filter only debit transactions (exclude credits/payments received)
  const debitTransactions = useMemo(() => {
    if (!activeBill?.transactions || activeBill.transactions.length === 0) {
      return [];
    }
    return activeBill.transactions.filter(isDebitTransaction);
  }, [activeBill?.transactions, isDebitTransaction]);

  // Calculate totals from transactions (only debits)
  const totals = useMemo(() => {
    if (debitTransactions.length === 0) {
      return {
        totalParcelado: 0,
        totalVista: 0,
        totalFinalizando: 0,
      };
    }

    let totalParcelado = 0;
    let totalVista = 0;
    let totalFinalizando = 0;

    debitTransactions.forEach((transaction) => {
      const installment = extractInstallment(transaction.description);
      const isParcelado = transaction.category === 'Parcelado' || installment !== null;

      if (isParcelado) {
        totalParcelado += transaction.value;
        // Check if it's the last installment (finalizando)
        if (installment && installment.current === installment.total) {
          totalFinalizando += transaction.value;
        }
      } else {
        totalVista += transaction.value;
      }
    });

    return {
      totalParcelado,
      totalVista,
      totalFinalizando,
    };
  }, [debitTransactions]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" className="text-violet-500" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
        <CardStat label="Limite do cartão" value={activeCardLimit} highlight />
        <CardStat label="Total da fatura" value={activeCardBillTotal} negative />
        <CardStat label="Total parcelado" value={totals.totalParcelado} />
        <CardStat label="Total crédito à vista" value={totals.totalVista} />
        <CardStat
          label="Parcelas finalizando"
          value={totals.totalFinalizando}
          highlight={totals.totalFinalizando > 0}
        />
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
              <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Categoria</th>
              <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
            {(() => {
              if (debitTransactions.length === 0) {
                return (
                  <tr>
                    <td
                      className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                      colSpan={3}
                    >
                      Nenhuma transação de cartão neste período.
                    </td>
                  </tr>
                );
              }

              // Sort transactions: first those that are finishing (fewer remaining installments), then the rest
              const sortedTransactions = [...debitTransactions].sort((a, b) => {
                const installmentA = extractInstallment(a.description);
                const installmentB = extractInstallment(b.description);

                // If neither has installment info, keep original order
                if (!installmentA && !installmentB) return 0;

                // Transactions with installments come first
                if (!installmentA) return 1;
                if (!installmentB) return -1;

                // Calculate remaining installments
                const remainingA = installmentA.total - installmentA.current;
                const remainingB = installmentB.total - installmentB.current;

                // First: those with fewer remaining installments (finishing first)
                if (remainingA !== remainingB) {
                  return remainingA - remainingB;
                }

                // If same remaining, sort by current installment (higher current first)
                return installmentB.current - installmentA.current;
              });

              return sortedTransactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-3 py-2 text-left text-text dark:text-text-dark truncate">
                    {t.description}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <BadgeStatus status={t.category === 'Parcelado' ? 'success' : 'default'}>
                      {t.category}
                    </BadgeStatus>
                  </td>
                  <td className="px-3 py-2 text-right font-medium whitespace-nowrap text-text dark:text-text-dark">
                    R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </>
  );
}
