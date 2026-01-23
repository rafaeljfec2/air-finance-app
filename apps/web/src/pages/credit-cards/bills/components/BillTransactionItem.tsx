import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Receipt } from 'lucide-react';

interface BillTransactionItemProps {
  transaction: {
    id: string;
    date: string;
    description: string;
    amount: number;
    category?: string;
  };
  showDateHeader: boolean;
}

export function BillTransactionItem({
  transaction,
  showDateHeader,
}: Readonly<BillTransactionItemProps>) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatDateHeader = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <>
      {showDateHeader && (
        <div className="bg-background dark:bg-background-dark px-4 py-2 border-b border-border dark:border-border-dark">
          <p className="text-xs font-medium text-text/70 dark:text-text-dark/70 capitalize">
            Compra: {formatDateHeader(transaction.date)}
          </p>
        </div>
      )}
      <div className="bg-card dark:bg-card-dark px-4 py-3 border-b border-border dark:border-border-dark flex items-center gap-3">
        <div className="w-10 h-10 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg flex items-center justify-center flex-shrink-0">
          <Receipt className="h-5 w-5 text-text/60 dark:text-text-dark/60" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text dark:text-text-dark truncate">
            {transaction.description}
          </p>
          <p className="text-xs text-text/60 dark:text-text-dark/60">{formatDate(transaction.date)}</p>
        </div>

        <div className="flex-shrink-0">
          <p className="text-sm font-semibold text-green-600 dark:text-green-600">
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      </div>
    </>
  );
}
