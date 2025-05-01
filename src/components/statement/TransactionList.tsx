import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { ArrowPathIcon, InboxIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onRemove: (id: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function TransactionList({ 
  transactions, 
  onEdit, 
  onRemove, 
  onRefresh,
  isLoading = false 
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <InboxIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma transação encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          Não encontramos nenhuma transação com os filtros atuais.
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Atualizar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Pull to refresh indicator */}
      {isLoading && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm z-10">
          <ArrowPathIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Descrição
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Data
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Valor
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {transactions.map(transaction => (
                <tr 
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.descricao}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.categoria.nome}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {transaction.categoria.nome}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(transaction.data, 'dd/MM/yyyy')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(transaction.data, 'HH:mm')}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${
                      transaction.tipo === 'RECEITA'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.tipo === 'RECEITA' ? '+' : '-'}
                    {formatCurrency(transaction.valor)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onRemove(transaction.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
