import { Banknote, Plus, Link2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { OpenBankingEntitlement } from '@/services/subscriptionService';

interface AccountsHeaderProps {
  readonly onCreate: () => void;
  readonly canCreate: boolean;
  readonly onConnectPierre?: () => void;
  readonly onConnectOpenFinance?: () => void;
  readonly entitlement?: OpenBankingEntitlement | null;
  readonly isGod?: boolean;
}

function SlotBadge({ entitlement }: Readonly<{ entitlement: OpenBankingEntitlement }>) {
  const available = entitlement.entitledSlots - entitlement.usedSlots;
  const isFull = available <= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isFull
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      }`}
    >
      {entitlement.usedSlots}/{entitlement.entitledSlots} Open Finance
    </span>
  );
}

export function AccountsHeader({
  onCreate,
  canCreate,
  onConnectPierre,
  onConnectOpenFinance,
  entitlement,
  isGod = false,
}: Readonly<AccountsHeaderProps>) {
  const showBadge = entitlement && (entitlement.entitledSlots > 0 || isGod);
  return (
    <>
      {/* Mobile Header */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
            <Banknote className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text dark:text-text-dark">Contas</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gerencie suas contas bancárias
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {onConnectPierre && (
            <Button
              onClick={onConnectPierre}
              variant="outline"
              className="w-full border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center justify-center gap-2 h-11 rounded-xl font-medium"
            >
              <Link2 className="h-5 w-5" />
              Conectar Pierre Finance
            </Button>
          )}
          {onConnectOpenFinance && (
            <div className="flex items-center gap-2">
              <Button
                onClick={onConnectOpenFinance}
                variant="outline"
                className="flex-1 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 flex items-center justify-center gap-2 h-11 rounded-xl font-medium"
              >
                <Link2 className="h-5 w-5" />
                Open Finance
              </Button>
              {showBadge && <SlotBadge entitlement={entitlement} />}
            </div>
          )}
          {canCreate && (
            <Button
              onClick={onCreate}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 h-11 rounded-xl font-medium shadow-lg shadow-primary-500/20"
            >
              <Plus className="h-5 w-5" />
              Nova Conta
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-6 pb-6 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 dark:from-primary-400/20 dark:to-primary-500/10">
            <Banknote className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text dark:text-text-dark mb-1">
              Contas Bancárias
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie suas contas, saldos e integrações bancárias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onConnectPierre && (
            <Button
              onClick={onConnectPierre}
              variant="outline"
              className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-2 h-12 px-6 rounded-xl font-semibold"
            >
              <Link2 className="h-5 w-5" />
              Pierre Finance
            </Button>
          )}
          {onConnectOpenFinance && (
            <>
              <Button
                onClick={onConnectOpenFinance}
                variant="outline"
                className="border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 flex items-center gap-2 h-12 px-6 rounded-xl font-semibold"
              >
                <Link2 className="h-5 w-5" />
                Open Finance
              </Button>
              {showBadge && <SlotBadge entitlement={entitlement} />}
            </>
          )}
          {canCreate && (
            <Button
              onClick={onCreate}
              className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2 h-12 px-6 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40"
            >
              <Plus className="h-5 w-5" />
              Nova Conta
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
