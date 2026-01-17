import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, Landmark, Wallet, Building, Hash, MoreVertical, Edit, Trash2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    checking: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    savings: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    digital_wallet: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    investment: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
  };
  return colors[type] ?? colors.checking;
}

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onConfigureIntegration?: (account: Account) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function AccountCard({
  account,
  onEdit,
  onDelete,
  onConfigureIntegration,
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
    <div className="w-full rounded-lg transition-all text-left bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Ícone com cor personalizada */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: account.color }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Nome */}
            <h3 className="font-bold text-sm text-text dark:text-text-dark mb-1 line-clamp-1">
              {account.name}
            </h3>

            {/* Badge Tipo */}
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mb-2',
                getTypeBadgeColor(accountType),
              )}
            >
              {getTypeLabel(accountType)}
            </span>

            {/* Informações em Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {/* Instituição */}
              <div className="flex items-center gap-1.5 min-w-0 col-span-2">
                <Building className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate">
                  {account.institution}
                </span>
              </div>

              {/* Agência */}
              {account.agency && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Hash className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 truncate font-mono text-[11px]">
                    Ag: {account.agency}
                  </span>
                </div>
              )}

              {/* Conta */}
              {account.accountNumber && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Hash className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 truncate font-mono text-[11px]">
                    Cc: {account.accountNumber}
                  </span>
                </div>
              )}

              {/* Integração Ativa */}
              {account.hasBankingIntegration && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <Link2 className="h-3.5 w-3.5 text-green-500 dark:text-green-400 shrink-0" />
                  <span className="text-green-600 dark:text-green-400 text-[10px] font-semibold">
                    Integração Ativa
                  </span>
                </div>
              )}

              {/* Saldo - Destaque */}
              <div className="col-span-2 flex items-center gap-1.5 pt-1.5 border-t border-border/50 dark:border-border-dark/50">
                <Wallet className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 text-[10px]">Saldo:</span>
                <span className={cn(
                  "font-bold text-sm",
                  account.balance >= 0 
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                )}>
                  {formatCurrency(account.balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Vertical */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 data-[state=open]:bg-muted"
                disabled={isUpdating || isDeleting}
              >
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <div className="flex flex-col gap-1">
                {!account.hasBankingIntegration && onConfigureIntegration && (
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
      </div>
    </div>
  );
}
