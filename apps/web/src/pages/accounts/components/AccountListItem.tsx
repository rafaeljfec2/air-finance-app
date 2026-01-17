import { Account } from '@/services/accountService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, Landmark, Wallet, MoreVertical, Edit, Trash2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBanks } from '@/hooks/useBanks';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote },
  { value: 'savings', label: 'Poupança', icon: Wallet },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet },
  { value: 'investment', label: 'Investimento', icon: Landmark },
] as const;

interface AccountListItemProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onConfigureIntegration?: (account: Account) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function AccountListItem({
  account,
  onEdit,
  onDelete,
  onConfigureIntegration,
  isUpdating = false,
  isDeleting = false,
}: Readonly<AccountListItemProps>) {
  const { hasBankingIntegration } = useBanks();

  if (account.type === 'credit_card') {
    return null;
  }

  const Icon = accountTypes.find((t) => t.value === account.type)?.icon || Banknote;
  
  // Verifica se o banco suporta integração
  const bankSupportsIntegration = hasBankingIntegration(account.bankCode);

  return (
    <div className="flex items-center gap-2.5 p-2 bg-card dark:bg-card-dark hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors rounded-lg border border-border/50 dark:border-border-dark/50">
      {/* Ícone com cor */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: account.color }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-[13px] text-text dark:text-text-dark truncate leading-tight">
            {account.name}
          </h3>
          {account.hasBankingIntegration && (
            <Link2 className="h-3 w-3 text-green-500 dark:text-green-400 shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          {account.institution}
        </p>
      </div>

      {/* Saldo */}
      <div className="text-right shrink-0">
        <span className="text-[13px] font-bold text-text dark:text-text-dark block">
          {formatCurrency(account.balance)}
        </span>
      </div>

      {/* Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            disabled={isUpdating || isDeleting}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1" align="end">
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
  );
}
