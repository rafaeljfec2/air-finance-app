import { formatCurrency } from '@/utils/formatters';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AccountSummaryItem } from '@/services/accountService';
import { BankIcon } from '@/components/bank/BankIcon';
import { hasBankLogo } from '@/utils/bankIcons';
import { cn } from '@/lib/utils';

interface BankAccountsSectionProps {
  accounts: AccountSummaryItem[];
  totalBalance: number;
  isPrivacyModeEnabled: boolean;
}

const accountTypeLabels: Record<string, string> = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  digital_wallet: 'Carteira Digital',
  investment: 'Investimento',
  credit_card: 'Cartão de Crédito',
};

export function BankAccountsSection({
  accounts,
  totalBalance,
  isPrivacyModeEnabled,
}: Readonly<BankAccountsSectionProps>) {
  const displayAccounts = accounts;
  const hasMore = false;

  return (
    <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contas Bancárias</h3>
        <Link
          to="/accounts"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1"
        >
          <Plus size={16} />
          Adicionar conta
        </Link>
      </div>

      {/* Total Balance Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total em contas</span>
          <span
            className={`text-xl font-bold ${
              totalBalance >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPrivacyModeEnabled ? 'R$ •••••' : formatCurrency(totalBalance)}
          </span>
        </div>
      </div>

      {displayAccounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhuma conta cadastrada
        </div>
      ) : (
        <div className="space-y-3">
          {displayAccounts.map((account) => {
            return (
              <Link
                key={account.id}
                to={`/accounts/${account.id}/details`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden',
                    !hasBankLogo(account.bankCode, account.institution) && 'p-1.5',
                  )}
                  style={
                    !hasBankLogo(account.bankCode, account.institution)
                      ? { backgroundColor: account.color }
                      : undefined
                  }
                >
                  <BankIcon
                    bankCode={account.bankCode}
                    institution={account.institution}
                    iconName={account.icon}
                    size="md"
                    fillContainer={hasBankLogo(account.bankCode, account.institution)}
                    className={
                      hasBankLogo(account.bankCode, account.institution) ? 'p-1' : 'text-white'
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {account.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {account.institution} • {accountTypeLabels[account.type] ?? account.type}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saldo atual</p>
                  <span
                    className={`text-sm font-bold ${
                      account.balance >= 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isPrivacyModeEnabled ? 'R$ •••' : formatCurrency(account.balance)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {hasMore && (
        <Link
          to="/accounts"
          className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium mt-4"
        >
          Ver mais
        </Link>
      )}
    </div>
  );
}
