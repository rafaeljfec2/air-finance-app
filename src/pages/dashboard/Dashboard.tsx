import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { 
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ListBulletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  ClockIcon,
  ChartPieIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BalanceChart } from '@/components/charts/BalanceChart';
import { formatCurrency } from '@/utils/formatters';
import { Modal } from '@/components/ui/Modal';

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
        name: 'Main Account',
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        name: 'Main Account',
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        name: 'Main Account',
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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

// Mock data for category distribution
const mockCategoryData = [
  { name: 'Alimentação', value: 1200, color: '#F44336' },
  { name: 'Moradia', value: 1500, color: '#2196F3' },
  { name: 'Transporte', value: 800, color: '#4CAF50' },
  { name: 'Lazer', value: 500, color: '#FF9800' },
  { name: 'Saúde', value: 300, color: '#9C27B0' },
];

// Mock data for monthly comparison
const mockMonthlyComparison = {
  current: {
    income: 5000,
    expenses: 3000,
    savings: 2000
  },
  previous: {
    income: 4500,
    expenses: 2800,
    savings: 1700
  }
};

type TimeRange = 'day' | 'week' | 'month' | 'year';

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

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

  // Mock movimentações para o modal de detalhes
  const mockMovements = [
    { date: '2024-03-01', description: 'Salário', value: 5000, type: 'INCOME' },
    { date: '2024-03-03', description: 'Supermercado', value: -350, type: 'EXPENSE' },
    { date: '2024-03-10', description: 'Aluguel', value: -1200, type: 'EXPENSE' },
    { date: '2024-03-15', description: 'Transporte', value: -200, type: 'EXPENSE' },
    { date: '2024-03-20', description: 'Freelance', value: 800, type: 'INCOME' },
  ];

  // Mock metas para o modal de metas
  const mockGoals = [
    { name: 'Reserva de Emergência', description: 'Guardar 6 meses de despesas', progress: 75, target: 12000, current: 9000, due: '2024-12-31' },
    { name: 'Viagem', description: 'Viagem internacional', progress: 40, target: 8000, current: 3200, due: '2025-06-01' },
    { name: 'Comprar Carro', description: 'Entrada para carro novo', progress: 60, target: 20000, current: 12000, due: '2025-09-30' },
  ];

  return (
    <ViewDefault>
      {/* Modais */}
      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Evolução do Saldo">
        <div className="mb-4">
          <BalanceChart data={mockBalanceHistory} />
        </div>
        <div className="overflow-x-auto">
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
              {mockMovements.map((mov, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4">{format(new Date(mov.date), 'dd/MM/yyyy')}</td>
                  <td className="py-2 pr-4">{mov.description}</td>
                  <td className={mov.value >= 0 ? 'text-green-500 py-2 pr-4' : 'text-red-500 py-2 pr-4'}>
                    {formatCurrency(mov.value)}
                  </td>
                  <td className="py-2">{mov.type === 'INCOME' ? 'Receita' : 'Despesa'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal open={showCategoriesModal} onClose={() => setShowCategoriesModal(false)} title="Despesas por Categoria">
        <div className="space-y-4">
          {mockCategoryData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: cat.color }} />
                <span className="font-medium">{cat.name}</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${(cat.value / 4300) * 100}%`, background: cat.color }}></div>
                </div>
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(cat.value)}</span>
              <span className="ml-2 text-xs text-gray-500">{((cat.value / 4300) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={showGoalsModal} onClose={() => setShowGoalsModal(false)} title="Metas Financeiras">
        <div className="space-y-6">
          {mockGoals.map((goal) => (
            <div key={goal.name} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-purple-600 dark:text-purple-400">{goal.name}</span>
                <span className="text-xs text-gray-500">{goal.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-1">
                <div className="h-2 rounded-full bg-purple-500" style={{ width: `${goal.progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{goal.description}</span>
                <span>Alvo: {formatCurrency(goal.target)}</span>
                <span>Atual: {formatCurrency(goal.current)}</span>
                <span>Até: {format(new Date(goal.due), 'MM/yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

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

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(dashboardData?.balance || 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <WalletIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+12% vs mês anterior</span>
              </div>
            </Card>

            <Card className="bg-white dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                    {formatCurrency(dashboardData?.income || 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-500">Última atualização: agora</span>
              </div>
            </Card>

            <Card className="bg-white dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</p>
                  <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                    {formatCurrency(dashboardData?.expenses || 0)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ChartPieIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-500">Ver distribuição</span>
              </div>
            </Card>
          </div>

          {selectedView === 'overview' ? (
            /* Overview - Charts and Additional Info */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <Card className="border-border dark:border-border-dark">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-text dark:text-text-dark">
                        Evolução do Saldo
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => setShowDetailsModal(true)}>
                        Ver detalhes
                      </Button>
                    </div>
                    <div className="h-56 w-full">
                      <BalanceChart data={mockBalanceHistory} />
                    </div>
                  </div>
                </Card>

                <Card className="border-border dark:border-border-dark">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-text dark:text-text-dark">
                        Comparativo Mensal
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ArrowUpIcon className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-gray-500">Receitas</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-500">
                            {formatCurrency(mockMonthlyComparison.current.income)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((mockMonthlyComparison.current.income / mockMonthlyComparison.previous.income - 1) * 100).toFixed(1)}% vs mês anterior
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ArrowDownIcon className="h-5 w-5 text-red-500" />
                          <span className="text-sm text-gray-500">Despesas</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-500">
                            {formatCurrency(mockMonthlyComparison.current.expenses)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((mockMonthlyComparison.current.expenses / mockMonthlyComparison.previous.expenses - 1) * 100).toFixed(1)}% vs mês anterior
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
                          <span className="text-sm text-gray-500">Economia</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-500">
                            {formatCurrency(mockMonthlyComparison.current.savings)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((mockMonthlyComparison.current.savings / mockMonthlyComparison.previous.savings - 1) * 100).toFixed(1)}% vs mês anterior
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card className="border-border dark:border-border-dark">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-text dark:text-text-dark">
                        Distribuição de Despesas
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => setShowCategoriesModal(true)}>
                        Ver categorias
                      </Button>
                    </div>
                    <PieChart data={mockCategoryData} />
                  </div>
                </Card>

                <Card className="border-border dark:border-border-dark">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-text dark:text-text-dark">
                        Metas Financeiras
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => setShowGoalsModal(true)}>
                        Ver todas
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-sm">Reserva de Emergência</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">75%</p>
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-sm">Redução de Dívidas</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">45%</p>
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            /* Details - Transaction List */
            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-text dark:text-text-dark">
                    Transações Recentes
                  </h3>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </div>
                <TransactionList transactions={dashboardData?.transactions || []} />
              </div>
            </Card>
          )}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
