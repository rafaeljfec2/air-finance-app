import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { cn } from '@/lib/utils';
import { StatementSummary } from '@/components/statement/StatementSummary';
import { useQuery } from '@tanstack/react-query';
import { Dashboard as DashboardType } from '@/types';
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

// Dados mockados para exemplo (manter temporariamente)
const mockData = {
  totalIncome: 5000,
  totalExpenses: 3000,
  balance: 2000,
  expensesByCategory: [
    { name: 'Alimentação', value: 1000 },
    { name: 'Transporte', value: 800 },
    { name: 'Moradia', value: 1200 },
  ],
  recentTransactions: [
    {
      id: 1,
      description: 'Supermercado',
      amount: -150,
      category: 'Alimentação',
      date: '2024-03-15',
    },
    {
      id: 2,
      description: 'Salário',
      amount: 5000,
      category: 'Renda',
      date: '2024-03-10',
    },
    {
      id: 3,
      description: 'Aluguel',
      amount: -1200,
      category: 'Moradia',
      date: '2024-03-05',
    },
  ],
};

// Adicionar dados mockados para o gráfico
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

  const { data: dashboardData, isLoading } = useQuery<DashboardType>({
    queryKey: ['dashboard', timeRange],
    queryFn: async () => {
      // TODO: Implementar chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        saldo: mockData.balance,
        receitas: mockData.totalIncome,
        despesas: mockData.totalExpenses,
        transacoes: mockData.recentTransactions.map(t => ({
          id: t.id.toString(),
          descricao: t.description,
          valor: t.amount,
          tipo: t.amount > 0 ? 'RECEITA' : 'DESPESA',
          categoria: t.category,
          data: t.date,
          usuarioId: '1'
        }))
      };
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implementar atualização dos dados
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
          {/* Header com Data e Filtros */}
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
              {/* Seletor de Período */}
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

              {/* Alternador de Visualização */}
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

          {/* Resumo Financeiro */}
          {dashboardData && (
            <StatementSummary
              balance={dashboardData.saldo}
              income={dashboardData.receitas}
              expenses={dashboardData.despesas}
              previousBalance={mockData.balance * 0.8} // TODO: Implementar dados reais
              previousIncome={mockData.totalIncome * 0.9}
              previousExpenses={mockData.totalExpenses * 0.85}
            />
          )}

          {selectedView === 'overview' ? (
            /* Visão Geral - Gráficos */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text dark:text-text-dark">
                      Despesas por Categoria
                    </h3>
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="h-80">
                    <PieChart data={mockData.expensesByCategory} />
                  </div>
                </div>
              </Card>

              <Card className="border-border dark:border-border-dark">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text dark:text-text-dark">
                      Evolução do Saldo
                    </h3>
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="h-80">
                    <BalanceChart data={mockBalanceHistory} />
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Visão Detalhada - Lista de Transações */
            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-text dark:text-text-dark">
                    Últimas Transações
                  </h3>
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </div>
                {dashboardData && (
                  <TransactionList transactions={dashboardData.transacoes} />
                )}
              </div>
            </Card>
          )}
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
