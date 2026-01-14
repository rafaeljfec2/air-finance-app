import { CreditCardTableRow } from '@/components/credit-cards/CreditCardTableRow';
import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn } from '@/components/ui/SortableColumn';
import { SortConfig } from '@/components/ui/SortableColumn';
import { CreditCard } from '@/services/creditCardService';
import { CreditCardCard } from './CreditCardCard';

interface CreditCardsListProps {
  creditCards: CreditCard[];
  viewMode: 'grid' | 'list';
  sortConfig: SortConfig<'name' | 'limit' | 'closingDay' | 'dueDay' | 'icon'> | null;
  onSort: (field: 'name' | 'limit' | 'closingDay' | 'dueDay' | 'icon') => void;
  onEdit: (creditCard: CreditCard) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function CreditCardsList({
  creditCards,
  viewMode,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<CreditCardsListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {creditCards.map((card) => (
          <CreditCardCard
            key={card.id}
            creditCard={card}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
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
              <SortableColumn field="name" currentSort={sortConfig} onSort={onSort}>
                Cartão
              </SortableColumn>
              <SortableColumn field="limit" currentSort={sortConfig} onSort={onSort}>
                Limite
              </SortableColumn>
              <SortableColumn field="closingDay" currentSort={sortConfig} onSort={onSort}>
                Fechamento
              </SortableColumn>
              <SortableColumn field="dueDay" currentSort={sortConfig} onSort={onSort}>
                Vencimento
              </SortableColumn>
              <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {creditCards.map((card) => (
              <CreditCardTableRow
                key={card.id}
                creditCard={card}
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
