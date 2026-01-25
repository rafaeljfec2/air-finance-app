import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import { type OpeniItemResponse } from '@/services/openiService';
import { translateOpeniStatus } from './utils/openiStatusTranslations';

interface OpeniItemStatusProps {
  item: OpeniItemResponse;
  isLoading: boolean;
  onResync: () => void;
  onOpenAuthUrl: (url: string) => void;
}

const getStatusDescription = (status: string): string => {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case 'CONNECTED':
      return 'Sua conta está conectada e sincronizada';
    case 'SYNCING':
      return 'Sincronizando dados da conta';
    case 'SYNCED':
      return 'Conta sincronizada com sucesso';
    case 'PENDING':
      return 'A conexão está sendo processada';
    case 'WAITING_USER_INPUT':
      return 'É necessário autenticar no site do banco';
    case 'ERROR':
    case 'AUTH_ERROR':
      return 'Ocorreu um erro na conexão';
    case 'OUT_OF_SYNC':
      return 'A conexão precisa ser ressincronizada';
    case 'DELETED':
      return 'Esta conexão foi excluída';
    default:
      return 'Status desconhecido';
  }
};

export function OpeniItemStatus({
  item,
  isLoading,
  onResync,
  onOpenAuthUrl,
}: Readonly<OpeniItemStatusProps>) {
  const statusConfig = translateOpeniStatus(item.status);
  const StatusIcon = statusConfig.icon;
  const description = getStatusDescription(item.status);
  
  const colorMap: Record<string, string> = {
    CONNECTED: 'text-green-600 dark:text-green-400',
    SYNCING: 'text-blue-600 dark:text-blue-400',
    SYNCED: 'text-green-600 dark:text-green-400',
    PENDING: 'text-yellow-600 dark:text-yellow-400',
    WAITING_USER_INPUT: 'text-orange-600 dark:text-orange-400',
    ERROR: 'text-red-600 dark:text-red-400',
    AUTH_ERROR: 'text-red-600 dark:text-red-400',
    OUT_OF_SYNC: 'text-orange-600 dark:text-orange-400',
    DELETED: 'text-gray-600 dark:text-gray-400',
  };

  const bgColorMap: Record<string, string> = {
    CONNECTED: 'bg-green-50 dark:bg-green-900/20',
    SYNCING: 'bg-blue-50 dark:bg-blue-900/20',
    SYNCED: 'bg-green-50 dark:bg-green-900/20',
    PENDING: 'bg-yellow-50 dark:bg-yellow-900/20',
    WAITING_USER_INPUT: 'bg-orange-50 dark:bg-orange-900/20',
    ERROR: 'bg-red-50 dark:bg-red-900/20',
    AUTH_ERROR: 'bg-red-50 dark:bg-red-900/20',
    OUT_OF_SYNC: 'bg-orange-50 dark:bg-orange-900/20',
    DELETED: 'bg-gray-50 dark:bg-gray-900/20',
  };

  const borderColorMap: Record<string, string> = {
    CONNECTED: 'border-green-200 dark:border-green-800',
    SYNCING: 'border-blue-200 dark:border-blue-800',
    SYNCED: 'border-green-200 dark:border-green-800',
    PENDING: 'border-yellow-200 dark:border-yellow-800',
    WAITING_USER_INPUT: 'border-orange-200 dark:border-orange-800',
    ERROR: 'border-red-200 dark:border-red-800',
    AUTH_ERROR: 'border-red-200 dark:border-red-800',
    OUT_OF_SYNC: 'border-orange-200 dark:border-orange-800',
    DELETED: 'border-gray-200 dark:border-gray-800',
  };

  const upperStatus = item.status.toUpperCase();
  const color = colorMap[upperStatus] ?? 'text-gray-600 dark:text-gray-400';
  const bgColor = bgColorMap[upperStatus] ?? 'bg-gray-50 dark:bg-gray-900/20';
  const borderColor = borderColorMap[upperStatus] ?? 'border-gray-200 dark:border-gray-800';

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor}`}>
        <div className="flex items-start gap-3">
          <StatusIcon className={`h-5 w-5 ${color} flex-shrink-0 mt-0.5 ${upperStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${color}`}>{statusConfig.label}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>

      {item.status === 'WAITING_USER_INPUT' && item.auth?.authUrl && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
            Clique no botão abaixo para ser redirecionado ao site do banco e completar a
            autenticação:
          </p>
          <Button
            onClick={() => onOpenAuthUrl(item.auth!.authUrl)}
            className="w-full"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Autenticar no Banco
          </Button>
          {item.auth.expiresAt && (
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 text-center">
              Link expira em: {new Date(item.auth.expiresAt).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      )}

      {item.warnings && item.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                Avisos
              </h4>
              <ul className="space-y-1">
                {item.warnings.map((warning, index) => (
                  <li key={index} className="text-xs text-yellow-800 dark:text-yellow-200">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={onResync}
          disabled={isLoading}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Ressincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Ressincronizar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
