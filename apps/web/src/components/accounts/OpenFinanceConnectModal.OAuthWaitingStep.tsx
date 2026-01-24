import { useMemo } from 'react';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { LoadingState } from './OpenFinanceConnectModal.LoadingState';
import { StatusCard } from './OpenFinanceConnectModal.StatusCard';
import { WaitingUserInputCard } from './OpenFinanceConnectModal.WaitingUserInputCard';
import { ConnectionStatusIndicator } from './OpenFinanceConnectModal.ConnectionStatusIndicator';
import type { ConnectionStatusIndicatorProps } from './OpenFinanceConnectModal.ConnectionStatusIndicator';

interface OAuthWaitingStepProps {
  readonly itemStatus: {
    readonly status: string;
    readonly auth?: {
      readonly authUrl: string;
      readonly expiresAt: string;
    };
  } | null;
  readonly isLoadingItemStatus: boolean;
  readonly sseConnectionStatus: string;
  readonly sseError: Error | null;
  readonly onOpenAuthUrl: (url: string) => void;
}

export function OAuthWaitingStep({
  itemStatus,
  isLoadingItemStatus,
  sseConnectionStatus,
  sseError,
  onOpenAuthUrl,
}: Readonly<OAuthWaitingStepProps>) {
  const isConnectedOrSyncing = useMemo(() => {
    if (!itemStatus) return false;
    const status = itemStatus.status.toUpperCase();
    return status === 'CONNECTED' || status === 'SYNCING' || status === 'SYNCED';
  }, [itemStatus]);

  const shouldShowSseIndicator = useMemo(() => {
    if (!sseConnectionStatus) return false;
    if (sseConnectionStatus === 'disconnected' || sseConnectionStatus === 'closed') return false;
    return !isConnectedOrSyncing;
  }, [sseConnectionStatus, isConnectedOrSyncing]);

  const sseMessage = useMemo(() => {
    if (sseConnectionStatus === 'connected') {
      return 'Conectado ao servidor. Aguardando atualizações...';
    }
    if (sseConnectionStatus === 'connecting') {
      return 'Conectando ao servidor...';
    }
    if (sseConnectionStatus === 'reconnecting') {
      return 'Reconectando ao servidor...';
    }
    if (sseError) {
      return 'Erro na conexão com o servidor';
    }
    return undefined;
  }, [sseConnectionStatus, sseError]);

  if (!itemStatus && isLoadingItemStatus) {
    return (
      <LoadingState
        message="Aguardando preparação da autenticação..."
        subMessage="Estamos preparando o link de autenticação do banco..."
      />
    );
  }

  if (!itemStatus && !isLoadingItemStatus) {
    return (
      <StatusCard
        icon={Clock}
        title="Aguardando informações da conexão..."
        description="Estamos aguardando atualizações sobre o status da sua conexão."
        variant="gray"
      />
    );
  }

  if (!itemStatus) {
    return null;
  }

  const status = itemStatus.status.toUpperCase();

  return (
    <div className="space-y-4">
      {status === 'WAITING_USER_INPUT' && (
        <WaitingUserInputCard
          authUrl={itemStatus.auth?.authUrl}
          expiresAt={itemStatus.auth?.expiresAt}
          onOpenAuthUrl={onOpenAuthUrl}
        />
      )}

      {status === 'PENDING' && (
        <StatusCard
          icon={Clock}
          title="Preparando autenticação..."
          description="Aguarde enquanto preparamos o link de autenticação. Isso pode levar alguns segundos."
          variant="yellow"
        />
      )}

      {isConnectedOrSyncing && (
        <div className="space-y-3">
          <StatusCard
            icon={CheckCircle2}
            title="Conexão estabelecida! Importando contas..."
            description="Sua conta bancária foi conectada. Estamos importando suas contas automaticamente..."
            variant="green"
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Buscando e importando contas disponíveis...
            </p>
          </div>
        </div>
      )}

      {!isConnectedOrSyncing && status !== 'WAITING_USER_INPUT' && status !== 'PENDING' && (
        <StatusCard
          icon={Clock}
          title="Processando conexão..."
          description="Aguarde enquanto processamos sua conexão. Você será notificado quando estiver concluída."
          variant="gray"
        />
      )}

      {shouldShowSseIndicator && (
        <ConnectionStatusIndicator
          status={sseConnectionStatus as ConnectionStatusIndicatorProps['status']}
          message={sseMessage}
        />
      )}
    </div>
  );
}
