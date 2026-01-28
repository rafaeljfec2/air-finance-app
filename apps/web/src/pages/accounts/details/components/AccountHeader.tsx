import { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronDown,
  Banknote,
  Wallet,
  Landmark,
  Check,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Account } from '@/services/accountService';

interface AccountHeaderProps {
  readonly account: Account | null;
  readonly accounts: ReadonlyArray<Account>;
  readonly onBack: () => void;
  readonly onAccountSelect: (accountId: string) => void;
  readonly selectedAccountId: string;
}

const getAccountIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Wallet':
      return Wallet;
    case 'Landmark':
      return Landmark;
    case 'Banknote':
    default:
      return Banknote;
  }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatHiddenCurrency = (): string => {
  return 'R$ ••••••';
};

const formatBankInfo = (account: Account | null): string => {
  if (!account) return '';

  const parts: string[] = [];

  if (account.institution) {
    parts.push(account.institution);
  }

  if (account.agency) {
    parts.push(`Ag ${account.agency}`);
  }

  if (account.accountNumber) {
    parts.push(`Conta ${account.accountNumber}`);
  }

  return parts.join(' • ');
};

export function AccountHeader({
  account,
  accounts,
  onBack,
  onAccountSelect,
  selectedAccountId,
}: AccountHeaderProps) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const balance = account?.currentBalance ?? account?.initialBalance ?? 0;
  const AccountIcon = getAccountIcon(account?.icon);
  const bankInfo = formatBankInfo(account);
  const hasMultipleAccounts = accounts.length > 1;

  const handleAccountSelect = (accountId: string) => {
    onAccountSelect(accountId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-card dark:bg-card-dark border-b border-border dark:border-border-dark">
      <div className="px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-text dark:text-text-dark" />
          </button>

          {hasMultipleAccounts ? (
            <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {account && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: account.color ?? '#8A05BE' }}
                    >
                      <AccountIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-lg font-semibold text-text dark:text-text-dark">
                    {account?.name ?? 'Conta Bancária'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="start" sideOffset={8}>
                <div className="space-y-1">
                  {accounts.map((acc) => {
                    const Icon = getAccountIcon(acc.icon);
                    const isSelected = acc.id === selectedAccountId;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => handleAccountSelect(acc.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-primary-500/10 dark:bg-primary-500/20'
                            : 'hover:bg-background dark:hover:bg-background-dark'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: acc.color ?? '#8A05BE' }}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p
                            className={`text-sm truncate ${
                              isSelected
                                ? 'font-semibold text-primary-600 dark:text-primary-400'
                                : 'font-medium text-text dark:text-text-dark'
                            }`}
                          >
                            {acc.name}
                          </p>
                          {acc.institution && (
                            <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">
                              {acc.institution}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              {account && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: account.color ?? '#8A05BE' }}
                >
                  <AccountIcon className="h-4 w-4 text-white" />
                </div>
              )}
              <h1 className="text-lg font-semibold text-text dark:text-text-dark">
                {account?.name ?? 'Conta Bancária'}
              </h1>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide mb-1">
              Saldo disponível
            </p>
            <p className="text-3xl font-bold text-text dark:text-text-dark tracking-tight">
              {isBalanceHidden ? formatHiddenCurrency() : formatCurrency(balance)}
            </p>
            {bankInfo && (
              <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">{bankInfo}</p>
            )}
          </div>

          <button
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            className="p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
            aria-label={isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
          >
            {isBalanceHidden ? (
              <EyeOff className="h-5 w-5 text-text-muted dark:text-text-muted-dark" />
            ) : (
              <Eye className="h-5 w-5 text-text-muted dark:text-text-muted-dark" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
