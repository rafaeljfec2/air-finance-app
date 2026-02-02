import { ExpandedCard } from '@/components/budget/BudgetExpandedModal';
import { useAccounts } from '@/hooks/useAccounts';
import { useBudget } from '@/hooks/useBudget';
import { getPreviousBalance } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export function useBudgetPageController() {
  const [filter, setFilter] = useState(() => {
    const today = new Date();
    return {
      month: (today.getMonth() + 1).toString().padStart(2, '0'),
      year: today.getFullYear().toString(),
    };
  });

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? null;

  const { data, isLoading, refetch } = useBudget(companyId, filter);

  const cashFlow = data?.cashFlow ?? null;
  const receivables = data?.receivables ?? [];
  const payables = useMemo(() => data?.payables ?? [], [data?.payables]);
  const cards = useMemo(() => data?.creditCards ?? [], [data?.creditCards]);

  const [activeCardTab, setActiveCardTab] = useState(cards[0]?.id || '');

  // Effect to select first card when data loads if none selected
  useEffect(() => {
    if (!activeCardTab && cards.length > 0) {
      setActiveCardTab(cards[0].id);
    }
  }, [cards, activeCardTab]);

  // Estados de página para cada grid
  const [receivablesPage, setReceivablesPage] = useState(1);
  const [payablesPage, setPayablesPage] = useState(1);
  const [cardPage, setCardPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const activeCard = useMemo(
    () => cards.find((c) => c.id === activeCardTab),
    [cards, activeCardTab],
  );
  const activeBill = useMemo(
    () => activeCard?.bills.find((b) => b.month === `${filter.year}-${filter.month}`),
    [activeCard, filter.year, filter.month],
  );

  /* Hook de contas para buscar o limite real do banco */
  const { accounts } = useAccounts();

  const cardsWithAccounts = useMemo(() => {
    return cards.map((card) => {
      // Strict matching using the accountId provided by the backend
      const account = accounts?.find((a) => a.id === card.accountId);
      return { card, account };
    });
  }, [cards, accounts]);

  // Calcular data para buscar o saldo acumulado até o final do mês selecionado
  const balanceDate = useMemo(() => {
    const year = Number.parseInt(filter.year);
    const month = Number.parseInt(filter.month);

    const now = new Date();
    // Check if selected month/year is the current one
    if (month - 1 === now.getMonth() && year === now.getFullYear()) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    const date = new Date(year, month, 1);
    return date.toISOString().split('T')[0];
  }, [filter.year, filter.month]);

  const cardBalancesQueries = useQueries({
    queries: cardsWithAccounts.map(({ account }) => ({
      queryKey: ['previousBalance', companyId, balanceDate, account?.id],
      queryFn: async () => {
        if (!companyId || !account?.id) return 0;
        return getPreviousBalance(companyId, balanceDate, account.id);
      },
      enabled: !!companyId && !!account?.id,
    })),
  });

  // Mapa de balances: { [cardName]: balance }
  const realCardBalancesMap = useMemo(() => {
    const map: Record<string, number> = {};
    cardBalancesQueries.forEach((query, index) => {
      const cardName = cardsWithAccounts[index].card.name;
      if (query.data !== undefined) {
        map[cardName] = Math.abs(query.data);
      }
    });
    return map;
  }, [cardBalancesQueries, cardsWithAccounts]);

  // Sobrescreve os valores no array de payables
  const finalPayables = useMemo(() => {
    return payables.map((p) => {
      const matchedCardName = Object.keys(realCardBalancesMap).find(
        (name) =>
          p.description.toLowerCase().includes(name.toLowerCase()) &&
          p.description.toLowerCase().includes('cartão'),
      );

      if (matchedCardName) {
        return { ...p, value: realCardBalancesMap[matchedCardName] };
      }
      return p;
    });
  }, [payables, realCardBalancesMap]);

  const activeCardAccountEntry = cardsWithAccounts.find((x) => x.card.id === activeCardTab);
  const activeCardRealBalance = cardBalancesQueries.find(
    (_, idx) => cardsWithAccounts[idx].card.id === activeCardTab,
  )?.data;

  const activeCardLimit = activeCardAccountEntry?.account?.creditLimit ?? activeCard?.limit ?? 0;
  const activeCardBillTotal = activeBill?.total ?? 0;
  const activeCardAvailable =
    activeCardLimit > 0 ? activeCardLimit - Math.abs(activeCardRealBalance ?? 0) : null;

  return {
    filter,
    setFilter,
    isLoading,
    cashFlow,
    receivables,
    payables: finalPayables,
    cards,
    activeCardTab,
    setActiveCardTab,
    receivablesPage,
    setReceivablesPage,
    payablesPage,
    setPayablesPage,
    cardPage,
    setCardPage,
    ITEMS_PER_PAGE,
    expandedCard,
    setExpandedCard,
    activeBill,
    activeCardLimit,
    activeCardBillTotal,
    activeCardAvailable,
    activeCardRealBalance,
    refetch,
  };
}
