import { Button } from '@/components/ui/button';
import { Banknote, Plus, Link2 } from 'lucide-react';

interface AccountsHeaderProps {
  onCreate: () => void;
  canCreate: boolean;
  onConnectPierre?: () => void;
}

export function AccountsHeader({ onCreate, canCreate, onConnectPierre }: Readonly<AccountsHeaderProps>) {
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
