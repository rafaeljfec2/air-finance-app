import { useCallback, useEffect, useMemo, useState } from 'react';

import { BadgeStatus, CardStat } from '@/components/budget';
import { CreditCardBrandIcon } from '@/components/budget/CreditCardBrandIcon';
import {
  EmptyState,
  GroupContainer,
  GroupHeader,
  SectionLoader,
  SectionTable,
  type TableColumn,
} from '@/components/budget/shared';
import type { CreditCard, CreditCardBill } from '@/types/budget';
import {
  calculateCreditCardTotals,
  filterCreditCardTransactions,
  isDebitTransaction,
  sumCreditCardTransactions,
  type CreditCardGridFilter,
} from '@/utils/creditCardTransactionFilters';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';
import { isFinishingInstallment } from '@/utils/installment.utils';

interface CreditCardsSectionProps {
  readonly cards: CreditCard[];
  readonly activeBill: CreditCardBill | undefined;
  readonly activeCardLimit: number;
  readonly activeCardBillTotal: number;
  readonly activeCardTab: string;
  readonly isLoading: boolean;
  readonly onActiveCardChange: (cardId: string) => void;
}

type Transaction = CreditCardBill['transactions'][number];

const TABLE_COLUMNS: TableColumn[] = [
  { key: 'date', label: 'Data', width: 'w-[15%]', align: 'left' },
  { key: 'description', label: 'Descrição', width: 'w-[40%]', align: 'left' },
  { key: 'category', label: 'Categoria', width: 'w-[25%]', align: 'center' },
  { key: 'value', label: 'Valor', width: 'w-[20%]', align: 'right' },
];

const FILTER_LABELS: Record<CreditCardGridFilter, string> = {
  all: 'Fatura',
  installment: 'Parcelado',
  cash: 'Crédito à vista',
  finishing: 'Finalizando',
};

function sortByDateDesc(a: Transaction, b: Transaction): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function getCardButtonClass(card: CreditCard, isActive: boolean): string {
  if (!isActive) {
    return 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-500';
  }

  const brandColors: Record<string, string> = {
    nubank: 'bg-[#8A05BE] text-white border-[#8A05BE]',
    itau: 'bg-[#FF6900] text-white border-[#FF6900]',
  };

  return brandColors[card.brand] ?? 'bg-primary-600 text-white dark:bg-primary-500';
}

function getFilteredGroupColor(
  filter: CreditCardGridFilter,
): 'emerald' | 'gray' | 'violet' | 'amber' {
  if (filter === 'finishing') {
    return 'emerald';
  }

  if (filter === 'all') {
    return 'violet';
  }

  if (filter === 'installment') {
    return 'amber';
  }

  return 'gray';
}

