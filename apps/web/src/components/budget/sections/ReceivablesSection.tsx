import { BadgeStatus } from '@/components/budget';
import { Spinner } from '@/components/ui/spinner';
import type { Receivable } from '@/types/budget';
import { formatDate } from '@/utils/date';
import { useMemo } from 'react';

interface ReceivablesSectionProps {
  readonly receivables: Receivable[];
  readonly isLoading: boolean;
}

function extractInstallment(desc: string): { current: number; total: number } | null {
  const regex1 = /parcela\s+(\d+)\/(\d+)/i;
  const regex2 = /(?:^|\s|-)(\d+)\/(\d+)(?:\s|$)/;
  let match = regex1.exec(desc);
  if (!match) {
    match = regex2.exec(desc);
  }
  if (!match) return null;
  const current = Number.parseInt(match[1] ?? '0', 10);
  const total = Number.parseInt(match[2] ?? '0', 10);
  if (current <= 0 || total <= 0 || current > total) return null;
  return { current, total };
}

export function ReceivablesSection({ receivables, isLoading }: Readonly<ReceivablesSectionProps>) {
  const { finishingReceivables, otherReceivables, total } = useMemo(() => {
    const finishing: Receivable[] = [];
    const other: Receivable[] = [];

    receivables.forEach((r) => {
      const installment = extractInstallment(r.description);
      if (installment && installment.current === installment.total) {
        finishing.push(r);
      } else {
        other.push(r);
      }
    });

    const sortByDate = (a: Receivable, b: Receivable) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    finishing.sort(sortByDate);
    other.sort(sortByDate);

    return {
      finishingReceivables: finishing,
      otherReceivables: other,
      total: receivables.reduce((sum, r) => sum + r.value, 0),
    };
  }, [receivables]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" className="text-amber-500" />
      </div>
    );
  }

  if (receivables.length === 0) {
    return (
      <p className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
        Nenhuma conta a receber neste período.
      </p>
    );
  }

  const renderTable = (items: Receivable[]) => (
    <table className="w-full text-xs">
      <thead>
        <tr>
          <th className="px-2 py-1.5 text-left text-gray-400 w-[15%]">Vencimento</th>
          <th className="px-2 py-1.5 text-left text-gray-400 w-[35%]">Descrição</th>
          <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
          <th className="px-2 py-1.5 text-right text-gray-400 w-[25%]">Valor</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
        {items.map((r) => (
          <tr key={r.id}>
            <td className="px-2 py-1.5 text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {formatDate(r.dueDate)}
            </td>
            <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate max-w-[200px]">
              {r.description}
            </td>
            <td className="px-2 py-1.5 text-center">
              <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
              </BadgeStatus>
            </td>
            <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap text-white dark:text-white">
              R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6">
      {finishingReceivables.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Parcelas Finalizando ({finishingReceivables.length})
            </h4>
            <span className="text-xs text-gray-500 ml-auto">
              Total: R${' '}
              {finishingReceivables
                .reduce((acc, r) => acc + r.value, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
            {renderTable(finishingReceivables)}
          </div>
        </div>
      )}

      {otherReceivables.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Outras Receitas ({otherReceivables.length})
            </h4>
            <span className="text-xs text-gray-500 ml-auto">
              Total: R${' '}
              {otherReceivables
                .reduce((acc, r) => acc + r.value, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 overflow-hidden">
            {renderTable(otherReceivables)}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t-2 border-border dark:border-border-dark">
        <span className="font-semibold text-text dark:text-text-dark">Total Geral</span>
        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
