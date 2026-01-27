import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { resyncItem } from '@/services/openiService';
import { useAccounts } from '@/hooks/useAccounts';
import {
  getErrorStatus,
  getErrorData,
  extractItemIdFromError,
  extractErrorMessage,
  hasConflictMessage,
} from '../utils/openiErrorUtils';

export type ModalStep =
  | 'existing-connections'
  | 'cpf-input'
  | 'connector-selection'
  | 'creating-item'
  | 'oauth-waiting';

export interface HandleItemStatusParams {
  itemData: {
    id: string;
    connectorId?: string;
    status: string;
    auth?: {
      authUrl: string;
      expiresAt: string;
    };
    warnings: string[];
    updatedAt: string;
    createdAt: string;
  };
  itemInfo: {
    companyId: string;
    accountId?: string;
    itemId: string;
  };
  queryClient: ReturnType<typeof useQueryClient>;
  onSuccess: (() => void) | undefined;
  setCreatedItemId: (id: string) => void;
  setStep: (step: ModalStep) => void;
}

export const handleItemStatus = ({
  itemData,
  itemInfo,
  queryClient,
  onSuccess,
  setCreatedItemId,
  setStep,
}: HandleItemStatusParams): void => {
  const { companyId, accountId, itemId } = itemInfo;
  const status = itemData.status?.toLowerCase();

  if (status === 'waiting_user_input' && itemData.auth?.authUrl) {
    window.open(itemData.auth.authUrl, '_blank');
    toast.info('Redirecionando para autenticação...');
  } else if (status === 'connected' || status === 'syncing' || status === 'synced') {
    const message =
      status === 'syncing'
        ? 'Conexão estabelecida! Sincronizando contas...'
        : 'Conexão já existe e está ativa!';
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
    onSuccess?.();
  } else if (status === 'out_of_sync') {
    console.log('[OpenFinanceModal] Item is out_of_sync, requesting new connection...');

    if (!accountId) {
      toast.error('Não é possível ressincronizar sem uma conta vinculada.');
      setStep('connector-selection');
      return;
    }

    toast.info('Item desincronizado. Solicitando nova conexão...');

    resyncItem(companyId, accountId, itemId)
      .then(() => {
        toast.success('Nova conexão solicitada. Aguardando autenticação...');
        setCreatedItemId(itemId);
        setStep('oauth-waiting');
      })
      .catch((resyncError) => {
        console.error('[OpenFinanceModal] Error requesting resync:', resyncError);
        toast.error('Erro ao solicitar nova conexão. Tente novamente.');
        setStep('connector-selection');
      });
  } else if (status === 'pending') {
    toast.info('Item já existe. Aguardando preparação da autenticação...');
  } else {
    toast.info(`Item já existe com status: ${itemData.status}`);
  }
};

export interface ProcessConflictErrorParams {
  error: unknown;
  context: {
    variables: { accountId?: string; connectorId: string; parameters: Record<string, string> };
    accounts: ReturnType<typeof useAccounts>['accounts'];
    companyId: string;
  };
  queryClient: ReturnType<typeof useQueryClient>;
  onSuccess: (() => void) | undefined;
  setCreatedItemId: (id: string) => void;
  setStep: (step: ModalStep) => void;
}

export const processConflictError = ({
  error,
  context,
  queryClient,
  onSuccess,
  setCreatedItemId,
  setStep,
}: ProcessConflictErrorParams): void => {
  const { variables, accounts, companyId } = context;
  const errorStatus = getErrorStatus(error);
  const errorData = getErrorData(error);
  const errorMessage = extractErrorMessage(errorData);
  const isConflict = errorStatus === 409;
  const hasConflict = hasConflictMessage(errorMessage);

  if (!isConflict && !hasConflict) {
    toast.error(errorMessage);
    setStep('connector-selection');
    return;
  }

  console.log('[OpenFinanceModal] Item already exists, processing...', {
    errorMessage,
    errorData,
    isConflict,
    hasConflict,
  });

  try {
    let itemId = extractItemIdFromError(errorData, errorMessage);
    const existingAccount = accounts?.find((acc) => acc.id === variables.accountId);
    itemId = itemId ?? existingAccount?.openiItemId ?? undefined;

    if (!itemId) {
      console.error('[OpenFinanceModal] Could not extract itemId from error:', {
        errorData,
        errorMessage,
        existingAccount,
      });
      toast.error('Item já existe, mas não foi possível localizar o ID do item');
      setStep('connector-selection');
      return;
    }

    setCreatedItemId(itemId);
    setStep('oauth-waiting');

    if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
      const firstDetail = errorData.details[0];
      if (
        firstDetail &&
        typeof firstDetail === 'object' &&
        'id' in firstDetail &&
        'status' in firstDetail
      ) {
        const detail = firstDetail as {
          id: string;
          connectorId?: string;
          status: string;
          auth?: { authUrl: string; expiresAt: string };
          warnings: string[];
          updatedAt: string;
          createdAt: string;
        };
        handleItemStatus({
          itemData: detail,
          itemInfo: { companyId, accountId: variables.accountId, itemId },
          queryClient,
          onSuccess,
          setCreatedItemId,
          setStep,
        });
        return;
      }
    }

    console.log('[OpenFinanceModal] Item data not in details, will wait for SSE events', itemId);
    toast.info('Item já existe. Aguardando atualização via SSE...');
  } catch (fetchError) {
    console.error('[OpenFinanceModal] Error processing conflict error:', fetchError);
    toast.error('Erro ao obter dados do item existente');
    setStep('connector-selection');
  }
};
