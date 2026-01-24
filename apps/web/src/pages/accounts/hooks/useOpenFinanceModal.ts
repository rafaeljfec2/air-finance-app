import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getConnectors,
  createItem,
  getItemStatus,
  type OpeniConnector,
  type OpeniItemResponse,
} from '@/services/openiService';
import { createAccount, type CreateAccount } from '@/services/accountService';
import { useAccounts } from '@/hooks/useAccounts';

interface UseOpenFinanceModalProps {
  companyId: string;
  openiTenantId?: string;
  companyDocument?: string;
  onSuccess?: () => void;
  open?: boolean;
}

type ModalStep = 'cpf-input' | 'connector-selection' | 'creating-item' | 'oauth-waiting';

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
    const cleaned = cpfCnpj.replace(/\D/g, '');
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
      !!companyId &&
      step === 'connector-selection' &&
      (!!getDocumentType() || !!openiTenantId),
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
    onSuccess: (item) => {
      setCreatedItemId(item.id);
      setStep('oauth-waiting');
      if (item.status === 'WAITING_USER_INPUT' && item.auth?.authUrl) {
        window.open(item.auth.authUrl, '_blank');
        toast.info('Redirecionando para autenticação...');
      } else if (item.status === 'CONNECTED') {
        toast.success('Conexão estabelecida com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccess?.();
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Erro ao criar conexão Openi';
      toast.error(errorMessage);
      setStep('connector-selection');
    },
  });

  const getItemStatusQuery = useQuery<OpeniItemResponse>({
    queryKey: ['openi-item-status', companyId, createdAccountId, createdItemId],
    queryFn: () => {
      if (!createdAccountId || !createdItemId) {
        throw new Error('Account ID and Item ID are required');
      }
      return getItemStatus(companyId, createdAccountId, createdItemId);
    },
    enabled: !!companyId && !!createdAccountId && !!createdItemId && step === 'oauth-waiting',
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'PENDING' || data?.status === 'WAITING_USER_INPUT') {
        return 5000;
      }
      if (data?.status === 'CONNECTED') {
        queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
        onSuccess?.();
        return false;
      }
      return false;
    },
  });

  const validateCpfCnpj = useCallback((value: string): boolean => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 14;
  }, []);

  const handleCpfCnpjChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
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

      try {
        let accountId = createdAccountId;

        if (!accountId) {
          const existingAccount = accounts?.find(
            (acc) => !acc.openiItemId && acc.bankingTenantId,
          );

          if (existingAccount) {
            accountId = existingAccount.id;
            setCreatedAccountId(accountId);
          } else {
            const newAccount = await createAccountMutation.mutateAsync({
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
        console.error('Error creating Openi item:', error);
      }
    },
    [
      cpfCnpj,
      companyDocument,
      createdAccountId,
      accounts,
      createAccountMutation,
      createItemMutation,
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
    itemStatus: getItemStatusQuery.data,
    isLoadingItemStatus: getItemStatusQuery.isLoading,
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
