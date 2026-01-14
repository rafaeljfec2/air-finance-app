import { RecurringTransactionCard } from '@/components/recurring-transactions/RecurringTransactionCard';
import { RecurringTransactionTableRow } from '@/components/recurring-transactions/RecurringTransactionTableRow';
import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn } from '@/components/ui/SortableColumn';
import { SortConfig } from '@/components/ui/SortableColumn';
import { RecurringTransaction } from '@/services/recurringTransactionService';

interface RecurringTransactionsListProps {
  transactions: RecurringTransaction[];
  viewMode: 'grid' | 'list';
  sortConfig: SortConfig<'description' | 'value' | 'frequency' | 'startDate' | 'category' | 'account'> | null;
  onSort: (field: 'description' | 'value' | 'frequency' | 'startDate' | 'category' | 'account') => void;
  onEdit: (transaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function RecurringTransactionsList({
  transactions,
  viewMode,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<RecurringTransactionsListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {transactions.map((rt) => (
          <RecurringTransactionCard
            key={rt.id}
            recurringTransaction={rt}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            viewMode="grid"
          />
        ))}
      </RecordsGrid>
    );
  }

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-border-dark">
              <SortableColumn field="description" currentSort={sortConfig} onSort={onSort}>
                Descrição
              </SortableColumn>
              <SortableColumn field="value" currentSort={sortConfig} onSort={onSort}>
                Valor
              </SortableColumn>
              <SortableColumn field="frequency" currentSort={sortConfig} onSort={onSort}>
                Frequência
              </SortableColumn>
              <SortableColumn field="startDate" currentSort={sortConfig} onSort={onSort}>
                Data Início
              </SortableColumn>
              <SortableColumn field="category" currentSort={sortConfig} onSort={onSort}>
                Categoria
              </SortableColumn>
              <SortableColumn field="account" currentSort={sortConfig} onSort={onSort}>
                Conta
              </SortableColumn>
              <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((rt) => (
              <RecurringTransactionTableRow
                key={rt.id}
                recurringTransaction={rt}
                onEdit={onEdit}
                onDelete={onDelete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
