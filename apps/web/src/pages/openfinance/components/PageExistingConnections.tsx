import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Building2, RefreshCw } from 'lucide-react';
import { type OpeniItem } from '@/services/openiService';
import { formatDateTime } from '@/utils/formatters';
import { translateOpeniStatus } from '@/components/accounts/utils/openiStatusTranslations';

interface PageExistingConnectionsProps {
  readonly items: ReadonlyArray<OpeniItem>;
  readonly onAddAnother: () => void;
}

function StatusBadge({ status }: { readonly status: string }) {
  const config = translateOpeniStatus(status);
  const Icon = config.icon;
  const isAnimating = status.toUpperCase() === 'SYNCING';

  return (
    <span className={config.className}>
      <Icon className={`h-3.5 w-3.5 ${isAnimating ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}

function ConnectionCard({ item }: { readonly item: OpeniItem }) {
  return (
    <Card className="border border-border dark:border-border-dark hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            {item.connectorImageUrl ? (
              <div className="h-12 w-12 rounded-xl bg-white dark:bg-gray-800 p-2 border border-border dark:border-border-dark flex items-center justify-center overflow-hidden">
                <img
                  src={item.connectorImageUrl}
                  alt={item.connectorName ?? 'Banco'}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              </div>
            ) : null}
            <div
              className={`h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex items-center justify-center flex-shrink-0 ${
                item.connectorImageUrl ? 'hidden' : ''
              }`}
            >
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text dark:text-text-dark truncate">
                  {item.connectorName ?? 'Banco desconhecido'}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-0.5">
                  {item.connectorType === 'PERSONAL_BANK'
                    ? 'Banco Pessoal'
                    : item.connectorType === 'BUSINESS_BANK'
                      ? 'Banco Empresarial'
                      : 'Banco'}
                </p>
                {item.updatedAt && (
                  <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                    Última sincronização: {formatDateTime(item.updatedAt)}
                  </p>
                )}
              </div>
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onAddAnother }: { readonly onAddAnother: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
        <Link2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
        Nenhuma conexão encontrada
      </h3>
      <p className="text-sm text-muted-foreground dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Você ainda não possui conexões ativas com bancos via Open Finance. Conecte sua conta para
        sincronizar transações automaticamente.
      </p>
      <Button onClick={onAddAnother} className="bg-purple-600 hover:bg-purple-700 text-white">
        <Link2 className="h-4 w-4 mr-2" />
        Conectar conta bancária
      </Button>
    </div>
  );
}

export function PageExistingConnections({ items, onAddAnother }: PageExistingConnectionsProps) {
  if (items.length === 0) {
    return <EmptyState onAddAnother={onAddAnother} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text dark:text-text-dark">Conexões Ativas</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            {items.length} {items.length === 1 ? 'banco conectado' : 'bancos conectados'} via Open
            Finance
          </p>
        </div>
        <Button
          onClick={onAddAnother}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Nova conexão
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <ConnectionCard key={item.itemId} item={item} />
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          As transações são sincronizadas automaticamente. Últimas atualizações podem levar alguns
          minutos.
        </p>
      </div>
    </div>
  );
}
