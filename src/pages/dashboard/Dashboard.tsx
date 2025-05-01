import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { PullToRefresh } from '@/components/ui/pullToRefresh';
import { cn } from '@/lib/utils';

// Dados mockados para exemplo
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

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implementar atualização dos dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <ViewDefault>
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="space-y-6 p-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text dark:text-text-dark">Receitas</h3>
                <p className="mt-2 text-3xl font-bold text-green-400">
                  R$ {mockData.totalIncome.toLocaleString('pt-BR')}
                </p>
              </div>
            </Card>

            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text dark:text-text-dark">Despesas</h3>
                <p className="mt-2 text-3xl font-bold text-red-400">
                  R$ {mockData.totalExpenses.toLocaleString('pt-BR')}
                </p>
              </div>
            </Card>

            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text dark:text-text-dark">Saldo</h3>
                <p
                  className={cn(
                    'mt-2 text-3xl font-bold',
                    mockData.balance >= 0 ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  R$ {mockData.balance.toLocaleString('pt-BR')}
                </p>
              </div>
            </Card>
          </div>

          {/* Gráfico e Lista de Transações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text dark:text-text-dark mb-4">
                  Despesas por Categoria
                </h3>
                <div className="h-80">
                  <PieChart data={mockData.expensesByCategory} />
                </div>
              </div>
            </Card>

            <Card className="border-border dark:border-border-dark">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text dark:text-text-dark mb-4">
                  Últimas Transações
                </h3>
                <TransactionList transactions={mockData.recentTransactions} />
              </div>
            </Card>
          </div>
        </div>
      </PullToRefresh>
    </ViewDefault>
  );
}
