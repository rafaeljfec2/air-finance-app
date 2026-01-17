import { Button } from '@/components/ui/button';
import { CreditCard as CreditCardIcon, Plus } from 'lucide-react';

interface CreditCardsHeaderProps {
  onCreate: () => void;
  canCreate: boolean;
}

export function CreditCardsHeader({ onCreate, canCreate }: Readonly<CreditCardsHeaderProps>) {
  return (
    <>
      {/* Mobile Header */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
            <CreditCardIcon className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text dark:text-text-dark">Cartões</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gerencie seus cartões de crédito
            </p>
          </div>
        </div>

        {canCreate && (
          <Button
            onClick={onCreate}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 h-11 rounded-xl font-medium shadow-lg shadow-primary-500/20"
          >
            <Plus className="h-5 w-5" />
            Novo Cartão
          </Button>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-6 pb-6 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 dark:from-primary-400/20 dark:to-primary-500/10">
            <CreditCardIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text dark:text-text-dark mb-1">
              Cartões de Crédito
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie seus cartões, limites e fechamentos
            </p>
          </div>
        </div>

        {canCreate && (
          <Button
            onClick={onCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2 h-12 px-6 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40"
          >
            <Plus className="h-5 w-5" />
            Novo Cartão
          </Button>
        )}
      </div>
    </>
  );
}
