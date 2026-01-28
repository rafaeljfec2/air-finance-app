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
      const hasCreditKeyword = creditKeywords.some((keyword) => description.includes(keyword));

      // Check if category indicates credit
      const hasCreditCategory = creditCategories.some((cat) => category.includes(cat));

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
        <CardStat label="Fatura" value={activeCardBillTotal} negative />
        <CardStat label="Parcelado" value={totals.totalParcelado} />
        <CardStat label="Crédito à vista" value={totals.totalVista} />
        <CardStat
          label="Finalizando"
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
        {(() => {
          if (debitTransactions.length === 0) {
            return (
              <p className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                Nenhuma transação de cartão neste período.
              </p>
            );
          }

          // Separate finishing installments from other transactions
          const finishingTransactions: typeof debitTransactions = [];
          const otherTransactions: typeof debitTransactions = [];

          debitTransactions.forEach((t) => {
            const installment = extractInstallment(t.description);
            if (installment && installment.current === installment.total) {
              finishingTransactions.push(t);
            } else {
              otherTransactions.push(t);
            }
          });

          // Sort by date (most recent first)
          const sortByDate = (
            a: (typeof debitTransactions)[0],
            b: (typeof debitTransactions)[0],
          ) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          };

          finishingTransactions.sort(sortByDate);
          otherTransactions.sort(sortByDate);

          const renderTable = (transactions: typeof debitTransactions) => (
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left text-gray-400 w-[15%]">Data</th>
                  <th className="px-2 py-1.5 text-left text-gray-400 w-[40%]">Descrição</th>
                  <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Categoria</th>
                  <th className="px-2 py-1.5 text-right text-gray-400 w-[20%]">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-2 py-1.5 text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate max-w-[200px]">
                      {t.description}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <BadgeStatus status={t.category === 'Parcelado' ? 'success' : 'default'}>
                        {t.category}
                      </BadgeStatus>
                    </td>
                    <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap text-text dark:text-text-dark">
                      R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

          return (
            <div className="space-y-6">
              {finishingTransactions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Parcelas Finalizando ({finishingTransactions.length})
                    </h4>
                    <span className="text-xs text-gray-500 ml-auto">
                      Total: R${' '}
                      {finishingTransactions
                        .reduce((acc, t) => acc + t.value, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
                    {renderTable(finishingTransactions)}
                  </div>
                </div>
              )}

              {otherTransactions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Outras Compras ({otherTransactions.length})
                    </h4>
                    <span className="text-xs text-gray-500 ml-auto">
                      Total: R${' '}
                      {otherTransactions
                        .reduce((acc, t) => acc + t.value, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border dark:border-border-dark overflow-hidden">
                    {renderTable(otherTransactions)}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </>
  );
}
