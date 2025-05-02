import { Transacao, Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: (Transacao | Transaction)[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatTransaction = (transaction: Transacao | Transaction) => {
    if ('descricao' in transaction) {
      // É uma Transacao
      return {
        id: transaction.id,
        description: transaction.descricao,
        amount: transaction.valor,
        category: transaction.categoria,
        date: transaction.data,
        type: transaction.tipo
      };
    } else {
      // É uma Transaction
      return {
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        type: transaction.amount > 0 ? 'RECEITA' : 'DESPESA'
      };
    }
  };

  return (
    <div className="space-y-4">
      {transactions.map(transaction => {
        const {
          id,
          description,
          amount,
          category,
          date,
          type
        } = formatTransaction(transaction);

        return (
          <div
            key={id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                type === 'RECEITA' 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {type === 'RECEITA' ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {description}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category} • {format(new Date(date), 'dd MMM yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
            <span className={`font-medium ${
              type === 'RECEITA'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {type === 'RECEITA' ? '+' : '-'}{formatCurrency(Math.abs(amount))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
