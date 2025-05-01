import { formatCurrency } from '../../../utils/formatters';
import { Card } from '@/components/ui/card';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

interface SummaryCardProps {
  titulo: string;
  valor: number;
  tipo: 'receita' | 'despesa' | 'saldo';
}

export function SummaryCard({ titulo, valor, tipo }: SummaryCardProps) {
  const getColor = () => {
    switch (tipo) {
      case 'receita':
        return 'text-green-400';
      case 'despesa':
        return 'text-red-400';
      case 'saldo':
        return 'text-blue-400';
    }
  };

  const getIcon = () => {
    switch (tipo) {
      case 'receita':
        return <ArrowUpCircle className="h-6 w-6 text-green-400" />;
      case 'despesa':
        return <ArrowDownCircle className="h-6 w-6 text-red-400" />;
      case 'saldo':
        return <Wallet className="h-6 w-6 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (tipo) {
      case 'receita':
        return 'bg-green-500/10';
      case 'despesa':
        return 'bg-red-500/10';
      case 'saldo':
        return 'bg-blue-500/10';
    }
  };

  return (
    <Card className={`${getBgColor()} border-gray-700 transition-all hover:scale-[1.02]`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">{titulo}</h3>
          {getIcon()}
        </div>
        <p className={`text-3xl font-semibold ${getColor()}`}>
          {formatCurrency(valor)}
        </p>
      </div>
    </Card>
  );
}
