import { CashFlowCard, CreditCardsCard, PayablesCard, ReceivablesCard } from '@/components/budget';
import { BudgetExpandedModal } from '@/components/budget/BudgetExpandedModal';
import { MonthNavigator } from '@/components/budget/MonthNavigator';
import { ViewDefault } from '@/layouts/ViewDefault';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

import { useBudgetPageController } from '@/hooks/useBudgetPageController';

export function BudgetPage() {
  const {
    filter,
    setFilter,
    isLoading,
    cashFlow,
    receivables,
    payables,
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
    activeCardRealBalance
  } = useBudgetPageController();
 
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
            Visão geral do seu orçamento.
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
              payables={payables}
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
