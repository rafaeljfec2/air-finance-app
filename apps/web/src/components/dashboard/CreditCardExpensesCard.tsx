import { Card } from '@/components/ui/card';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import type { DashboardFilters } from '@/types/dashboard';
import { formatDateToLocalISO } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { CreditCard } from 'lucide-react';
import { useMemo } from 'react';

interface CreditCardExpensesCardProps {
  companyId: string;
  filters: DashboardFilters;
}

export function CreditCardExpensesCard({
  companyId,
  filters,
}: Readonly<CreditCardExpensesCardProps>) {
  const { accounts } = useAccounts();

  const creditCardAccounts = useMemo(() => {
    return accounts?.filter((acc) => acc.type === 'credit_card') ?? [];
  }, [accounts]);

  const dateRange = useMemo(() => {
    const now = new Date();
    let start = now;
    let end = now;

    switch (filters.timeRange) {
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
        end = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }

    return {
      startDate: formatDateToLocalISO(start),
      endDate: formatDateToLocalISO(end),
    };
  }, [filters.timeRange]);

  const { transactions, isLoading } = useTransactions(companyId, {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const cardStats = useMemo(() => {
    if (!transactions || !creditCardAccounts.length) return [];

    const stats = creditCardAccounts.map((account) => {
      const accountTransactions = transactions.filter(
        (tx) => tx.accountId === account.id && tx.launchType === 'expense',
      );

      const total = accountTransactions.reduce((sum, tx) => sum + Math.abs(tx.value), 0);

      return {
        id: account.id,
        name: account.name,
        color: account.color,
        icon: account.icon,
        total,
        count: accountTransactions.length,
      };
    });

    return stats.filter((stat) => stat.total > 0).sort((a, b) => b.total - a.total);
  }, [transactions, creditCardAccounts]);

  const totalCreditCardExpenses = cardStats.reduce((sum, stat) => sum + stat.total, 0);

  if (!creditCardAccounts.length) {
    return null;
  }

  return (
    <Card className="col-span-1 bg-card dark:bg-card-dark border-border dark:border-border-dark shadow-sm h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4">
          <h3 className="text-sm font-medium text-text dark:text-text-dark">
            Gastos com Cartão de Crédito
          </h3>
          <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>

        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-gray-500">
            Carregando...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-text dark:text-text-dark">
              {formatCurrency(totalCreditCardExpenses)}
            </div>

            {cardStats.length > 0 ? (
              <div className="space-y-3">
                {cardStats.map((stat) => {
                  const percentage =
                    totalCreditCardExpenses > 0 ? (stat.total / totalCreditCardExpenses) * 100 : 0;

                  return (
                    <div key={stat.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: stat.color }}
                          />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {stat.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(stat.total)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: stat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nenhum gasto com cartão encontrado neste período.
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
