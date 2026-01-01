import { BalanceEvolutionCard } from '@/components/dashboard/BalanceEvolutionCard';
import { CreditCardExpensesCard } from '@/components/dashboard/CreditCardExpensesCard';
import { ExpensesDistributionCard } from '@/components/dashboard/ExpensesDistributionCard';
import { FinancialGoalsCard } from '@/components/dashboard/FinancialGoalsCard';
import { IndebtednessCard } from '@/components/dashboard/IndebtednessCard';
import { MonthlyComparisonCard } from '@/components/dashboard/MonthlyComparisonCard';
import { RecentTransactionsCard } from '@/components/dashboard/RecentTransactionsCard';
import { SummaryCardsRow } from '@/components/dashboard/SummaryCardsRow';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { PullToRefresh } from '@/components/ui/pullToRefresh';

import {
  useDashboardBalanceHistory,
  useDashboardExpensesByCategory,
  useDashboardGoalsSummary,
  useDashboardRecentTransactions,
} from '@/hooks/useDashboard';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import type { DashboardFilters, DashboardTimeRange } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { useQueryClient } from '@tanstack/react-query';
import { format, subMonths, startOfMonth, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Banknote, BarChart3, Calendar, List } from 'lucide-react';
import { useMemo, useState } from 'react';

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Create array of last 6 months for the filter
  const last6Months = useMemo(() => {
    return Array.from({ length: 6 })
      .map((_, i) => {
        const date = subMonths(new Date(), i);
        return startOfMonth(date);
      })
      .reverse();
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const queryClient = useQueryClient();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

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

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange,
      referenceDate: selectedDate.toISOString(),
    }),
    [timeRange, selectedDate],
  );

  const balanceHistoryQuery = useDashboardBalanceHistory(companyId, filters);
  const expensesByCategoryQuery = useDashboardExpensesByCategory(companyId, filters);
  const goalsSummaryQuery = useDashboardGoalsSummary(companyId);
  const recentTransactionsQuery = useDashboardRecentTransactions(companyId, filters, 50);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    setIsRefreshing(false);
  };

  const formattedDate = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });

  const balanceHistory = balanceHistoryQuery.data ?? [];
  const isLoadingBalanceHistory = balanceHistoryQuery.isLoading;

  const expensesByCategory = expensesByCategoryQuery.data ?? [];
  const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.value, 0);

  const goalsSummary = goalsSummaryQuery.data ?? [];

  const detailedMovements =
    recentTransactionsQuery.data?.map((tx) => {
      // Backend returns values as positive numbers, so we need to apply the sign
      // Revenue: positive, Expense: negative
      const value = tx.launchType === 'revenue' ? Math.abs(tx.value) : -Math.abs(tx.value);
      return {
        date: tx.paymentDate,
        description: tx.description,
        value,
        type: tx.launchType === 'revenue' ? 'INCOME' : 'EXPENSE',
      };
    }) ?? [];

  const renderBalanceHistoryContent = () => {
    if (isLoadingBalanceHistory) {
      return (
        <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
          Carregando evolução do saldo...
        </div>
      );
    }

    if (balanceHistory.length > 0) {
      // Reutiliza o mesmo gráfico da seção principal
      return <BalanceEvolutionCard companyId={companyId} filters={filters} />;
    }

    return (
      <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
        Nenhum movimento financeiro no período selecionado.
      </div>
    );
  };

  return (
    <ViewDefault>
      {/* Modais */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Evolução do Saldo"
        className="max-w-4xl"
      >
        {/* ... modal content ... */}
        <div className="mb-6 h-64">{renderBalanceHistoryContent()}</div>
        <div className="border-t border-border dark:border-border-dark pt-4">
          <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">
            Movimentações Recentes
          </h3>
          <div className="overflow-y-auto max-h-80 pr-2">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-card dark:bg-card-dark">
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Descrição</th>
                  <th className="py-2 pr-4 font-medium text-right">Valor</th>
                  <th className="py-2 font-medium">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {detailedMovements.map((mov, idx) => (
                  <tr
                    key={`${mov.date}-${mov.description}-${idx}`}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-background/50 dark:hover:bg-background-dark/50"
                  >
                    <td className="py-2 pr-4 text-text dark:text-text-dark">
                      {format(new Date(mov.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="py-2 pr-4 text-text dark:text-text-dark">{mov.description}</td>
                    <td
                      className={`py-2 pr-4 text-right font-medium ${mov.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {mov.value >= 0
                        ? `+${formatCurrency(Math.abs(mov.value))}`
                        : formatCurrency(mov.value)}
                    </td>
                    <td className="py-2 text-text dark:text-text-dark">
                      {mov.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        title="Despesas por Categoria"
      >
        {/* ... content ... */}
        <div className="space-y-4">
          {expensesByCategory.map((cat) => {
            const percentage = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
            return (
              <div key={cat.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <div className="flex-1 mx-2">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${percentage}%`, background: cat.color }}
                    />
                  </div>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {formatCurrency(cat.value)}
                </span>
                <span className="ml-2 text-xs text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal
        open={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        title="Metas Financeiras"
      >
        {/* ... content ... */}
        <div className="space-y-6">
          {goalsSummary.map((goal) => (
            <div key={goal.id} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  {goal.name}
                </span>
                <span className="text-xs text-gray-500">{goal.progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-1">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${goal.progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{goal.description}</span>
                <span>Alvo: {formatCurrency(goal.targetAmount)}</span>
                <span>Atual: {formatCurrency(goal.currentAmount)}</span>
                <span>Até: {format(new Date(goal.deadline), 'MM/yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6 pt-0 pb-6 px-6"
        >
          {/* Header with Date and Filters */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <Banknote className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard Financeiro
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="bg-muted/30 p-1 rounded-full flex items-center gap-1 overflow-x-auto scrollbar-none border border-border/50">
                {last6Months.map((date) => {
                  const isSelected = isSameMonth(date, selectedDate) && timeRange === 'month';
                  return (
                    <Button
                      key={date.toISOString()}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDate(date);
                        setTimeRange('month');
                      }}
                      className={`
                        relative h-9 min-w-[3.5rem] rounded-full text-xs font-semibold
                        transition-all duration-300 ease-in-out
                        ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-100 z-10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                        }
                      `}
                    >
                      {format(date, 'MMM', { locale: ptBR }).toUpperCase()}
                      {isSelected && (
                        <motion.div
                          layoutId="activeMonth"
                          className="absolute inset-0 bg-white/10 rounded-full"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedView === 'overview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('overview')}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Visão Geral</span>
                </Button>
                <Button
                  variant={selectedView === 'details' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('details')}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Detalhes</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Financial Summary Cards */}
          <motion.div variants={item}>
            <SummaryCardsRow companyId={companyId} filters={filters} />
          </motion.div>

          {/* Indebtedness Metrics */}
          <motion.div variants={item}>
            <IndebtednessCard companyId={companyId} />
          </motion.div>

          {selectedView === 'overview' ? (
            /* Overview - Charts and Additional Info */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Row 1 */}
              <motion.div variants={item} className="md:col-span-2">
                <BalanceEvolutionCard
                  companyId={companyId}
                  filters={filters}
                  onOpenDetails={() => setShowDetailsModal(true)}
                />
              </motion.div>
              <motion.div variants={item} className="md:col-span-1">
                <ExpensesDistributionCard
                  companyId={companyId}
                  filters={filters}
                  onOpenCategories={() => setShowCategoriesModal(true)}
                />
              </motion.div>

              {/* Row 2 */}
              <motion.div variants={item} className="md:col-span-1">
                <MonthlyComparisonCard companyId={companyId} filters={filters} />
              </motion.div>
              <motion.div variants={item} className="md:col-span-1">
                <CreditCardExpensesCard companyId={companyId} filters={filters} />
              </motion.div>
              <motion.div variants={item} className="md:col-span-1">
                <FinancialGoalsCard
                  companyId={companyId}
                  onViewAll={() => setShowGoalsModal(true)}
                />
              </motion.div>
            </div>
          ) : (
            /* Details - Transaction List */
            <motion.div variants={item}>
              <RecentTransactionsCard
                companyId={companyId}
                filters={filters}
                limit={10}
                onViewAll={() => {}}
              />
            </motion.div>
          )}
        </motion.div>
      </PullToRefresh>
    </ViewDefault>
  );
}
