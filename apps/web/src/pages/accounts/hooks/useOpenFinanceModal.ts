import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getConnectors,
  createItem,
  resyncItem,
  type OpeniConnector,
  type OpeniItemResponse,
} from '@/services/openiService';
import { createAccount, type CreateAccount } from '@/services/accountService';
import { useAccounts } from '@/hooks/useAccounts';
import { useOpeniItemEvents } from '@/hooks/useOpeniItemEvents';

interface UseOpenFinanceModalProps {
  companyId: string;
  openiTenantId?: string;
  companyDocument?: string;
  onSuccess?: () => void;
  open?: boolean;
}

type ModalStep = 'cpf-input' | 'connector-selection' | 'creating-item' | 'oauth-waiting';

interface ErrorResponse {
  status?: number;
  error?: string;
  message?: string | { message?: string; itemId?: string };
  itemId?: string;
  details?: Array<{
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
  }>;
  timestamp?: string;
  path?: string;
  response?: {
    status?: number;
    data?: ErrorResponse;
  };
  raw?: {
    status?: number;
    response?: {
      status?: number;
    };
  };
}

const getErrorStatus = (error: unknown): number | undefined => {
  const err = error as ErrorResponse;
  return (
    err.response?.status ??
    err.status ??
    err.raw?.status ??
    err.raw?.response?.status ??
    err.response?.data?.statusCode
  );
};

const getErrorData = (error: unknown): ErrorResponse => {
  const err = error as ErrorResponse;
  return err.response?.data ?? err;
};

const extractItemIdFromError = (errorData: ErrorResponse, errorMessage: string): string | undefined => {
  if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
    const firstDetail = errorData.details[0];
    if (firstDetail && typeof firstDetail === 'object' && 'id' in firstDetail) {
      return firstDetail.id;
    }
  }

  if (typeof errorData.message === 'object' && errorData.message !== null && 'itemId' in errorData.message) {
    return errorData.message.itemId;
  }

  if (errorData.itemId) {
    return errorData.itemId;
  }

  const itemIdRegex = /Item ID:\s*([a-f0-9-]+)/i;
  const itemIdMatch = itemIdRegex.exec(errorMessage);
  if (itemIdMatch?.[1]) {
    return itemIdMatch[1];
  }

  if (typeof errorData === 'object' && errorData !== null) {
    const errorDataString = JSON.stringify(errorData);
    const itemIdMatchFromString = itemIdRegex.exec(errorDataString);
    if (itemIdMatchFromString?.[1]) {
      return itemIdMatchFromString[1];
    }
  }

  return undefined;
};

const extractErrorMessage = (errorData: ErrorResponse): string => {
  if (typeof errorData?.message === 'string') {
    return errorData.message;
  }
  if (typeof errorData?.message === 'object' && errorData.message !== null) {
    if (errorData.message.message) {
      return errorData.message.message;
    }
    return JSON.stringify(errorData.message);
  }
  return 'Erro ao criar conexão Openi';
};

const hasConflictMessage = (errorMessage: string): boolean => {
  return (
    errorMessage.includes('Já existe um item ativo') ||
    errorMessage.includes('Item ID:') ||
    errorMessage.includes('already exists')
  );
};

