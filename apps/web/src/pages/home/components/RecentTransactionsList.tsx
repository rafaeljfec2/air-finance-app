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
      <div className="px-4 flex-1 md:px-0 md:col-span-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Últimas Transações</h2>
          <Link
            to="/transactions"
            className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Ver todas
          </Link>
        </div>
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          Nenhuma transação recente.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex-1 md:px-0 md:col-span-1">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Últimas Transações</h2>
        <Link
          to="/transactions"
          className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <div className="space-y-2">
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
    <div className="bg-white dark:bg-card-dark p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-3">
      <div className={`p-1.5 rounded-full ${iconBgClass} flex-shrink-0`}>
        <ArrowRightLeft size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-gray-900 dark:text-white truncate mb-1">{tx.description}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {format(new Date(tx.paymentDate), "d 'de' MMM", { locale: ptBR })}
          </p>
          {tx.accountName && tx.accountId && (
            <Link
              to={`/transactions?accountId=${tx.accountId}`}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex-shrink-0 whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {tx.accountName}
            </Link>
          )}
        </div>
      </div>
      <span className={`text-sm font-bold ${valueColorClass} flex-shrink-0`}>
        {isRevenue ? '+' : '-'}
        {formatCurrency(Math.abs(tx.value))}
      </span>
    </div>
  );
}
