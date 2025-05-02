import { useQuery } from '@tanstack/react-query';
import { Dashboard } from '@/types';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { TransactionList } from '@/components/transactions/TransactionList';

async function fetchDashboardData(): Promise<Dashboard> {
  // TODO: Implement real API call
  return {
    balance: 5000,
    income: 8000,
    expenses: 3000,
    transactions: [
      {
        id: '1',
        description: 'Salary',
        amount: 5000,
        type: 'INCOME',
        category: {
          id: '1',
          name: 'Salary',
          type: 'INCOME',
          color: '#10B981',
          icon: '💼'
        },
        date: new Date().toISOString(),
        categoryId: '',
        accountId: '',
        account: {
          id: '',
          name: '',
          balance: 0,
          createdAt: '',
          updatedAt: ''
        },
        createdAt: '',
        updatedAt: ''
      },
      {
        id: '2',
        description: 'Rent',
        amount: 1500,
        type: 'EXPENSE',
        category: {
          id: '4',
          name: 'Housing',
          type: 'EXPENSE',
          color: '#EF4444',
          icon: '🏠'
        },
        date: new Date().toISOString(),
        categoryId: '',
        accountId: '',
        account: {
          id: '',
          name: '',
          balance: 0,
          createdAt: '',
          updatedAt: ''
        },
        createdAt: '',
        updatedAt: ''
      }
    ]
  };
}

export function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery<Dashboard>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dashboard) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total Balance" value={dashboard.balance} type="balance" />
        <SummaryCard title="Monthly Income" value={dashboard.income} type="income" />
        <SummaryCard title="Monthly Expenses" value={dashboard.expenses} type="expense" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
        </div>
        <div className="p-4">
          <TransactionList transactions={dashboard.transactions} />
        </div>
      </div>
    </div>
  );
}
