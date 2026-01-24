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

const getErrorStatus = (error: unknown): number | undefined => {
  const err = error as {
    response?: {
      status?: number;
      data?: {
        statusCode?: number;
      };
    };
    status?: number;
    raw?: {
      status?: number;
      response?: {
        status?: number;
      };
    };
  };

  return (
    err.response?.status ??
    err.status ??
    err.raw?.status ??
    err.raw?.response?.status ??
    err.response?.data?.statusCode
  );
};

const getErrorData = (error: unknown) => {
  const err = error as {
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
      data?: {
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
      };
    };
  };
  
  if (err.response?.data) {
    return err.response.data;
  }
  
  return err;
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
      const errorMessage = err.response?.data?.message || 'Erro ao criar conta';
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
    onSuccess: async (item, variables) => {
      console.log('[OpenFinanceModal] Item created:', { item, accountId: variables.accountId });
      console.log('[OpenFinanceModal] Setting createdItemId and step', {
        itemId: item.id,
        status: item.status,
        willSetStep: 'oauth-waiting',
      });
      setCreatedItemId(item.id);
      setStep('oauth-waiting');
      console.log('[OpenFinanceModal] State updated - createdItemId and step set', {
        itemId: item.id,
        step: 'oauth-waiting',
      });

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
      } else if (item.status === 'CONNECTED' || item.status === 'CONNECTED') {
        toast.success('Conexão estabelecida com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccess?.();
      }
    },
    onError: async (error: unknown, variables) => {
      const errorStatus = getErrorStatus(error);
      const errorData = getErrorData(error);

      console.log('[OpenFinanceModal] Error received:', {
        errorStatus,
        errorData,
        error,
        stringified: JSON.stringify(errorData),
      });

      const isConflict = errorStatus === 409;

      let errorMessage = 'Erro ao criar conexão Openi';
      if (typeof errorData?.message === 'string') {
        errorMessage = errorData.message;
      } else if (typeof errorData?.message === 'object' && errorData.message !== null) {
        if (errorData.message.message) {
          errorMessage = errorData.message.message;
        } else if (typeof errorData.message === 'object') {
          errorMessage = JSON.stringify(errorData.message);
        }
      }

      let itemIdFromError: string | undefined;
      let itemDataFromDetails:
        | {
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
          }
        | undefined;

      if (errorData?.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        const firstDetail = errorData.details[0];
        if (firstDetail && typeof firstDetail === 'object' && 'id' in firstDetail) {
          const detail = firstDetail as {
            id: string;
            connectorId?: string;
            status: string;
            auth?: { authUrl: string; expiresAt: string };
            warnings: string[];
            updatedAt: string;
            createdAt: string;
          };
          itemDataFromDetails = detail;
          itemIdFromError = detail.id;
          console.log('[OpenFinanceModal] Extracted item data from details:', {
            id: detail.id,
            status: detail.status,
            hasAuthUrl: !!detail.auth?.authUrl,
            connectorId: detail.connectorId,
          });
        }
      }

      if (
        !itemIdFromError &&
        typeof errorData?.message === 'object' &&
        errorData.message !== null
      ) {
        if (errorData.message.itemId) {
          itemIdFromError = errorData.message.itemId;
        }
      }
      if (!itemIdFromError && errorData?.itemId) {
        itemIdFromError = errorData.itemId;
      }

      const hasConflictMessage =
        errorMessage.includes('Já existe um item ativo') ||
        errorMessage.includes('Item ID:') ||
        errorMessage.includes('already exists');

      if (isConflict || hasConflictMessage) {
        console.log('[OpenFinanceModal] Item already exists, processing...', {
          itemIdFromError,
          itemDataFromDetails,
          errorMessage,
          errorData,
          fullError: error,
          isConflict,
          hasConflictMessage,
        });
        try {
          const existingAccount = accounts?.find((acc) => acc.id === variables.accountId);
          let itemId = itemIdFromError ?? existingAccount?.openiItemId;

          if (!itemId) {
            const itemIdRegex = /Item ID:\s*([a-f0-9-]+)/i;
            const itemIdMatch = itemIdRegex.exec(errorMessage);
            itemId = itemIdMatch?.[1];

            if (!itemId && typeof errorData === 'object' && errorData !== null) {
              const errorDataString = JSON.stringify(errorData);
              const itemIdMatchFromString = itemIdRegex.exec(errorDataString);
              itemId = itemIdMatchFromString?.[1];

              if (!itemId && typeof errorData.message === 'object' && errorData.message !== null) {
                const messageString = JSON.stringify(errorData.message);
                const itemIdMatchFromMessage = itemIdRegex.exec(messageString);
                itemId = itemIdMatchFromMessage?.[1];
              }
            }
          }

          if (itemId) {
            setCreatedItemId(itemId);
            setStep('oauth-waiting');

            if (itemDataFromDetails) {
              console.log(
                '[OpenFinanceModal] Using item data from error details:',
                itemDataFromDetails,
              );
              const status = itemDataFromDetails.status?.toLowerCase();

              if (status === 'waiting_user_input' && itemDataFromDetails.auth?.authUrl) {
                window.open(itemDataFromDetails.auth.authUrl, '_blank');
                toast.info('Redirecionando para autenticação...');
              } else if (status === 'connected') {
                toast.success('Conexão já existe e está ativa!');
                queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
                onSuccess?.();
              } else if (status === 'out_of_sync') {
                console.log('[OpenFinanceModal] Item is out_of_sync, requesting new connection...');
                toast.info('Item desincronizado. Solicitando nova conexão...');
                
                resyncItem(companyId, variables.accountId, itemId)
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
                return;
              } else if (status === 'pending') {
                toast.info('Item já existe. Aguardando preparação da autenticação...');
              } else {
                toast.info(`Item já existe com status: ${itemDataFromDetails.status}`);
              }
            } else {
              console.log(
                '[OpenFinanceModal] Item data not in details, will wait for SSE events',
                itemId,
              );
              toast.info('Item já existe. Aguardando atualização via SSE...');
              setCreatedItemId(itemId);
              setStep('oauth-waiting');
            }
          } else {
            console.error('[OpenFinanceModal] Could not extract itemId from error:', {
              errorData,
              errorMessage,
              existingAccount,
            });
            toast.error('Item já existe, mas não foi possível localizar o ID do item');
            setStep('connector-selection');
          }
        } catch (fetchError) {
          console.error('[OpenFinanceModal] Error fetching existing item:', fetchError);
          toast.error('Erro ao obter dados do item existente');
          setStep('connector-selection');
        }
      } else {
        toast.error(errorMessage);
        setStep('connector-selection');
      }
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

        const errorStatus = getErrorStatus(error);
        const errorData = getErrorData(error);

        console.log('[OpenFinanceModal] Error structure in catch:', {
          errorStatus,
          errorData,
          fullError: error,
        });

        const isConflict = errorStatus === 409;

        let errorMessage = 'Erro ao criar conexão Openi';
        if (typeof errorData?.message === 'string') {
          errorMessage = errorData.message;
        } else if (typeof errorData?.message === 'object' && errorData.message !== null) {
          if (errorData.message.message) {
            errorMessage = errorData.message.message;
          } else if (typeof errorData.message === 'object') {
            errorMessage = JSON.stringify(errorData.message);
          }
        }

        const hasConflictMessage =
          errorMessage.includes('Já existe um item ativo') ||
          errorMessage.includes('Item ID:') ||
          errorMessage.includes('already exists');

        if (isConflict || hasConflictMessage) {
          console.log('[OpenFinanceModal] Item already exists in catch block, processing...', {
            errorMessage,
            errorData,
          });

          try {
            let itemId: string | undefined;
            let itemDataFromDetails:
              | {
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
                }
              | undefined;

            if (
              isConflict &&
              errorData?.details &&
              Array.isArray(errorData.details) &&
              errorData.details.length > 0
            ) {
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
                itemDataFromDetails = detail;
                itemId = detail.id;
                console.log('[OpenFinanceModal] Extracted item data from details in catch:', {
                  id: detail.id,
                  status: detail.status,
                  hasAuthUrl: !!detail.auth?.authUrl,
                  connectorId: detail.connectorId,
                });
              }
            }

            if (!itemId) {
              if (
                typeof errorData?.message === 'object' &&
                errorData.message !== null &&
                errorData.message.itemId
              ) {
                itemId = errorData.message.itemId;
              } else if (errorData?.itemId) {
                itemId = errorData.itemId;
              } else {
                const existingAccount = accounts?.find((acc) => acc.id === accountId);
                itemId = existingAccount?.openiItemId ?? undefined;
              }
            }

            if (!itemId) {
              const itemIdRegex = /Item ID:\s*([a-f0-9-]+)/i;
              const itemIdMatch = itemIdRegex.exec(errorMessage);
              itemId = itemIdMatch?.[1];

              if (!itemId && typeof errorData === 'object' && errorData !== null) {
                const errorDataString = JSON.stringify(errorData);
                const itemIdMatchFromString = itemIdRegex.exec(errorDataString);
                itemId = itemIdMatchFromString?.[1];
              }
            }

            if (itemId) {
              setCreatedItemId(itemId);
              setStep('oauth-waiting');

              if (!accountId) {
                toast.error('Account ID não encontrado');
                setStep('connector-selection');
                return;
              }

              if (itemDataFromDetails) {
                console.log(
                  '[OpenFinanceModal] Using item data from error details in catch:',
                  itemDataFromDetails,
                );
                const status = itemDataFromDetails.status?.toLowerCase();

                if (status === 'waiting_user_input' && itemDataFromDetails.auth?.authUrl) {
                  window.open(itemDataFromDetails.auth.authUrl, '_blank');
                  toast.info('Redirecionando para autenticação...');
                } else if (status === 'connected') {
                  toast.success('Conexão já existe e está ativa!');
                  queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
                  onSuccess?.();
                } else if (status === 'out_of_sync') {
                  console.log('[OpenFinanceModal] Item is out_of_sync, requesting new connection...');
                  toast.info('Item desincronizado. Solicitando nova conexão...');
                  
                  if (!accountId) {
                    toast.error('Account ID não disponível para solicitar nova conexão');
                    setStep('connector-selection');
                    return;
                  }

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
                  return;
                } else if (status === 'pending') {
                  toast.info('Item já existe. Aguardando preparação da autenticação...');
                } else {
                  toast.info(`Item já existe com status: ${itemDataFromDetails.status}`);
                }
              } else {
                console.log(
                  '[OpenFinanceModal] Item data not in details, will wait for SSE events',
                  itemId,
                );
                toast.info('Item já existe. Aguardando atualização via SSE...');
                setCreatedItemId(itemId);
                setStep('oauth-waiting');
              }
            } else {
              console.error('[OpenFinanceModal] Could not extract itemId from error in catch:', {
                errorData,
                errorMessage,
              });
              toast.error('Item já existe, mas não foi possível localizar o ID do item');
              setStep('connector-selection');
            }
          } catch (fetchError) {
            console.error('[OpenFinanceModal] Error fetching existing item in catch:', fetchError);
            toast.error('Erro ao obter dados do item existente');
            setStep('connector-selection');
          }
        } else {
          toast.error(errorMessage);
          setStep('connector-selection');
        }
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
