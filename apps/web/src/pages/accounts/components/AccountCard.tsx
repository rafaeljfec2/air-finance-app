import { RecordCard } from '@/components/ui/RecordCard';
import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, Landmark, Wallet } from 'lucide-react';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote },
  { value: 'savings', label: 'Poupança', icon: Wallet },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet },
  { value: 'investment', label: 'Investimento', icon: Landmark },
] as const;

type AccountType = (typeof accountTypes)[number]['value'];

function getTypeLabel(type: AccountType): string {
  return accountTypes.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: AccountType): string {
  const colors: Record<AccountType, string> = {
    checking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    savings: 'bg-green-500/20 text-green-400 border-green-500/30',
    digital_wallet: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    investment: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  return colors[type] ?? colors.checking;
}

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function AccountCard({
  account,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<AccountCardProps>) {
  // Skip credit_card type as it has its own page
  if (account.type === 'credit_card') {
    return null;
  }

  const Icon = accountTypes.find((t) => t.value === account.type)?.icon || Banknote;
  const accountType = account.type as AccountType;

  return (
    <RecordCard
      onEdit={() => onEdit(account)}
      onDelete={() => onDelete(account.id)}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: account.color }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-1 truncate leading-tight">
              {account.name}
            </h3>
            <span
              className={cn(
                'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border',
                getTypeBadgeColor(accountType),
              )}
            >
              {getTypeLabel(accountType)}
            </span>
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-1">
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Instituição: </span>
          <span className="text-text dark:text-text-dark">{account.institution}</span>
        </div>
        {account.agency && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Agência: </span>
            <span className="text-text dark:text-text-dark font-mono">{account.agency}</span>
          </div>
        )}
        {account.accountNumber && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Conta: </span>
            <span className="text-text dark:text-text-dark font-mono">{account.accountNumber}</span>
          </div>
        )}
        <div className="text-[11px] leading-tight pt-1 border-t border-border dark:border-border-dark">
          <span className="text-gray-500 dark:text-gray-400">Saldo: </span>
          <span className="text-text dark:text-text-dark font-semibold">
            {formatCurrency(account.balance)}
          </span>
        </div>
      </div>
    </RecordCard>
  );
}
