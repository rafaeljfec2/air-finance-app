import { Input } from '@/components/ui/input';
import { Loader2, Search, Building2 } from 'lucide-react';
import { type OpeniConnector } from '@/services/openiService';
import { useState, useMemo } from 'react';

interface OpeniConnectorSelectorProps {
  connectors: OpeniConnector[];
  isLoading: boolean;
  selectedConnector: OpeniConnector | null;
  onSearch: (query: string) => void;
  onSelect: (connector: OpeniConnector) => void;
}

export function OpeniConnectorSelector({
  connectors,
  isLoading,
  selectedConnector,
  onSearch,
  onSelect,
}: Readonly<OpeniConnectorSelectorProps>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const filteredConnectors = useMemo(() => {
    if (!searchQuery.trim()) {
      return connectors;
    }
    const query = searchQuery.toLowerCase();
    return connectors.filter(
      (connector) =>
        connector.name.toLowerCase().includes(query) ||
        connector.type.toLowerCase().includes(query),
    );
  }, [connectors, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar banco ou instituição..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredConnectors.length === 0 ? (
        <div className="text-center py-8 bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark">
          <Building2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {searchQuery ? 'Nenhum banco encontrado' : 'Nenhum banco disponível'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          {filteredConnectors.map((connector) => {
            const isSelected = selectedConnector?.id === connector.id;
            return (
              <button
                key={connector.id}
                type="button"
                onClick={() => onSelect(connector)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-border dark:border-border-dark bg-background dark:bg-background-dark hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {connector.imageUrl ? (
                    <img
                      src={connector.imageUrl}
                      alt={connector.name}
                      className="w-10 h-10 rounded object-contain"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: connector.primaryColor
                          ? `${connector.primaryColor}20`
                          : undefined,
                      }}
                    >
                      <Building2
                        className="h-6 w-6"
                        style={{
                          color: connector.primaryColor ?? undefined,
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-text dark:text-text-dark truncate">
                      {connector.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {connector.type}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
