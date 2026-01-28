import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Building2 } from 'lucide-react';
import { type OpeniItem } from '@/services/openiService';
import { formatDateTime } from '@/utils/formatters';
import { LoadingState } from './OpenFinanceConnectModal.LoadingState';
import { StatusCard } from './OpenFinanceConnectModal.StatusCard';
import { BUTTON_FULL_WIDTH, BUTTON_HEIGHT } from './OpenFinanceConnectModal.constants';
import { translateOpeniStatus } from './utils/openiStatusTranslations';

interface ExistingConnectionsStepProps {
  readonly items: readonly OpeniItem[];
  readonly isLoading: boolean;
  readonly onAddAnother: () => void;
  readonly onCancel: () => void;
}

function getStatusBadge(status: string) {
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

export function ExistingConnectionsStep({
  items,
  isLoading,
  onAddAnother,
  onCancel,
}: Readonly<ExistingConnectionsStepProps>) {
  if (isLoading) {
    return (
      <LoadingState
        message="Carregando conexões existentes..."
        subMessage="Aguarde enquanto buscamos suas conexões..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text dark:text-text-dark">
          Conexões Existentes
        </h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Você já possui{' '}
          <span className="font-medium text-text dark:text-text-dark">{items.length}</span>{' '}
          {items.length === 1 ? 'conexão ativa' : 'conexões ativas'} com bancos via Open Finance.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-8">
          <StatusCard
            icon={Building2}
            title="Nenhuma conexão encontrada"
            description="Você ainda não possui conexões ativas com bancos via Open Finance."
            variant="gray"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.itemId}
              className="border border-border dark:border-border-dark hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all duration-200"
            >
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
                            const fallback = target.parentElement
                              ?.nextElementSibling as HTMLElement;
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
                            : 'Banco Empresarial'}
                        </p>
                        {item.updatedAt && (
                          <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                            Última sincronização: {formatDateTime(item.updatedAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(item.status)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border dark:border-border-dark">
        <Button
          onClick={onCancel}
          variant="outline"
          className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} sm:flex-1 order-2 sm:order-1 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium transition-colors`}
        >
          Cancelar
        </Button>
        <Button
          onClick={onAddAnother}
          className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} bg-purple-600 hover:bg-purple-700 text-white font-medium sm:flex-1 order-1 sm:order-2`}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Adicionar mais uma conexão
        </Button>
      </div>
    </div>
  );
}
