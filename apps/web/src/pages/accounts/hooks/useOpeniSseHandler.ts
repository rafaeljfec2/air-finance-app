import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useOpeniItemEvents } from '@/hooks/useOpeniItemEvents';
import type { OpeniItemResponse } from '@/services/openiService';
import type { ModalStep } from './handlers/openiStatusHandlers';

interface UseOpeniSseHandlerParams {
  companyId: string;
  createdItemId: string | null;
  step: ModalStep;
  onImportAccounts: (itemId: string, status: string) => Promise<void>;
}

export const useOpeniSseHandler = ({
  companyId,
  createdItemId,
  step,
  onImportAccounts,
}: UseOpeniSseHandlerParams) => {
  const [sseReady, setSseReady] = useState(false);

  useEffect(() => {
    if (createdItemId && step === 'oauth-waiting') {
      const timer = setTimeout(() => {
        setSseReady(true);
        console.log('[OpenFinanceModal] SSE ready after delay', { createdItemId, step });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSseReady(false);
    }
  }, [createdItemId, step]);

  const sseEnabled = sseReady && !!createdItemId && step === 'oauth-waiting';
  console.log('[OpenFinanceModal] SSE hook config', {
    createdItemId,
    step,
    sseEnabled,
    sseReady,
    companyId,
  });

  const handleSseEvent = useCallback(
    (event: { event: string; itemId: string; status?: string; auth?: { authUrl: string; expiresAt: string }; warnings?: string[]; timestamp: string }) => {
      console.log('[OpenFinanceModal] SSE event received:', event);

      const status = event.status?.toLowerCase();

      if (status === 'waiting_user_input' || event.event === 'ITEM_WAITING_USER_INPUT') {
        console.log('[OpenFinanceModal] SSE: status is waiting_user_input, opening auth URL...');
        if (event.auth?.authUrl) {
          window.open(event.auth.authUrl, '_blank');
          toast.info('Redirecionando para autenticação...');
        }
      }

      if (status === 'connected' || status === 'syncing' || status === 'synced' || event.event === 'ITEM_CONNECTED' || (event.event === 'ITEM_UPDATED' && (status === 'connected' || status === 'syncing' || status === 'synced'))) {
        const itemId = event.itemId;
        
        if (status === 'syncing') {
          console.log('[OpenFinanceModal] SSE: status is syncing, connection established and syncing accounts!');
          toast.info('Conexão estabelecida! Importando contas...');
        } else {
          console.log('[OpenFinanceModal] SSE: status is connected, connection established!');
          toast.info('Conexão estabelecida! Importando contas...');
        }

        if (itemId) {
          onImportAccounts(itemId, status ?? '');
        }
      }

      if (event.event === 'ITEM_ERROR') {
        console.error('[OpenFinanceModal] SSE: error event received:', event);
        toast.error('Erro na conexão Open Finance');
      }
    },
    [onImportAccounts],
  );

  const handleSseError = useCallback((error: Error) => {
    console.error('[OpenFinanceModal] SSE error:', error);
    toast.error('Erro na conexão com o servidor. Tentando reconectar...');
  }, []);

  const { lastEvent, connectionStatus, error: sseError } = useOpeniItemEvents({
    companyId,
    itemId: createdItemId,
    enabled: sseEnabled,
    onEvent: handleSseEvent,
    onError: handleSseError,
  });

  const itemStatus: OpeniItemResponse | null = lastEvent
    ? ({
        id: lastEvent.itemId,
        status: lastEvent.status ?? 'pending',
        auth: lastEvent.auth,
        warnings: lastEvent.warnings ?? [],
      } as OpeniItemResponse)
    : null;

  const isLoadingItemStatus = connectionStatus === 'connecting' || connectionStatus === 'reconnecting';

  return {
    itemStatus,
    isLoadingItemStatus,
    sseConnectionStatus: connectionStatus,
    sseError,
  };
};
