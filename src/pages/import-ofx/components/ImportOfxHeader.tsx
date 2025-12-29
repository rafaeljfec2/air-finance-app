import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';

interface ImportOfxHeaderProps {
  onImportClick: () => void;
  disableImport: boolean;
}

export function ImportOfxHeader({ onImportClick, disableImport }: ImportOfxHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <div className="flex items-center gap-2">
          <Receipt className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">
            Extrato Bancário
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualize os extratos importados por período.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onImportClick}
          disabled={disableImport}
          className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          Importar extrato (OFX)
        </Button>
      </div>
    </div>
  );
}
