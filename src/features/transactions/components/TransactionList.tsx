import { Transaction } from '@/types';
import { formatDateTime } from '@/utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-2 h-2 rounded-full ${
                transaction.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(transaction.date, 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${
                transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {transaction.type === 'INCOME' ? '+' : '-'}
              {transaction.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.category.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
