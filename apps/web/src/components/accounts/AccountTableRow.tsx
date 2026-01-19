import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, Edit, Landmark, Trash2, Wallet, Link2, Clock, MoreVertical } from 'lucide-react';
import { useBanks } from '@/hooks/useBanks';

interface AccountTableRowProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onConfigureIntegration?: (account: Account) => void;
  onConfigureSchedule?: (account: Account) => void;
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
  onConfigureIntegration,
  onConfigureSchedule,
  isUpdating,
  isDeleting,
}: Readonly<AccountTableRowProps>) {
  const { hasBankingIntegration } = useBanks();
  
  // Filter out credit_card type as it has its own page
  if (account.type === 'credit_card') {
    return null;
  }

  const Icon = accountTypes.find((t) => t.value === account.type)?.icon || Banknote;
  const bankSupportsIntegration = hasBankingIntegration(account.bankCode);

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
                  getTypeBadgeColor(account.type as AccountType),
                )}
              >
                {getTypeLabel(account.type as AccountType)}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                disabled={isUpdating || isDeleting}
              >
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="end">
              <div className="flex flex-col gap-1">
                {!account.hasBankingIntegration && onConfigureIntegration && bankSupportsIntegration && (
                  <button
                    onClick={() => onConfigureIntegration(account)}
                    className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-primary-50 dark:hover:bg-primary-900/10 text-primary-600 dark:text-primary-400 transition-colors text-left gap-2"
                    disabled={isUpdating || isDeleting}
                  >
                    <Link2 className="h-4 w-4" />
                    Configurar Integração
                  </button>
                )}
                {account.hasBankingIntegration && onConfigureSchedule && (
                  <button
                    onClick={() => onConfigureSchedule(account)}
                    className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-blue-50 dark:hover:bg-blue-900/10 text-blue-600 dark:text-blue-400 transition-colors text-left gap-2"
                    disabled={isUpdating || isDeleting}
                  >
                    <Clock className="h-4 w-4" />
                    Sincronização Automática
                  </button>
                )}
                <button
                  onClick={() => onEdit(account)}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
                  disabled={isUpdating || isDeleting}
                >
                  <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(account.id)}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </td>
    </tr>
  );
}
