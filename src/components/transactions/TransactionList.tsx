import { Transaction as TransactionType } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: TransactionType[];
}

export function TransactionList({ transactions }: Readonly<TransactionListProps>) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === 'INCOME';
        const formattedDate = format(new Date(transaction.date), 'dd MMM yyyy', { locale: ptBR });

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-full ${
                  isIncome ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                }`}
              >
                {isIncome ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.category.name} • {formattedDate}
                </p>
              </div>
            </div>
            <span
              className={`font-medium ${
                isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(Math.abs(transaction.amount))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
