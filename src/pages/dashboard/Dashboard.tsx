import { BalanceEvolutionCard } from '@/components/dashboard/BalanceEvolutionCard';
import { ExpensesDistributionCard } from '@/components/dashboard/ExpensesDistributionCard';
import { FinancialGoalsCard } from '@/components/dashboard/FinancialGoalsCard';
import { MonthlyComparisonCard } from '@/components/dashboard/MonthlyComparisonCard';
import { RecentTransactionsCard } from '@/components/dashboard/RecentTransactionsCard';
import { SummaryCardsRow } from '@/components/dashboard/SummaryCardsRow';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  BanknotesIcon,
  CalendarIcon,
  ChartBarIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo, useState } from 'react';

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const queryClient = useQueryClient();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

  const filters: DashboardFilters = useMemo(
    () => ({
      timeRange,
    }),
    [timeRange],
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

  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  const balanceHistory = balanceHistoryQuery.data ?? [];
  const isLoadingBalanceHistory = balanceHistoryQuery.isLoading;

  const expensesByCategory = expensesByCategoryQuery.data ?? [];
  const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.value, 0);

  const goalsSummary = goalsSummaryQuery.data ?? [];

  const detailedMovements =
    recentTransactionsQuery.data?.map((tx) => ({
      date: tx.paymentDate,
      description: tx.description,
      value: tx.launchType === 'revenue' ? tx.value : -tx.value,
      type: tx.launchType === 'revenue' ? 'INCOME' : 'EXPENSE',
    })) ?? [];

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
      >
        <div className="mb-4 h-64">{renderBalanceHistoryContent()}</div>
        <div className="overflow-x-auto max-h-80">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Descrição</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {detailedMovements.map((mov, idx) => (
                <tr
                  key={`${mov.date}-${mov.description}-${idx}`}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="py-2 pr-4">{format(new Date(mov.date), 'dd/MM/yyyy')}</td>
                  <td className="py-2 pr-4">{mov.description}</td>
                  <td
                    className={
                      mov.value >= 0 ? 'text-green-500 py-2 pr-4' : 'text-red-500 py-2 pr-4'
                    }
                  >
                    {formatCurrency(mov.value)}
                  </td>
                  <td className="py-2">{mov.type === 'INCOME' ? 'Receita' : 'Despesa'}</td>
                </tr>
              ))}
              {detailedMovements.length === 0 && (
                <tr>
                  <td className="py-3 text-center text-gray-500 dark:text-gray-400" colSpan={4}>
                    Nenhuma transação recente para exibir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        open={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        title="Despesas por Categoria"
      >
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
          {expensesByCategory.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma despesa encontrada no período selecionado.
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        title="Metas Financeiras"
      >
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
          {goalsSummary.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma meta financeira cadastrada para esta empresa.
            </p>
          )}
        </div>
      </Modal>

      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="space-y-6 pt-0 pb-6 px-6">
          {/* Header with Date and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard Financeiro
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Period Selector */}
              <Tabs
                value={timeRange}
                onValueChange={(value: string) => setTimeRange(value as DashboardTimeRange)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="year">Ano</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* View Switcher */}
              <div className="flex gap-2">
                <Button
                  variant={selectedView === 'overview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('overview')}
                  className="flex items-center gap-2"
                >
                  <ChartBarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Visão Geral</span>
                </Button>
                <Button
                  variant={selectedView === 'details' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('details')}
                  className="flex items-center gap-2"
                >
                  <ListBulletIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Detalhes</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Financial Summary Cards */}
          <SummaryCardsRow companyId={companyId} filters={filters} />

          {selectedView === 'overview' ? (
            /* Overview - Charts and Additional Info */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <BalanceEvolutionCard
                  companyId={companyId}
                  filters={filters}
                  onOpenDetails={() => setShowDetailsModal(true)}
                />
                <MonthlyComparisonCard companyId={companyId} filters={filters} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <ExpensesDistributionCard
                  companyId={companyId}
                  filters={filters}
                  onOpenCategories={() => setShowCategoriesModal(true)}
                />
                <FinancialGoalsCard
                  companyId={companyId}
                  onViewAll={() => setShowGoalsModal(true)}
                />
              </div>
            </div>
          ) : (
            /* Details - Transaction List */
            <RecentTransactionsCard
              companyId={companyId}
              filters={filters}
              limit={10}
              onViewAll={() => {}}
            />
          )}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
