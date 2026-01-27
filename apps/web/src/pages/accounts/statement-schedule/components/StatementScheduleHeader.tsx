import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BankIcon } from '@/components/bank/BankIcon';
import { hasBankLogo } from '@/utils/bankIcons';
import { cn } from '@/lib/utils';
import type { Account } from '@/services/accountService';
import { getBankCode, getInstitution } from '@/services/accountHelpers';

interface StatementScheduleHeaderProps {
  account: Account | undefined;
  onBack: () => void;
}

export function StatementScheduleHeader({
  account,
  onBack,
}: Readonly<StatementScheduleHeaderProps>) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="hidden md:flex p-2 h-auto"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-text dark:text-text-dark">
          Sincronização Automática
        </h1>
      </div>
      <div className="flex items-center gap-2 ml-11">
        {account &&
          (() => {
            const bankCode = getBankCode(account);
            const institution = getInstitution(account);
            const hasLogo = hasBankLogo(bankCode, institution);
            return (
              <div
                className={cn(
                  'w-6 h-6 rounded flex items-center justify-center shrink-0 overflow-hidden',
                  hasLogo ? '' : 'p-1',
                )}
                style={hasLogo ? undefined : { backgroundColor: account.color ?? '#8A05BE' }}
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
            );
          })()}
        <p className="text-sm text-gray-600 dark:text-gray-400">{account?.name ?? 'Conta'}</p>
      </div>
    </div>
  );
}
