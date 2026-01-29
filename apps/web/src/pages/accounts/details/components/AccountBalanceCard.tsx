import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Account } from '@/services/accountService';
import {
  formatCurrency,
  formatHiddenCurrency,
  getAccountIcon,
  getAccountSource,
  getAccountDetails,
  getAccountBalance,
  getAccountColor,
} from '../utils';
import { AccountCardMenu } from './AccountCardMenu';

interface AccountBalanceCardProps {
  readonly account: Account;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly onEdit?: (account: Account) => void;
  readonly onToggleAutoSync?: (account: Account) => void;
  readonly onDelete?: (account: Account) => void;
}

export function AccountBalanceCard({
  account,
  isSelected,
  onClick,
  onEdit,
  onToggleAutoSync,
  onDelete,
}: Readonly<AccountBalanceCardProps>) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const accountColor = getAccountColor(account);
  const AccountIcon = getAccountIcon(account.icon);
  const balance = getAccountBalance(account);
  const source = getAccountSource(account);
  const details = getAccountDetails(account);

  const hasMenuActions = onEdit ?? onToggleAutoSync ?? onDelete;

  const handleToggleBalance = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBalanceHidden((prev) => !prev);
  };

  const cardClassName = `
    relative flex-shrink-0 w-[280px] min-w-[280px] rounded-xl overflow-hidden
    transition-all duration-200 text-left
    ${isSelected ? 'scale-[1.02] shadow-lg' : 'opacity-80 hover:opacity-100'}
  `;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className={cardClassName}
      style={{
        background: `linear-gradient(135deg, ${accountColor} 0%, ${accountColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <AccountIcon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate max-w-[140px]">
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
    </div>
  );
}
