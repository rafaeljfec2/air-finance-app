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
        <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {transaction.amount < 0 ? 'Compra' : 'Crédito'}: {formatDateHeader(transaction.date)}
          </p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-900 px-4 py-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <Receipt className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {transaction.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatDate(transaction.date)}</p>
        </div>

        <div className="flex-shrink-0">
          {transaction.amount < 0 ? (
            <p className="text-sm font-bold text-green-600 dark:text-green-400">
              {formatCurrency(Math.abs(transaction.amount))}
            </p>
          ) : (
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              -{formatCurrency(transaction.amount)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
