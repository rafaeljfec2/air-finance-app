import { AccountTableRow } from '@/components/accounts/AccountTableRow';
import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn , SortConfig } from '@/components/ui/SortableColumn';
import { Account } from '@/services/accountService';
import { AccountCard } from './AccountCard';
import { AccountListItem } from './AccountListItem';

interface AccountsListProps {
  accounts: Account[];
  viewMode: 'grid' | 'list';
  sortConfig: SortConfig<'name' | 'type' | 'institution' | 'agency' | 'accountNumber' | 'balance'> | null;
  onSort: (field: 'name' | 'type' | 'institution' | 'agency' | 'accountNumber' | 'balance') => void;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onConfigureIntegration?: (account: Account) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function AccountsList({
  accounts,
  viewMode,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onConfigureIntegration,
  isUpdating,
  isDeleting,
}: Readonly<AccountsListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={onEdit}
            onDelete={onDelete}
            onConfigureIntegration={onConfigureIntegration}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </RecordsGrid>
    );
  }

  return (
    <>
      {/* Desktop: Table view */}
      <Card className="hidden md:block bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border-dark">
                <SortableColumn field="name" currentSort={sortConfig} onSort={onSort}>
                  Conta
                </SortableColumn>
                <SortableColumn field="institution" currentSort={sortConfig} onSort={onSort}>
                  Instituição
                </SortableColumn>
                <SortableColumn field="agency" currentSort={sortConfig} onSort={onSort}>
                  Detalhes
                </SortableColumn>
                <SortableColumn field="balance" currentSort={sortConfig} onSort={onSort}>
                  Saldo
                </SortableColumn>
                <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <AccountTableRow
                  key={account.id}
                  account={account}
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

      {/* Mobile: List view */}
      <div className="md:hidden space-y-1">
        {accounts.map((account) => (
          <AccountListItem
            key={account.id}
            account={account}
            onEdit={onEdit}
            onDelete={onDelete}
            onConfigureIntegration={onConfigureIntegration}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </>
  );
}
