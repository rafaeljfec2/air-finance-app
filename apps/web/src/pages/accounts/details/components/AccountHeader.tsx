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

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  investment: 'Investimento',
  credit_card: 'Cartão de Crédito',
  digital_wallet: 'Carteira Digital',
};

const getAccountTypeLabel = (type: string): string => {
  return ACCOUNT_TYPE_LABELS[type] ?? type;
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
  const accountColor = account?.color ?? '#8A05BE';

  const handleAccountSelect = (accountId: string) => {
    onAccountSelect(accountId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="shrink-0 bg-background dark:bg-background-dark pt-4 pb-2 lg:pt-6">
      <div
        className="relative overflow-hidden mx-4 lg:mx-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accountColor} 0%, ${accountColor}dd 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 rounded-2xl" />

        <div className="relative px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>

              {hasMultipleAccounts ? (
                <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors">
                      <AccountIcon className="h-4 w-4 text-white shrink-0" />
                      <span className="text-sm font-bold text-white uppercase">
                        {account?.name ?? 'Conta Bancária'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-white/80" />
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
                              <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">
                                {getAccountTypeLabel(acc.type)}
                              </p>
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
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/10">
                  <AccountIcon className="h-4 w-4 text-white shrink-0" />
                  <h1 className="text-sm font-bold text-white uppercase">
                    {account?.name ?? 'Conta Bancária'}
                  </h1>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
            >
              {isBalanceHidden ? (
                <EyeOff className="h-5 w-5 text-white" />
              ) : (
                <Eye className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          <div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">
              Saldo disponível
            </p>
            <p className="text-3xl font-bold text-white tracking-tight">
              {isBalanceHidden ? formatHiddenCurrency() : formatCurrency(balance)}
            </p>
            {bankInfo && <p className="text-xs text-white/70 mt-1">{bankInfo}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
