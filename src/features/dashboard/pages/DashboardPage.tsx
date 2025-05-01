import { SummaryCard } from '../components/SummaryCard';
import { TransactionList } from '../../transactions/components/TransactionList';
import { useQuery } from '@tanstack/react-query';
import { Dashboard } from '../../../types';

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
        <div className="text-gray-500 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard titulo="Saldo" valor={dashboard.saldo} tipo="saldo" />
        <SummaryCard titulo="Receitas" valor={dashboard.receitas} tipo="receita" />
        <SummaryCard titulo="Despesas" valor={dashboard.despesas} tipo="despesa" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Últimas transações</h2>
        <div className="mt-4">
          <TransactionList transacoes={dashboard.transacoes} />
        </div>
      </div>
    </div>
  );
}
