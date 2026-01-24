import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import { type OpeniItemResponse } from '@/services/openiService';

interface OpeniItemStatusProps {
  item: OpeniItemResponse;
  isLoading: boolean;
  onResync: () => void;
  onOpenAuthUrl: (url: string) => void;
}

export function OpeniItemStatus({
  item,
  isLoading,
  onResync,
  onOpenAuthUrl,
}: Readonly<OpeniItemStatusProps>) {
  const getStatusConfig = () => {
    switch (item.status) {
      case 'CONNECTED':
        return {
          icon: CheckCircle2,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          label: 'Conectado',
          description: 'Sua conta está conectada e sincronizada',
        };
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          label: 'Pendente',
          description: 'A conexão está sendo processada',
        };
      case 'WAITING_USER_INPUT':
        return {
          icon: AlertCircle,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          label: 'Aguardando Autenticação',
          description: 'É necessário autenticar no site do banco',
        };
      case 'ERROR':
        return {
          icon: AlertTriangle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          label: 'Erro',
          description: 'Ocorreu um erro na conexão',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          label: 'Desconhecido',
          description: 'Status desconhecido',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-lg border-2 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <StatusIcon className={`h-5 w-5 ${statusConfig.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {statusConfig.description}
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
