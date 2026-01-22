import { formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { getAccountsSummary } from '@/services/accountService';
import { BankIcon } from '@/components/bank/BankIcon';
import { hasBankLogo } from '@/utils/bankIcons';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface AccountBalancesCardProps {
  companyId: string;
}

export function AccountBalancesCard({ companyId }: Readonly<AccountBalancesCardProps>) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['accounts-summary', companyId],
    queryFn: () => getAccountsSummary(companyId),
    enabled: !!companyId,
  });

  const accounts = data?.accounts ?? [];
  const totalBalance = data?.totalBalance ?? 0;

  return (
    <Card className="border-border dark:border-border-dark">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-text dark:text-text-dark">Saldo das Contas</h3>
          <Link
            to="/accounts"
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Adicionar
          </Link>
        </div>

        {isLoading && (
          <div className="flex h-32 items-center justify-center">
            <Spinner size="md" className="text-emerald-500" />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-red-500">Erro ao carregar saldos.</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-2">
            {/* Total Balance - Compact */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
                <span
                  className={`text-base font-bold ${
                    totalBalance >= 0
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatCurrency(totalBalance)}
                </span>
              </div>
            </div>

            {/* Accounts List - Compact */}
            {accounts.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
                Nenhuma conta cadastrada
              </div>
            ) : (
              <div className="space-y-1.5">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-md flex items-center justify-center shrink-0 overflow-hidden',
                        hasBankLogo(account.bankCode, account.institution) ? '' : 'p-1',
                      )}
                      style={
                        hasBankLogo(account.bankCode, account.institution)
                          ? undefined
                          : { backgroundColor: account.color }
                      }
                    >
                      <BankIcon
                        bankCode={account.bankCode}
                        institution={account.institution}
                        iconName={account.icon}
                        size="sm"
                        fillContainer={hasBankLogo(account.bankCode, account.institution)}
                        className={
                          hasBankLogo(account.bankCode, account.institution)
                            ? 'p-0.5'
                            : 'text-white'
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-gray-900 dark:text-white truncate">
                        {account.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {account.institution}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold ${
                          account.balance < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
