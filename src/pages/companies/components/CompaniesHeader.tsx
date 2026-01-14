import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';

interface CompaniesHeaderProps {
  onCreate: () => void;
  canCreate: boolean;
}

export function CompaniesHeader({ onCreate, canCreate }: Readonly<CompaniesHeaderProps>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Empresas</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie suas empresas e filiais
        </p>
      </div>
      {canCreate && (
        <Button
          onClick={onCreate}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Empresa
        </Button>
      )}
    </div>
  );
}
