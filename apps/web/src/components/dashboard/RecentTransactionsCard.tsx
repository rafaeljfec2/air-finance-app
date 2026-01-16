import { TransactionList } from '@/components/transactions/TransactionList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useDashboardRecentTransactions } from '@/hooks/useDashboard';
import type { Transaction as ApiTransaction } from '@/services/transactionService';
import type { DashboardFilters } from '@/types/dashboard';
import type { Transaction as UiTransaction } from '@/types/transaction';

interface RecentTransactionsCardProps {
  companyId: string;
  filters: DashboardFilters;
  limit?: number;
  onViewAll?: () => void;
}

function mapToUiTransactions(
  transactions: ApiTransaction[] | undefined,
  categories: ReturnType<typeof useCategories>['categories'],
  accounts: ReturnType<typeof useAccounts>['accounts'],
): UiTransaction[] {
  if (!transactions || !categories || !accounts) return [];

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  return transactions
    .map<UiTransaction | null>((tx) => {
      const category = categoryMap.get(tx.categoryId);
      const account = accountMap.get(tx.accountId);

      if (!category || !account) {
        return null;
      }

      const type = tx.launchType === 'revenue' ? 'INCOME' : 'EXPENSE';

      return {
        id: tx.id,
        description: tx.description,
        amount: tx.value,
        type,
        date: tx.paymentDate,
        categoryId: tx.categoryId,
        accountId: tx.accountId,
        note: tx.observation,
        attachments: [],
        category: {
          id: category.id,
          name: category.name,
          type: category.type === 'income' ? 'INCOME' : 'EXPENSE',
          color: category.color,
          icon: category.icon,
        },
        account: {
          id: account.id,
          name: account.name,
          balance: account.balance,
          initialBalance: account.initialBalance,
          initialBalanceDate: account.initialBalanceDate,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        },
        credit: type === 'INCOME' ? tx.value : 0,
        debit: type === 'EXPENSE' ? tx.value : 0,
        balance: undefined,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        dependent: undefined,
        installmentCount: tx.quantityInstallments,
        companyId: tx.companyId,
      };
    })
    .filter((tx): tx is UiTransaction => tx !== null);
}

export function RecentTransactionsCard({
  companyId,
  filters,
  limit = 10,
  onViewAll,
}: Readonly<RecentTransactionsCardProps>) {
  const { categories } = useCategories(companyId);
  const { accounts } = useAccounts();
  const { data, isLoading, error } = useDashboardRecentTransactions(companyId, filters, limit);

  const uiTransactions = mapToUiTransactions(data, categories, accounts);

  return (
    <Card className="border-border dark:border-border-dark">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text dark:text-text-dark">Transações Recentes</h3>
          {onViewAll && (
            <Button variant="outline" size="sm" onClick={onViewAll}>
              Ver todas
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-24">
            <Spinner size="lg" className="text-emerald-500" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-500">Erro ao carregar transações recentes.</p>
        )}

        {!isLoading && !error && uiTransactions.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada no período selecionado.
          </p>
        )}

        {!isLoading && !error && uiTransactions.length > 0 && (
          <TransactionList transactions={uiTransactions} />
        )}
      </div>
    </Card>
  );
}
