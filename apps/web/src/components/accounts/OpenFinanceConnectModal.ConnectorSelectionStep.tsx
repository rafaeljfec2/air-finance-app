import { OpeniConnectorSelector } from './OpeniConnectorSelector';
import type { OpeniConnector } from '@/services/openiService';

interface ConnectorSelectionStepProps {
  readonly connectors: readonly OpeniConnector[];
  readonly isLoadingConnectors: boolean;
  readonly connectorsError: unknown;
  readonly selectedConnector: OpeniConnector | null;
  readonly onSearch: () => void;
  readonly onSelect: (connector: OpeniConnector) => Promise<void>;
}

export function ConnectorSelectionStep({
  connectors,
  isLoadingConnectors,
  connectorsError,
  selectedConnector,
  onSearch,
  onSelect,
}: Readonly<ConnectorSelectionStepProps>) {
  if (connectorsError) {
    return (
      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-800 dark:text-red-300">
          Erro ao carregar bancos. Tente novamente.
        </p>
      </div>
    );
  }

  return (
    <OpeniConnectorSelector
      connectors={connectors}
      isLoading={isLoadingConnectors}
      selectedConnector={selectedConnector}
      onSearch={onSearch}
      onSelect={onSelect}
    />
  );
}
