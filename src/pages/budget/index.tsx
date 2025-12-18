import { CashFlowCard, CreditCardsCard, PayablesCard, ReceivablesCard } from '@/components/budget';
import { BudgetExpandedModal, type ExpandedCard } from '@/components/budget/BudgetExpandedModal';
import { MonthNavigator } from '@/components/budget/MonthNavigator';
import { useBudget } from '@/hooks/useBudget';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { Wallet } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export function BudgetPage() {
  // Estado único para filtro central
  const [filter, setFilter] = useState({ month: '12', year: '2025' });

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? null;

  const { data, isLoading } = useBudget(companyId, filter);

  const cashFlow = data?.cashFlow ?? null;
  const receivables = data?.receivables ?? [];
  const payables = data?.payables ?? [];
  const cards = useMemo(() => data?.creditCards ?? [], [data?.creditCards]);

  const [activeCardTab, setActiveCardTab] = useState(cards[0]?.id || '');

  // Estados de página para cada grid
  const [receivablesPage, setReceivablesPage] = useState(1);
  const [payablesPage, setPayablesPage] = useState(1);
  const [cardPage, setCardPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const activeCard = useMemo(
    () => cards.find((c) => c.id === activeCardTab),
    [cards, activeCardTab],
  );
  const activeBill = useMemo(
    () => activeCard?.bills.find((b) => b.month === `${filter.year}-${filter.month}`),
    [activeCard, filter.year, filter.month],
  );

  const activeCardLimit = activeCard?.limit ?? 0;
  const activeCardBillTotal = activeBill?.total ?? 0;
  const activeCardAvailable = activeCardLimit > 0 ? activeCardLimit - activeCardBillTotal : null;

  // Garante que sempre exista um cartão ativo (primeiro da lista) quando houver cartões
  React.useEffect(() => {
    if (cards.length === 0) {
      return;
    }

    const hasActiveCard = cards.some((card) => card.id === activeCardTab);
    if (!hasActiveCard) {
      setActiveCardTab(cards[0].id);
    }
  }, [cards, activeCardTab]);

  // Resetar página ao trocar de mês/ano ou cartão
  React.useEffect(() => {
    setReceivablesPage(1);
    setPayablesPage(1);
    setCardPage(1);
  }, [filter, activeCardTab]);

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 pt-0 pb-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 p-2">
              <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark">
              Meu Orçamento
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
            Visão geral do seu orçamento, fluxo de caixa e contas a pagar/receber
          </p>
        </div>
        {/* Filtro centralizado */}
        <div className="flex justify-center mb-8">
          <MonthNavigator
            month={filter.month}
            year={filter.year}
            onChange={(month, year) => setFilter({ month, year })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          <CashFlowCard
            cashFlow={cashFlow}
            isLoading={isLoading}
            onExpand={() => setExpandedCard('cashFlow')}
          />

          <ReceivablesCard
            receivables={receivables}
            isLoading={isLoading}
            currentPage={receivablesPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setReceivablesPage}
            onExpand={() => setExpandedCard('receivables')}
          />

          <PayablesCard
            payables={payables}
            isLoading={isLoading}
            currentPage={payablesPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setPayablesPage}
            onExpand={() => setExpandedCard('payables')}
          />

          <CreditCardsCard
            cards={cards}
            isLoading={isLoading}
            activeCardId={activeCardTab}
            activeBill={activeBill}
            currentPage={cardPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCardPage}
            onChangeActiveCard={setActiveCardTab}
            onExpand={() => setExpandedCard('creditCards')}
          />
        </div>
      </div>

      <BudgetExpandedModal
        expandedCard={expandedCard}
        isLoading={isLoading}
        cashFlow={cashFlow}
        receivables={receivables}
        payables={payables}
        cards={cards}
        activeBill={activeBill}
        activeCardLimit={activeCardLimit}
        activeCardBillTotal={activeCardBillTotal}
        activeCardAvailable={activeCardAvailable}
        activeCardTab={activeCardTab}
        onActiveCardChange={setActiveCardTab}
        onClose={() => setExpandedCard(null)}
      />
    </ViewDefault>
  );
}
