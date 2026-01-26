import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { OpeniConnectorSelector } from '@/components/accounts/OpeniConnectorSelector';
import type { OpeniConnector } from '@/services/openiService';

interface PageConnectorSelectionProps {
  readonly connectors: ReadonlyArray<OpeniConnector>;
  readonly isLoadingConnectors: boolean;
  readonly connectorsError: unknown;
  readonly selectedConnector: OpeniConnector | null;
  readonly onSearch: () => void;
  readonly onSelect: (connector: OpeniConnector) => Promise<void>;
  readonly onBack: () => void;
}

export function PageConnectorSelection({
  connectors,
  isLoadingConnectors,
  connectorsError,
  selectedConnector,
  onSearch,
  onSelect,
  onBack,
}: PageConnectorSelectionProps) {
  if (connectorsError) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-text dark:hover:text-text-dark -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-300">
            Erro ao carregar bancos. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-text dark:hover:text-text-dark -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <OpeniConnectorSelector
        connectors={connectors}
        isLoading={isLoadingConnectors}
        selectedConnector={selectedConnector}
        onSearch={onSearch}
        onSelect={onSelect}
      />
    </div>
  );
}