export function CreditCardsSection({
  cards,
  activeBill,
  activeCardLimit,
  activeCardBillTotal,
  activeCardTab,
  isLoading,
  onActiveCardChange,
}: CreditCardsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CreditCardGridFilter | null>(null);

  useEffect(() => {
    setActiveFilter(null);
  }, [activeCardTab]);

  const debitTransactions = useMemo(() => {
    if (!activeBill?.transactions || activeBill.transactions.length === 0) {
      return [];
    }

    return activeBill.transactions.filter(isDebitTransaction);
  }, [activeBill?.transactions]);

  const totals = useMemo(() => calculateCreditCardTotals(debitTransactions), [debitTransactions]);

  const { finishingTransactions, otherTransactions } = useMemo(() => {
    const finishing: Transaction[] = [];
    const other: Transaction[] = [];

    debitTransactions.forEach((transaction) => {
      if (isFinishingInstallment(transaction.description)) {
        finishing.push(transaction);
      } else {
        other.push(transaction);
      }
    });

    finishing.sort(sortByDateDesc);
    other.sort(sortByDateDesc);

    return { finishingTransactions: finishing, otherTransactions: other };
  }, [debitTransactions]);

  const filteredTransactions = useMemo(() => {
    if (!activeFilter) {
      return [];
    }

    return filterCreditCardTransactions(debitTransactions, activeFilter).sort(sortByDateDesc);
  }, [activeFilter, debitTransactions]);

  const handleFilterToggle = useCallback((filter: CreditCardGridFilter) => {
    setActiveFilter((current) => (current === filter ? null : filter));
  }, []);

  const renderCell = useCallback((item: Transaction, column: TableColumn) => {
    switch (column.key) {
      case 'date':
        return (
          <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatDate(item.date)}
          </span>
        );
      case 'description':
        return (
          <span className="text-text dark:text-text-dark break-words">{item.description}</span>
        );
      case 'category':
        return (
          <BadgeStatus status={item.category === 'Parcelado' ? 'success' : 'default'}>
            {item.category}
          </BadgeStatus>
        );
      case 'value':
        return (
          <span className="font-medium whitespace-nowrap text-text dark:text-text-dark">
            {formatCurrency(item.value)}
          </span>
        );
      default:
        return null;
    }
  }, []);

  if (isLoading) {
    return <SectionLoader color="violet" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
        <CardStat label="Limite do cartão" value={activeCardLimit} highlight disabled />
        <CardStat
          label="Fatura"
          value={activeCardBillTotal}
          negative
          onClick={() => handleFilterToggle('all')}
          isActive={activeFilter === 'all'}
        />
        <CardStat
          label="Parcelado"
          value={totals.totalParcelado}
          onClick={() => handleFilterToggle('installment')}
          isActive={activeFilter === 'installment'}
        />
        <CardStat
          label="Crédito à vista"
          value={totals.totalVista}
          onClick={() => handleFilterToggle('cash')}
          isActive={activeFilter === 'cash'}
        />
        <CardStat
          label="Finalizando"
          value={totals.totalFinalizando}
          highlight={totals.totalFinalizando > 0}
          onClick={() => handleFilterToggle('finishing')}
          isActive={activeFilter === 'finishing'}
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
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onActiveCardChange(card.id)}
            className={`px-3 py-1.5 rounded font-medium border transition-colors text-xs ${getCardButtonClass(card, activeCardTab === card.id)}`}
          >
            <div className="flex items-center gap-1">
              <CreditCardBrandIcon brand={card.brand} />
              {card.name}
            </div>
          </button>
        ))}
      </div>

      <div className="max-h-[50vh] overflow-y-auto pr-1">
        {debitTransactions.length === 0 ? (
          <EmptyState message="Nenhuma transação de cartão neste período." />
        ) : activeFilter ? (
          filteredTransactions.length === 0 ? (
            <EmptyState message="Nenhuma transação para este filtro." />
          ) : (
            <div>
              <GroupHeader
                title={FILTER_LABELS[activeFilter]}
                count={filteredTransactions.length}
                total={sumCreditCardTransactions(filteredTransactions)}
                color={getFilteredGroupColor(activeFilter)}
              />
              <GroupContainer color={getFilteredGroupColor(activeFilter)}>
                <SectionTable
                  columns={TABLE_COLUMNS}
                  data={filteredTransactions}
                  keyExtractor={(item) => item.id}
                  renderCell={renderCell}
                />
              </GroupContainer>
            </div>
          )
        ) : (
          <div className="space-y-6">
            {finishingTransactions.length > 0 && (
              <div>
                <GroupHeader
                  title="Parcelas Finalizando"
                  count={finishingTransactions.length}
                  total={sumCreditCardTransactions(finishingTransactions)}
                  color="emerald"
                />
                <GroupContainer color="emerald">
                  <SectionTable
                    columns={TABLE_COLUMNS}
                    data={finishingTransactions}
                    keyExtractor={(item) => item.id}
                    renderCell={renderCell}
                  />
                </GroupContainer>
              </div>
            )}

            {otherTransactions.length > 0 && (
              <div>
                <GroupHeader
                  title="Outras Compras"
                  count={otherTransactions.length}
                  total={sumCreditCardTransactions(otherTransactions)}
                  color="gray"
                />
                <GroupContainer color="gray">
                  <SectionTable
                    columns={TABLE_COLUMNS}
                    data={otherTransactions}
                    keyExtractor={(item) => item.id}
                    renderCell={renderCell}
                  />
                </GroupContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
