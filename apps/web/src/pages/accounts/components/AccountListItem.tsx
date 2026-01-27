import { Account } from '@/services/accountService';
import {
  getInstitution,
  getBankCode,
  hasBankingIntegration as hasIntegration,
} from '@/services/accountHelpers';
import { formatCurrency } from '@/utils/formatters';
import { MoreVertical, Edit, Trash2, Link2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBanks } from '@/hooks/useBanks';
import { BankIcon } from '@/components/bank/BankIcon';
import { hasBankLogo } from '@/utils/bankIcons';
import { cn } from '@/lib/utils';

interface AccountListItemProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onConfigureIntegration?: (account: Account) => void;
  onConfigureSchedule?: (account: Account) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function AccountListItem({
  account,
  onEdit,
  onDelete,
  onConfigureIntegration,
  onConfigureSchedule,
  isUpdating = false,
  isDeleting = false,
}: Readonly<AccountListItemProps>) {
  const { hasBankingIntegration: bankHasIntegration } = useBanks();

  if (account.type === 'credit_card') {
    return null;
  }

  // Extrai valores usando helpers (suporta nova e antiga estrutura)
  const institution = getInstitution(account);
  const bankCode = getBankCode(account);
  const accountHasIntegration = hasIntegration(account);

  // Verifica se o banco suporta integração
  const bankSupportsIntegration = bankHasIntegration(bankCode);
  const hasLogo = hasBankLogo(bankCode, institution);

  return (
    <div className="flex items-center gap-2.5 p-2 bg-card dark:bg-card-dark hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors rounded-lg border border-border/50 dark:border-border-dark/50">
      {/* Ícone com logo do banco ou cor personalizada */}
      <div
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden',
          !hasLogo && 'p-1.5',
        )}
        style={!hasLogo ? { backgroundColor: account.color } : undefined}
      >
        <BankIcon
          bankCode={bankCode}
          institution={institution}
          iconName={!hasLogo ? (account.icon ?? undefined) : undefined}
          size="md"
          fillContainer={hasLogo}
          className={hasLogo ? 'p-1' : 'text-white'}
        />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-[13px] text-text dark:text-text-dark truncate leading-tight flex-1 min-w-0">
            {account.name}
          </h3>
          {accountHasIntegration && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 shrink-0">
              <Link2 className="h-2.5 w-2.5" />
              API
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{institution}</p>
      </div>

      {/* Saldo */}
      <div className="text-right shrink-0">
        <span className="text-[13px] font-bold text-text dark:text-text-dark block">
          {formatCurrency(account.currentBalance)}
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
        <PopoverContent className="w-56 p-1" align="end">
          <div className="flex flex-col gap-1">
            {!accountHasIntegration && onConfigureIntegration && bankSupportsIntegration && (
              <button
                onClick={() => onConfigureIntegration(account)}
                className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-primary-50 dark:hover:bg-primary-900/10 text-primary-600 dark:text-primary-400 transition-colors text-left gap-2"
                disabled={isUpdating || isDeleting}
              >
                <Link2 className="h-4 w-4" />
                Configurar Integração
              </button>
            )}
            {accountHasIntegration && onConfigureSchedule && (
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
  );
}
