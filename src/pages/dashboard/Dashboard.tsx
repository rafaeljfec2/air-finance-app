import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { StatementSummary } from '@/components/statement/StatementSummary';
import { useQuery } from '@tanstack/react-query';
import { Transaction, Category, TransactionType } from '@/types/transaction';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BalanceChart } from '@/components/charts/BalanceChart';

interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
}

// Mock data for example (keep temporarily)
const mockData: DashboardData = {
  income: 5000,
  expenses: 3000,
  balance: 2000,
  transactions: [
    {
      id: '1',
      description: 'Supermercado',
      amount: 150,
      type: 'EXPENSE',
      category: {
        id: 'cat1',
        name: 'Alimentação',
        type: 'EXPENSE',
        color: '#F44336'
      },
      date: new Date().toISOString(),
      categoryId: 'cat1',
      accountId: '1',
      account: {
        id: '1',
        name: 'Main Account'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      description: 'Salário',
      amount: 5000,
      type: 'INCOME',
      category: {
        id: 'cat2',
        name: 'Renda',
        type: 'INCOME',
        color: '#4CAF50'
      },
      date: new Date().toISOString(),
      categoryId: 'cat2',
      accountId: '1',
      account: {
        id: '1',
        name: 'Main Account'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      description: 'Aluguel',
      amount: 1200,
      type: 'EXPENSE',
      category: {
        id: 'cat3',
        name: 'Moradia',
        type: 'EXPENSE',
        color: '#2196F3'
      },
      date: new Date().toISOString(),
      categoryId: 'cat3',
      accountId: '1',
      account: {
        id: '1',
        name: 'Main Account'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ]
};

// Mock data for the chart
const mockBalanceHistory = [
  { date: '2024-03-01', balance: 1500 },
  { date: '2024-03-05', balance: 2300 },
  { date: '2024-03-10', balance: 1800 },
  { date: '2024-03-15', balance: 2800 },
  { date: '2024-03-20', balance: 2500 },
  { date: '2024-03-25', balance: 3200 },
  { date: '2024-03-30', balance: 2000 },
];

type TimeRange = 'day' | 'week' | 'month' | 'year';

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard', timeRange],
    queryFn: async () => {
      // TODO: Implement real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implement data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex h-96 items-center justify-center">
          <div className="text-gray-400">
            <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-primary-200 rounded-full mb-4 mx-auto" />
            <p>Carregando...</p>
          </div>
        </div>
      </ViewDefault>
    );
  }

  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="space-y-6 p-6">
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
                onValueChange={(value: string) => setTimeRange(value as TimeRange)} 
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

          {/* Financial Summary */}
          {dashboardData && (
            <StatementSummary
              balance={dashboardData.balance}
              income={dashboardData.income}
              expenses={dashboardData.expenses}
              previousBalance={mockData.balance * 0.8} // TODO: Implement real data
              previousIncome={mockData.income * 0.9}
              previousExpenses={mockData.expenses * 0.85}
            />
          )}

          {selectedView === 'overview' ? (
            /* Overview - Charts */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text dark:text-text-dark">
                      Saldo
                    </h3>
                  </div>
                  <BalanceChart data={mockBalanceHistory} />
                </div>
              </Card>

              <Card className="border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text dark:text-text-dark">
                      Despesas por Categoria
                    </h3>
                  </div>
                  <PieChart
                    data={dashboardData?.transactions
                      .filter(t => t.type === 'EXPENSE')
                      .map(t => ({
                        name: t.category.name,
                        value: t.amount,
                        color: t.category.color || '#000000'
                      })) || []}
                  />
                </div>
              </Card>
            </div>
          ) : (
            /* Details - Transaction List */
            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text dark:text-text-dark mb-4">
                  Transações Recentes
                </h3>
                <TransactionList transactions={dashboardData?.transactions || []} />
              </div>
            </Card>
          )}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
