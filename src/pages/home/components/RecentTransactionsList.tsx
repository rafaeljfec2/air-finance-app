import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Transaction } from '@/services/transactionService';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export function RecentTransactionsList({
  transactions,
}: Readonly<RecentTransactionsListProps>) {
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

      <div className="space-y-3">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </div>
    </div>
  );
}

interface TransactionItemProps {
  transaction: Transaction;
}

function TransactionItem({ transaction: tx }: Readonly<TransactionItemProps>) {
  const isRevenue = tx.launchType === 'revenue';
  const iconBgClass = isRevenue
    ? 'bg-emerald-100 text-emerald-600'
    : 'bg-red-100 text-red-600';
  const valueColorClass = isRevenue ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${iconBgClass}`}>
          <ArrowRightLeft size={16} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
            {tx.description}
          </h3>
          <p className="text-xs text-gray-500">
            {format(new Date(tx.paymentDate), "d 'de' MMM", { locale: ptBR })}
          </p>
        </div>
      </div>
      <span className={`font-semibold ${valueColorClass}`}>
        {isRevenue ? '+' : '-'}
        {formatCurrency(Math.abs(tx.value))}
      </span>
    </div>
  );
}
