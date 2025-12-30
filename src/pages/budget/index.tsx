import { CashFlowCard, CreditCardsCard, PayablesCard, ReceivablesCard } from '@/components/budget';
import { BudgetExpandedModal, type ExpandedCard } from '@/components/budget/BudgetExpandedModal';
import { MonthNavigator } from '@/components/budget/MonthNavigator';
import { useAccounts } from '@/hooks/useAccounts';
import { useBudget } from '@/hooks/useBudget';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getPreviousBalance } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

  /* Hook de contas para buscar o limite real do banco */
  const { accounts } = useAccounts();
  // Assumindo que o ID do cartão retornado pelo budget service é o mesmo ID da conta
  // Mapeamento de Cartão -> Conta
  // Mapeamento de Cartão -> Conta
  // Mapeamento de Cartão -> Conta
  const cardsWithAccounts = useMemo(() => {
    return cards.map(card => {
        // Strict matching using the accountId provided by the backend
        const account = accounts?.find(a => a.id === card.accountId);
        return { card, account };
    });
  }, [cards, accounts]);

  // Calcular data para buscar o saldo acumulado até o final do mês selecionado
  // A estratégia é buscar o "Previous Balance" do dia 1 do mês seguinte.
  const balanceDate = useMemo(() => {
    const year = parseInt(filter.year);
    const month = parseInt(filter.month);

    const now = new Date();
    // Check if selected month/year is the current one
    // Note: filter.month is "1" to "12", JS getMonth is 0 to 11.
    if ((month - 1) === now.getMonth() && year === now.getFullYear()) {
        // If current month, use "Tomorrow" to get balance inclusive of Today (assuming getPreviousBalance is exclusive of provided date)
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    // Data = Dia 1 do mês seguinte (standard logic for past/future months)
    const date = new Date(year, month, 1); 
    return date.toISOString().split('T')[0];
  }, [filter.year, filter.month]);

  // Busca o saldo de TODOS os cartões para exibir no contas a pagar
  const cardBalancesQueries = useQueries({
    queries: cardsWithAccounts.map(({ account }) => ({
        queryKey: ['previousBalance', companyId, balanceDate, account?.id],
        queryFn: async () => {
            if (!companyId || !account?.id) return 0;
            return getPreviousBalance(companyId, balanceDate, account.id);
        },
        enabled: !!companyId && !!account?.id,
    }))
  });

  // Mapa de balances: { [cardName]: balance }
  const realCardBalancesMap = useMemo(() => {
    const map: Record<string, number> = {};
    cardBalancesQueries.forEach((query, index) => {
        const cardName = cardsWithAccounts[index].card.name;
        if (query.data !== undefined) {
             // O saldo geralmente vem negativo se for dívida, ou positivo se for crédito.
             // Para contas a pagar, queremos o valor da dívida (absoluto invertido ou absoluto).
             // Se o saldo for -11000 (dívida), queremos mostrar 11000.
             map[cardName] = Math.abs(query.data);
        }
    });
    return map;
  }, [cardBalancesQueries, cardsWithAccounts]);

  // Sobrescreve os valores no array de payables
  const finalPayables = useMemo(() => {
     return payables.map(p => {
        // Tenta encontrar um cartão correspondente.
        // A convenção parece ser "NomeDoCartao Cartão"
        const matchedCardName = Object.keys(realCardBalancesMap).find(name => 
            p.description.toLowerCase().includes(name.toLowerCase()) && p.description.toLowerCase().includes('cartão')
        );

        if (matchedCardName) {
            return { ...p, value: realCardBalancesMap[matchedCardName] };
        }
        return p;
     });
  }, [payables, realCardBalancesMap]);
  
  // Encontrar o account do cartão ativo (reusing logic or simplified)
  const activeCardAccountEntry = cardsWithAccounts.find(x => x.card.id === activeCardTab);
  const activeCardRealBalance = cardBalancesQueries.find((_, idx) => cardsWithAccounts[idx].card.id === activeCardTab)?.data;

  const activeCardLimit = activeCardAccountEntry?.account?.creditLimit ?? activeCard?.limit ?? 0;
  const activeCardBillTotal = activeBill?.total ?? 0;
  const activeCardAvailable = activeCardLimit > 0 ? activeCardLimit - Math.abs(activeCardRealBalance ?? 0) : null; 
 
  // Define variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <ViewDefault>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-2 sm:px-6 pt-0 pb-6"
      >
        <motion.div variants={item} className="mb-4 relative z-10">
          <div className="absolute top-[-20px] left-[-20px] right-[-20px] bottom-[-20px] bg-gradient-to-r from-primary-500/5 to-transparent rounded-3xl -z-10 blur-xl dark:from-primary-500/10" />
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50 p-2 shadow-sm ring-1 ring-primary-500/10">
              <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark tracking-tight">
              Meu Orçamento
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-11 max-w-2xl">
            Visão geral do seu orçamento, fluxo de caixa e contas a pagar/receber para um planejamento financeiro eficiente.
          </p>
        </motion.div>
        
        {/* Filtro centralizado */}
        <motion.div variants={item} className="flex justify-center mb-6">
            <MonthNavigator
              month={filter.month}
              year={filter.year}
              onChange={(month, year) => setFilter({ month, year })}
            />
        </motion.div>

        <motion.div 
          variants={container} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
        >
          <motion.div variants={item} className="h-full">
            <CashFlowCard
              cashFlow={cashFlow}
              isLoading={isLoading}
              onExpand={() => setExpandedCard('cashFlow')}
            />
          </motion.div>

          <motion.div variants={item} className="h-full">
            <ReceivablesCard
              receivables={receivables}
              isLoading={isLoading}
              currentPage={receivablesPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setReceivablesPage}
              onExpand={() => setExpandedCard('receivables')}
            />
          </motion.div>

          <motion.div variants={item} className="h-full">
            <PayablesCard
              payables={finalPayables}
              isLoading={isLoading}
              currentPage={payablesPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPayablesPage}
              onExpand={() => setExpandedCard('payables')}
            />
          </motion.div>

          <motion.div variants={item} className="h-full">
            <CreditCardsCard
              cards={cards}
              isLoading={isLoading}
              activeCardId={activeCardTab}
              activeCardBalance={activeCardRealBalance}
              activeBill={activeBill}
              currentPage={cardPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCardPage}
              onChangeActiveCard={setActiveCardTab}
              onExpand={() => setExpandedCard('creditCards')}
            />
          </motion.div>
        </motion.div>
      </motion.div>

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
