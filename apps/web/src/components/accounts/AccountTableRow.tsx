import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, Edit, Landmark, Trash2, Wallet, Link2 } from 'lucide-react';

interface AccountTableRowProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

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

export function AccountTableRow({
  account,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<AccountTableRowProps>) {
  // Filter out credit_card type as it has its own page
  if (account.type === 'credit_card') {
    return null;
  }

  const Icon = accountTypes.find((t) => t.value === account.type)?.icon || Banknote;
  const accountType = account.type as AccountType;

  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: account.color }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-text dark:text-text-dark mb-1">{account.name}</div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
                  getTypeBadgeColor(accountType),
                )}
              >
                {getTypeLabel(accountType)}
              </span>
              {account.hasBankingIntegration && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700">
                  <Link2 className="h-3 w-3" />
                  Integração Ativa
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-text dark:text-text-dark">
          {account.institution}
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Ag: </span>
            <span className="text-text dark:text-text-dark font-mono text-xs">
              {account.agency}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Cc: </span>
            <span className="text-text dark:text-text-dark font-mono text-xs">
              {account.accountNumber}
            </span>
          </div>
        </div>
      </td>
       <td className="p-4">
         <div className="text-sm font-semibold text-text dark:text-text-dark">
          {formatCurrency(account.balance)}
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(account)}
            disabled={isUpdating}
             className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(account.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
