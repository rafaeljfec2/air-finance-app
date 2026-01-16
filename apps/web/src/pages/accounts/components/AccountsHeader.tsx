import { Button } from '@/components/ui/button';
import { Banknote, Plus } from 'lucide-react';

interface AccountsHeaderProps {
  onCreate: () => void;
  canCreate: boolean;
}

export function AccountsHeader({ onCreate, canCreate }: Readonly<AccountsHeaderProps>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Banknote className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Contas Bancárias</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie suas contas bancárias e investimentos. Para gerenciar cartões de crédito, acesse
          a seção de Cartões.
        </p>
      </div>
      {canCreate && (
        <Button
          onClick={onCreate}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Conta
        </Button>
      )}
    </div>
  );
}
