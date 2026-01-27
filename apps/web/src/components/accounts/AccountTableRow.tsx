import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Account } from '@/services/accountService';
import {
  getInstitution,
  getBankCode,
  getAgency,
  getAccountNumber,
  getAccountTypeLabel,
  hasBankingIntegration as hasIntegration,
} from '@/services/accountHelpers';
import { formatCurrency } from '@/utils/formatters';
import { Banknote, Edit, Landmark, Trash2, Wallet, Link2, Clock } from 'lucide-react';
import { useBanks } from '@/hooks/useBanks';
import { BankIcon } from '@/components/bank/BankIcon';
import { hasBankLogo } from '@/utils/bankIcons';

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

function getTypeLabel(type: string): string {
  return accountTypes.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: string): string {
  const colors: Record<AccountType, string> = {
    checking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    savings: 'bg-green-500/20 text-green-400 border-green-500/30',
    digital_wallet: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    investment: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  return colors[type as AccountType] ?? colors.checking;
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
  const { hasBankingIntegration: bankHasIntegration } = useBanks();

  // Filter out credit_card type as it has its own page
  if (account.type === 'credit_card') {
    return null;
  }

  // Extrai valores usando helpers (suporta nova e antiga estrutura)
  const institution = getInstitution(account);
  const bankCode = getBankCode(account);
  const agency = getAgency(account);
  const accountNumber = getAccountNumber(account);
  const accountHasIntegration = hasIntegration(account);

  const bankSupportsIntegration = bankHasIntegration(bankCode);
  const hasLogo = hasBankLogo(bankCode, institution);

  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden',
              !hasLogo && 'rounded-full',
            )}
            style={hasLogo ? undefined : { backgroundColor: account.color }}
          >
            <BankIcon
              bankCode={bankCode}
              institution={institution}
              iconName={hasLogo ? undefined : (account.icon ?? undefined)}
              size="sm"
              fillContainer={hasLogo}
              className={hasLogo ? 'p-0.5' : 'text-white'}
            />
          </div>
          <div>
            <div className="font-medium text-text dark:text-text-dark mb-1">{account.name}</div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
                  getTypeBadgeColor(account.type),
                )}
              >
                {getTypeLabel(account.type)}
              </span>
              {accountHasIntegration && (
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
        <div className="text-sm text-text dark:text-text-dark">{institution}</div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Ag: </span>
            <span className="text-text dark:text-text-dark font-mono text-xs">{agency}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {getAccountTypeLabel(account)}:{' '}
            </span>
            <span className="text-text dark:text-text-dark font-mono text-xs">{accountNumber}</span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          {account.bankCurrentBalance !== null && account.bankCurrentBalance !== undefined ? (
            <>
              <div className="text-sm font-semibold text-text dark:text-text-dark">
                {formatCurrency(account.bankCurrentBalance)}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                Inicial: {formatCurrency(account.initialBalance)}
              </div>
            </>
          ) : (
            <div className="text-sm font-semibold text-text dark:text-text-dark">
              {formatCurrency(account.initialBalance)}
            </div>
          )}
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          {!accountHasIntegration && onConfigureIntegration && bankSupportsIntegration && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfigureIntegration(account)}
              disabled={isUpdating || isDeleting}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10"
              title="Configurar Integração"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          )}
          {accountHasIntegration && onConfigureSchedule && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfigureSchedule(account)}
              disabled={isUpdating || isDeleting}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
              title="Sincronização Automática"
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(account)}
            disabled={isUpdating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(account.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
