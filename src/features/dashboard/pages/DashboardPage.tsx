import { SummaryCard } from '../components/SummaryCard';
import { TransactionList } from '../../transactions/components/TransactionList';
import { useQuery } from '@tanstack/react-query';
import { Dashboard } from '../../../types';
import { Card } from '@/components/ui/card';

export function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery<Dashboard>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // TODO: Implementar chamada real à API
      // Simulação de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        saldo: 5000,
        receitas: 10000,
        despesas: 5000,
        transacoes: [
          {
            id: '1',
            descricao: 'Salário',
            valor: 10000,
            tipo: 'RECEITA',
            categoria: 'Salário',
            data: new Date().toISOString(),
            usuarioId: '1',
          },
          {
            id: '2',
            descricao: 'Aluguel',
            valor: 2000,
            tipo: 'DESPESA',
            categoria: 'Moradia',
            data: new Date().toISOString(),
            usuarioId: '1',
          },
        ],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400">
          <div className="animate-spin h-8 w-8 border-4 border-gray-600 border-t-gray-400 rounded-full mb-4 mx-auto" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral das suas finanças</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard titulo="Saldo Total" valor={dashboard.saldo} tipo="saldo" />
        <SummaryCard titulo="Receitas do Mês" valor={dashboard.receitas} tipo="receita" />
        <SummaryCard titulo="Despesas do Mês" valor={dashboard.despesas} tipo="despesa" />
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Últimas Transações</h2>
          <div className="rounded-lg overflow-hidden">
            <TransactionList transactions={dashboard.transacoes} />
          </div>
        </div>
      </Card>
    </div>
  );
}
