import { Check } from 'lucide-react';
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

  return (
    <div className="bg-card dark:bg-card-dark px-4 py-4 border-b border-border dark:border-border-dark">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-text/60 dark:text-text-dark/60 mb-1">Vencimento</p>
          <p className="text-sm font-medium text-text dark:text-text-dark">
            {formatDate(dueDate)}
          </p>
        </div>

        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            {status === 'CLOSED' || status === 'PAID' ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-600" />
            ) : null}
            <p className="text-xs text-text/60 dark:text-text-dark/60">{getStatusText()}</p>
          </div>
          <p className="text-lg font-bold text-text dark:text-text-dark">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
