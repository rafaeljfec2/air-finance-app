import { BadgeStatus } from '@/components/budget';
import { Spinner } from '@/components/ui/spinner';
import type { Receivable } from '@/types/budget';

interface ReceivablesSectionProps {
  receivables: Receivable[];
  isLoading: boolean;
}

export function ReceivablesSection({
  receivables,
  isLoading,
}: Readonly<ReceivablesSectionProps>) {
  // Calculate total
  const total = receivables.reduce((sum, r) => sum + r.value, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" className="text-amber-500" />
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left text-gray-400 w-[45%]">Descrição</th>
          <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
          <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
        {receivables.map((r) => (
          <tr key={r.id}>
            <td className="px-3 py-2 text-left text-text dark:text-text-dark">
              {r.description}
            </td>
            <td className="px-3 py-2 text-right font-medium whitespace-nowrap text-white dark:text-white">
              R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-3 py-2 text-center">
              <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
              </BadgeStatus>
            </td>
          </tr>
        ))}
        {receivables.length === 0 && (
          <tr>
            <td
              className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
              colSpan={3}
            >
              Nenhuma conta a receber neste período.
            </td>
          </tr>
        )}
        {receivables.length > 0 && (
          <tr className="border-t-2 border-border dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
            <td className="px-3 py-3 text-left font-semibold text-text dark:text-text-dark">
              Total
            </td>
            <td className="px-3 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-3 py-3 text-center"></td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

