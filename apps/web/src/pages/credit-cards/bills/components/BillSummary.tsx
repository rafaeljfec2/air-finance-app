import { Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BillSummaryProps {
  dueDate: string;
  status: 'OPEN' | 'CLOSED' | 'PAID';
  total: number;
}

export function BillSummary({ dueDate, status, total }: Readonly<BillSummaryProps>) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    // Parse a data diretamente sem problemas de timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getStatusText = () => {
    switch (status) {
      case 'OPEN':
        return 'Aberta';
      case 'CLOSED':
        return 'Fechada';
      case 'PAID':
        return 'Paga';
      default:
        return 'Aberta';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'OPEN':
        return 'text-orange-600 dark:text-orange-400';
      case 'CLOSED':
        return 'text-green-600 dark:text-green-400';
      case 'PAID':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-orange-600 dark:text-orange-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Vencimento
            </p>
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {formatDate(dueDate)}
          </p>
        </div>

        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            {status === 'CLOSED' || status === 'PAID' ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : null}
            <span className={`text-xs font-semibold uppercase tracking-wide ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