const handleItemStatus = (
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
  },
  companyId: string,
  accountId: string,
  itemId: string,
  queryClient: ReturnType<typeof useQueryClient>,
  onSuccess: (() => void) | undefined,
  setCreatedItemId: (id: string) => void,
  setStep: (step: ModalStep) => void,
): void => {
  const status = itemData.status?.toLowerCase();

  if (status === 'waiting_user_input' && itemData.auth?.authUrl) {
    window.open(itemData.auth.authUrl, '_blank');
    toast.info('Redirecionando para autenticação...');
  } else if (status === 'connected') {
    toast.success('Conexão já existe e está ativa!');
    queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
    onSuccess?.();
  } else if (status === 'out_of_sync') {
    console.log('[OpenFinanceModal] Item is out_of_sync, requesting new connection...');
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

const processConflictError = (
  error: unknown,
  variables: { accountId: string; connectorId: string; parameters: Record<string, string> },
  accounts: ReturnType<typeof useAccounts>['accounts'],
  companyId: string,
  queryClient: ReturnType<typeof useQueryClient>,
  onSuccess: (() => void) | undefined,
  setCreatedItemId: (id: string) => void,
  setStep: (step: ModalStep) => void,
): void => {
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
    itemId = itemId ?? existingAccount?.openiItemId;

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
        handleItemStatus(detail, companyId, variables.accountId, itemId, queryClient, onSuccess, setCreatedItemId, setStep);
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

export function useOpenFinanceModal({
  companyId,
  openiTenantId,
  companyDocument,
  onSuccess,
  open = false,
}: UseOpenFinanceModalProps) {
  const queryClient = useQueryClient();
  const { accounts } = useAccounts();
  const [step, setStep] = useState<ModalStep>('cpf-input');
  const [cpfCnpj, setCpfCnpj] = useState(companyDocument ?? '');
  const [selectedConnector, setSelectedConnector] = useState<OpeniConnector | null>(null);
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const hasOpeniTenant = openiTenantId && openiTenantId.trim() !== '';
      const newStep: ModalStep = hasOpeniTenant ? 'connector-selection' : 'cpf-input';
      setStep(newStep);
      if (companyDocument) {
        setCpfCnpj(companyDocument);
      }
      setSelectedConnector(null);
      setCreatedAccountId(null);
      setCreatedItemId(null);
    } else {
      setStep('cpf-input');
      setCpfCnpj(companyDocument ?? '');
      setSelectedConnector(null);
      setCreatedAccountId(null);
      setCreatedItemId(null);
    }
  }, [open, openiTenantId, companyDocument]);

  const getDocumentType = useCallback((): 'CPF' | 'CNPJ' | undefined => {
    if (!cpfCnpj) return undefined;
    const cleaned = cpfCnpj.replaceAll(/\D/g, '');
    if (cleaned.length === 11) return 'CPF';
    if (cleaned.length === 14) return 'CNPJ';
    return undefined;
  }, [cpfCnpj]);

  const {
    data: connectors,
    isLoading: isLoadingConnectors,
    error: connectorsError,
  } = useQuery<OpeniConnector[]>({
    queryKey: ['openi-connectors', companyId, getDocumentType()],
    queryFn: () => getConnectors(companyId, undefined, getDocumentType()),
    enabled:
      !!companyId && step === 'connector-selection' && (!!getDocumentType() || !!openiTenantId),
    staleTime: 5 * 60 * 1000,
  });

  const createAccountMutation = useMutation({
    mutationFn: async (accountData: CreateAccount) => {
      return createAccount(companyId, accountData);
    },
    onSuccess: (account) => {
      setCreatedAccountId(account.id);
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message ?? 'Erro ao criar conta';
      toast.error(errorMessage);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async ({
      accountId,
      connectorId,
      parameters,
    }: {
      accountId: string;
      connectorId: string;
      parameters: Record<string, string>;
    }) => {
      return createItem(companyId, accountId, { connectorId, parameters });
    },
    onSuccess: async (item) => {
      console.log('[OpenFinanceModal] Item created:', { item });
      setCreatedItemId(item.id);
      setStep('oauth-waiting');

      if (item.status === 'PENDING' || item.status === 'pending') {
        console.log('[OpenFinanceModal] Status is PENDING, will poll until waiting_user_input...');
        toast.info('Aguardando preparação da autenticação...');
      } else if (item.status === 'WAITING_USER_INPUT' || item.status === 'waiting_user_input') {
        console.log('[OpenFinanceModal] Status is WAITING_USER_INPUT, opening auth URL...');
        if (item.auth?.authUrl) {
          window.open(item.auth.authUrl, '_blank');
          toast.info('Redirecionando para autenticação...');
        } else {
          console.warn('[OpenFinanceModal] No authUrl found in item');
        }
      } else if (item.status === 'CONNECTED' || item.status === 'connected') {
        toast.success('Conexão estabelecida com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccess?.();
      }
    },
    onError: async (error: unknown, variables) => {
      processConflictError(
        error,
        variables,
        accounts,
        companyId,
        queryClient,
        onSuccess,
        setCreatedItemId,
        setStep,
      );
    },
  });

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

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const handleSseEvent = useCallback(
    (event: Parameters<Parameters<typeof useOpeniItemEvents>[0]['onEvent']>[0]) => {
      console.log('[OpenFinanceModal] SSE event received:', event);

      const status = event.status?.toLowerCase();

      if (status === 'waiting_user_input' || event.event === 'ITEM_WAITING_USER_INPUT') {
        console.log('[OpenFinanceModal] SSE: status is waiting_user_input, opening auth URL...');
        if (event.auth?.authUrl) {
          window.open(event.auth.authUrl, '_blank');
          toast.info('Redirecionando para autenticação...');
        }
      }

      if (status === 'connected' || event.event === 'ITEM_CONNECTED') {
        console.log('[OpenFinanceModal] SSE: status is connected, connection established!');
        toast.success('Conexão estabelecida com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccessRef.current?.();
      }

      if (event.event === 'ITEM_ERROR') {
        console.error('[OpenFinanceModal] SSE: error event received:', event);
        toast.error('Erro na conexão Open Finance');
      }
    },
    [companyId, queryClient],
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

  const validateCpfCnpj = useCallback((value: string): boolean => {
    const cleaned = value.replaceAll(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 14;
  }, []);

  const handleCpfCnpjChange = useCallback((value: string) => {
    const cleaned = value.replaceAll(/\D/g, '');
    setCpfCnpj(cleaned);
  }, []);

  const handleSearchConnectors = useCallback(() => {
    if (!validateCpfCnpj(cpfCnpj)) {
      toast.error('CPF/CNPJ inválido. Digite 11 dígitos para CPF ou 14 para CNPJ.');
      return;
    }
    setStep('connector-selection');
  }, [cpfCnpj, validateCpfCnpj]);

  const handleConnectorSearch = useCallback(() => {
    // Search is handled locally by OpeniConnectorSelector component
  }, []);

  const handleSelectConnector = useCallback(
    async (connector: OpeniConnector) => {
      setSelectedConnector(connector);
      setStep('creating-item');

      let accountId: string | null = createdAccountId ?? null;
      try {
        if (!accountId) {
          const existingAccount = accounts?.find((acc) => !acc.openiItemId && acc.bankingTenantId);

          if (existingAccount) {
            accountId = existingAccount.id;
            setCreatedAccountId(accountId);
          } else {
            const newAccount = await createAccountMutation.mutateAsync({
              companyId,
              name: `${connector.name} - Open Finance`,
              type: 'checking',
              institution: connector.name,
              bankCode: 'OPENI',
              color: '#8A05BE',
              icon: 'BanknotesIcon',
              initialBalance: 0,
              initialBalanceDate: new Date().toISOString(),
              useInitialBalanceInExtract: true,
              useInitialBalanceInCashFlow: true,
              hasBankingIntegration: false,
            });
            accountId = newAccount.id;
            setCreatedAccountId(accountId);
          }
        }

        const cpfField = connector.rules.find((r) => r.field === 'cpf' || r.field === 'document');
        const fieldName = cpfField?.field ?? 'cpf';
        const documentToUse = cpfCnpj || companyDocument || '';

        await createItemMutation.mutateAsync({
          accountId,
          connectorId: connector.id,
          parameters: {
            [fieldName]: documentToUse,
          },
        });
      } catch (error) {
        console.error('[OpenFinanceModal] Error creating Openi item:', error);
        processConflictError(
          error,
          { accountId: accountId ?? '', connectorId: connector.id, parameters: {} },
          accounts,
          companyId,
          queryClient,
          onSuccess,
          setCreatedItemId,
          setStep,
        );
      }
    },
    [
      companyId,
      cpfCnpj,
      companyDocument,
      createdAccountId,
      accounts,
      createAccountMutation,
      createItemMutation,
      queryClient,
      onSuccess,
    ],
  );

  const handleOpenAuthUrl = useCallback((authUrl: string) => {
    window.open(authUrl, '_blank');
  }, []);

  const handleClose = useCallback(() => {
    setStep('cpf-input');
    setCpfCnpj('');
    setSelectedConnector(null);
    setCreatedAccountId(null);
    setCreatedItemId(null);
  }, []);

  return {
    step,
    cpfCnpj,
    connectors: connectors ?? [],
    isLoadingConnectors,
    connectorsError,
    selectedConnector,
    createdAccountId,
    createdItemId,
    itemStatus: lastEvent
      ? ({
          id: lastEvent.itemId,
          status: lastEvent.status ?? 'pending',
          auth: lastEvent.auth,
          warnings: lastEvent.warnings ?? [],
        } as OpeniItemResponse)
      : null,
    isLoadingItemStatus: connectionStatus === 'connecting' || connectionStatus === 'reconnecting',
    sseConnectionStatus: connectionStatus,
    sseError,
    isCreatingAccount: createAccountMutation.isPending,
    isCreatingItem: createItemMutation.isPending,
    handleCpfCnpjChange,
    handleSearchConnectors,
    handleConnectorSearch,
    handleSelectConnector,
    handleOpenAuthUrl,
    handleClose,
    validateCpfCnpj,
  };
}
