import { BadgeStatus } from '@/components/budget';
import {
  EmptyState,
  GroupContainer,
  GroupHeader,
  SectionLoader,
  SectionTable,
  TotalFooter,
  type TableColumn,
} from '@/components/budget/shared';
import type { Receivable } from '@/types/budget';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';
import { isFinishingInstallment } from '@/utils/installment.utils';
import { useMemo } from 'react';

interface ReceivablesSectionProps {
  readonly receivables: Receivable[];
  readonly isLoading: boolean;
}

const TABLE_COLUMNS: TableColumn[] = [
  { key: 'dueDate', label: 'Vencimento', width: 'w-[15%]', align: 'left' },
  { key: 'description', label: 'Descrição', width: 'w-[35%]', align: 'left' },
  { key: 'status', label: 'Status', width: 'w-[25%]', align: 'center' },
  { key: 'value', label: 'Valor', width: 'w-[25%]', align: 'right' },
];

function sortByDueDate(a: Receivable, b: Receivable): number {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

function calculateTotal(items: Receivable[]): number {
  return items.reduce((sum, item) => sum + item.value, 0);
}

export function ReceivablesSection({ receivables, isLoading }: ReceivablesSectionProps) {
  const { finishingReceivables, otherReceivables, total } = useMemo(() => {
    const finishing: Receivable[] = [];
    const other: Receivable[] = [];

    receivables.forEach((r) => {
      if (isFinishingInstallment(r.description)) {
        finishing.push(r);
      } else {
        other.push(r);
      }
    });

    finishing.sort(sortByDueDate);
    other.sort(sortByDueDate);

    return {
      finishingReceivables: finishing,
      otherReceivables: other,
      total: calculateTotal(receivables),
    };
  }, [receivables]);

  const renderCell = (item: Receivable, column: TableColumn) => {
    switch (column.key) {
      case 'dueDate':
        return (
          <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatDate(item.dueDate)}
          </span>
        );
      case 'description':
        return (
          <span className="text-text dark:text-text-dark truncate block max-w-[200px]">
            {item.description}
          </span>
        );
      case 'status':
        return (
          <BadgeStatus status={item.status === 'RECEIVED' ? 'success' : 'warning'}>
            {item.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
          </BadgeStatus>
        );
      case 'value':
        return (
          <span className="font-medium whitespace-nowrap text-white dark:text-white">
            {formatCurrency(item.value)}
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <SectionLoader color="amber" />;
  }

  if (receivables.length === 0) {
    return <EmptyState message="Nenhuma conta a receber neste período." />;
  }

  return (
    <div className="space-y-6">
      {finishingReceivables.length > 0 && (
        <div>
          <GroupHeader
            title="Parcelas Finalizando"
            count={finishingReceivables.length}
            total={calculateTotal(finishingReceivables)}
            color="emerald"
          />
          <GroupContainer color="emerald">
            <SectionTable
              columns={TABLE_COLUMNS}
              data={finishingReceivables}
              keyExtractor={(item) => item.id}
              renderCell={renderCell}
            />
          </GroupContainer>
        </div>
      )}

      {otherReceivables.length > 0 && (
        <div>
          <GroupHeader
            title="Outras Receitas"
            count={otherReceivables.length}
            total={calculateTotal(otherReceivables)}
            color="amber"
          />
          <GroupContainer color="amber">
            <SectionTable
              columns={TABLE_COLUMNS}
              data={otherReceivables}
              keyExtractor={(item) => item.id}
              renderCell={renderCell}
            />
          </GroupContainer>
        </div>
      )}

      <TotalFooter total={total} color="emerald" />
    </div>
  );
}
