import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { Transacao } from '../../../types';

interface TransactionListProps {
  transacoes: Transacao[];
}

export function TransactionList({ transacoes }: TransactionListProps) {
  if (transacoes.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {transacoes.map(transacao => (
            <tr key={transacao.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {transacao.descricao}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {transacao.categoria}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(transacao.data)}
              </td>
              <td
                className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${
                  transacao.tipo === 'RECEITA'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {transacao.tipo === 'RECEITA' ? '+' : '-'}
                {formatCurrency(transacao.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
