import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Account } from '@/services/accountService';
import { BankIcon } from '@/components/bank/BankIcon';
import {
  formatCurrency,
  formatHiddenCurrency,
  getAccountSource,
  getAccountDetails,
  getAccountBalance,
  getAccountGradient,
  getAccountBankCode,
  getAccountInstitution,
} from '../utils';
import { AccountCardMenu } from './AccountCardMenu';

interface AccountBalanceCardProps {
  readonly account: Account;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly onEdit?: (account: Account) => void;
  readonly onToggleAutoSync?: (account: Account) => void;
  readonly onResync?: (account: Account) => void;
  readonly onDelete?: (account: Account) => void;
}

export function AccountBalanceCard({
  account,
  isSelected,
  onClick,
  onEdit,
  onToggleAutoSync,
  onResync,
  onDelete,
}: Readonly<AccountBalanceCardProps>) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const gradient = getAccountGradient(account);
  const balance = getAccountBalance(account);
  const source = getAccountSource(account);
  const details = getAccountDetails(account);
  const bankCode = getAccountBankCode(account);
  const institution = getAccountInstitution(account);

  const hasMenuActions = onEdit ?? onToggleAutoSync ?? onDelete;

  const handleToggleBalance = (e: MouseEvent) => {
    e.stopPropagation();
    setIsBalanceHidden((prev) => !prev);
  };

  const cardClassName = `
    relative flex-shrink-0 w-[280px] min-w-[280px] rounded-xl overflow-hidden
    transition-all duration-200 text-left cursor-pointer
    border-0 p-0 font-inherit bg-transparent
    ${isSelected ? 'scale-[1.02] shadow-lg' : 'opacity-80 hover:opacity-100'}
  `;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cardClassName}
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden">
              <BankIcon
                bankCode={bankCode}
                institution={institution}
                iconName={account.icon}
                size="lg"
                fillContainer
                className="p-1"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate max-w-[130px]">
                {account.name}
              </h3>
              {source && <p className="text-[10px] text-white/70 font-medium">{source}</p>}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleBalance}
              className="p-1.5 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
            >
              {isBalanceHidden ? (
                <EyeOff className="h-4 w-4 text-white" />
              ) : (
                <Eye className="h-4 w-4 text-white" />
              )}
            </button>

            {hasMenuActions && onEdit && onToggleAutoSync && onDelete && (
              <AccountCardMenu
                account={account}
                onEdit={onEdit}
                onToggleAutoSync={onToggleAutoSync}
                onResync={onResync}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-medium text-white/70 uppercase tracking-wide">
            Saldo disponível
          </p>
          <p className="text-xl font-bold text-white tracking-tight">
            {isBalanceHidden ? formatHiddenCurrency() : formatCurrency(balance)}
          </p>
        </div>

        {details && (
          <p className="mt-3 text-[10px] text-white/60 font-medium truncate">{details}</p>
        )}
      </div>
    </button>
  );
}
