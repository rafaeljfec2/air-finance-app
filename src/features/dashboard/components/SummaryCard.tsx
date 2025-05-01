import { formatCurrency } from '../../../utils/formatters';

interface SummaryCardProps {
  titulo: string;
  valor: number;
  tipo: 'receita' | 'despesa' | 'saldo';
}

export function SummaryCard({ titulo, valor, tipo }: SummaryCardProps) {
  const getColor = () => {
    switch (tipo) {
      case 'receita':
        return 'text-green-600 dark:text-green-400';
      case 'despesa':
        return 'text-red-600 dark:text-red-400';
      case 'saldo':
        return 'text-primary-600 dark:text-primary-400';
    }
  };

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{titulo}</h3>
      <p className={`mt-2 text-3xl font-semibold ${getColor()}`}>{formatCurrency(valor)}</p>
    </div>
  );
}
