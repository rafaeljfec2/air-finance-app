import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import type { Account } from '@/services/accountService';
import { useMemo } from 'react';

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountChange: (accountId: string | null) => void;
}

export function AccountSelector({
  accounts,
  selectedAccountId,
  onAccountChange,
}: Readonly<AccountSelectorProps>) {
  const accountOptions: ComboBoxOption<string>[] = useMemo(() => {
    const sortedAccounts = [...accounts].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
    );
    return sortedAccounts.map((account) => ({
      value: account.id,
      label: `${account.name} ${account.accountNumber}`,
    }));
  }, [accounts]);

  return (
    <div className="space-y-2">
      <div className="block text-sm font-medium text-text dark:text-text-dark">
        Conta <span className="text-red-500">*</span>
      </div>
      <ComboBox
        options={accountOptions}
        value={selectedAccountId}
        onValueChange={(value) => onAccountChange(value ?? null)}
        placeholder="Selecione a conta"
        searchable
        searchPlaceholder="Buscar conta..."
        className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
        maxHeight="max-h-56"
        renderItem={(option) => {
          const account = accounts.find((acc) => acc.id === option.value);
          if (!account) return <span>{option.label}</span>;
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{account.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {account.accountNumber}
              </span>
            </div>
          );
        }}
        renderTrigger={(option, displayValue) => {
          if (!option) {
            return <span>{displayValue}</span>;
          }
          const account = accounts.find((acc) => acc.id === option.value);
          if (!account) return <span>{displayValue}</span>;
          return (
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-text dark:text-text-dark text-sm">
                {account.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {account.accountNumber}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}
