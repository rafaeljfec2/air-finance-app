import { PierreAccount } from '@/services/bankingIntegrationService';
import { CreditCard, Landmark, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PierreAccountListProps {
  accounts: PierreAccount[];
  selectedAccountIds: string[];
  onToggleAccount: (accountId: string) => void;
  onSelectAll: () => void;
}

export function PierreAccountList({
  accounts,
  selectedAccountIds,
  onToggleAccount,
  onSelectAll,
}: Readonly<PierreAccountListProps>) {
  const isAllSelected = selectedAccountIds.length === accounts.length && accounts.length > 0;

  const getAccountIcon = (account: PierreAccount) => {
    if (account.type === 'CREDIT') {
      return <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    }
    return <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
  };

  const getAccountTypeLabel = (account: PierreAccount) => {
    if (account.type === 'CREDIT') {
      return 'Cartão de Crédito';
    }
    if (account.subtype === 'CHECKING_ACCOUNT') {
      return 'Conta Corrente';
    }
    if (account.subtype === 'SAVINGS_ACCOUNT') {
      return 'Conta Poupança';
    }
    return 'Conta Bancária';
  };

  const formatBalance = (balance: string) => {
    const value = Number.parseFloat(balance || '0');
    return formatCurrency(value);
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark">
        <Landmark className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          Nenhuma conta encontrada no Pierre Finance
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Select All */}
      <div className="flex items-center gap-2.5 p-2.5 bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark">
        <button
          type="button"
          onClick={onSelectAll}
          className="flex items-center gap-2 text-xs font-medium text-text dark:text-text-dark hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              isAllSelected
                ? 'bg-primary-500 border-primary-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
            }`}
          >
            {isAllSelected && <Check className="h-2.5 w-2.5 text-white" />}
          </div>
          {isAllSelected ? 'Desselecionar Todas' : 'Selecionar Todas'}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({selectedAccountIds.length} de {accounts.length})
        </span>
      </div>

      {/* Account List */}
      <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(156 163 175) transparent'
        }}
      >
        {accounts.map((account) => {
          const isSelected = selectedAccountIds.includes(account.id);

          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onToggleAccount(account.id)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-border dark:border-border-dark bg-card dark:bg-card-dark hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Checkbox */}
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </div>

                {/* Icon */}
                <div className="shrink-0 mt-0.5">{getAccountIcon(account)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm text-text dark:text-text-dark truncate">
                        {account.name || account.marketingName || 'Conta sem nome'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {getAccountTypeLabel(account)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${
                        Number.parseFloat(account.balance) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatBalance(account.balance)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span>Nº {account.number}</span>
                    <span>•</span>
                    <span className="truncate">{account.owner}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
