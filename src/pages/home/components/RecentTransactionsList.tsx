import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Transaction } from '@/services/transactionService';

interface TransactionWithAccount extends Transaction {
  accountName?: string;
}

interface RecentTransactionsListProps {
  transactions: TransactionWithAccount[];
}

export function RecentTransactionsList({ transactions }: Readonly<RecentTransactionsListProps>) {
  if (transactions.length === 0) {
    return (
      <div className="px-6 flex-1 md:px-0 md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Últimas Transações
          </h2>
          <Link
            to="/transactions"
            className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Ver todas
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhuma transação recente.
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 flex-1 md:px-0 md:col-span-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Últimas Transações</h2>
        <Link
          to="/transactions"
          className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </div>
    </div>
  );
}

interface TransactionItemProps {
  transaction: TransactionWithAccount;
}

function TransactionItem({ transaction: tx }: Readonly<TransactionItemProps>) {
  const isRevenue = tx.launchType === 'revenue';
  const iconBgClass = isRevenue
    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
  const valueColorClass = isRevenue
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-2 rounded-full ${iconBgClass} flex-shrink-0`}>
          <ArrowRightLeft size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 flex-1">
              {tx.description}
            </h3>
            {tx.accountName && tx.accountId && (
              <Link
                to={`/transactions?accountId=${tx.accountId}`}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {tx.accountName}
              </Link>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(tx.paymentDate), "d 'de' MMM", { locale: ptBR })}
          </p>
        </div>
      </div>
      <span className={`font-semibold ${valueColorClass} ml-3 flex-shrink-0`}>
        {isRevenue ? '+' : '-'}
        {formatCurrency(Math.abs(tx.value))}
      </span>
    </div>
  );
}
