import { Button } from '@/components/ui/button';
import { CreditCard as CreditCardIcon, Plus } from 'lucide-react';

interface CreditCardsHeaderProps {
  onCreate: () => void;
  canCreate: boolean;
}

export function CreditCardsHeader({ onCreate, canCreate }: Readonly<CreditCardsHeaderProps>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CreditCardIcon className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Cartões de Crédito</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie seus cartões de crédito e limites
        </p>
      </div>
      {canCreate && (
        <Button
          onClick={onCreate}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Cartão
        </Button>
      )}
    </div>
  );
}
