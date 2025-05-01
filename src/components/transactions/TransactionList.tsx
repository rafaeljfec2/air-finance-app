import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-background dark:bg-background-dark rounded-lg"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-text dark:text-text-dark">
              {transaction.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                'text-sm font-medium',
                transaction.amount >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {transaction.amount >= 0 ? '+' : ''}
              {transaction.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(transaction.date), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
