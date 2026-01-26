import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getConnectors, getItems, type OpeniConnector, type OpeniItem } from '@/services/openiService';
import { useOpenFinanceModalState } from './useOpenFinanceModalState';
import { useOpenFinanceMutations } from './useOpenFinanceMutations';
import { useOpeniAccountImport } from './useOpeniAccountImport';
import { useOpeniSseHandler } from './useOpeniSseHandler';
import { useOpeniAutoImport } from './useOpeniAutoImport';
import { processConflictError } from './handlers/openiStatusHandlers';
import { useAccounts } from '@/hooks/useAccounts';

interface UseOpenFinanceModalProps {
  companyId: string;
  openiTenantId?: string;
  companyDocument?: string;
  onSuccess?: () => void;
  open?: boolean;
}

export function useOpenFinanceModal({
  companyId,
  openiTenantId,
  companyDocument,
  onSuccess,
  open = false,
}: UseOpenFinanceModalProps) {
  const queryClient = useQueryClient();
  const { accounts } = useAccounts();

  const {
    data: existingItems,
    isLoading: isLoadingExistingItems,
    isFetching: isFetchingExistingItems,
  } = useQuery<OpeniItem[]>({
    queryKey: ['openi-items', companyId],
    queryFn: () => getItems(companyId),
    enabled: !!companyId && !!open && !!openiTenantId,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const {
    step,
    setStep,
    cpfCnpj,
    setCpfCnpj,
    selectedConnector,
    setSelectedConnector,
    createdAccountId,
    setCreatedAccountId,
    createdItemId,
    setCreatedItemId,
    isInitializing,
  } = useOpenFinanceModalState({
    open,
    companyId,
    openiTenantId,
    companyDocument,
    existingItems,
    isLoadingExistingItems,
    isFetchingExistingItems,
  });

  useOpeniAutoImport({
    open,
    existingItems,
    isLoadingExistingItems,
    companyId,
  });

  const { importAccountsWithRetry } = useOpeniAccountImport({
    companyId,
    onSuccess,
  });

  const {
    itemStatus,
    isLoadingItemStatus,
    sseConnectionStatus,
    sseError,
  } = useOpeniSseHandler({
    companyId,
    createdItemId,
    step,
    onImportAccounts: importAccountsWithRetry,
    isPageVisible: open,
  });

  const { createAccountMutation, createItemMutation } = useOpenFinanceMutations({
    companyId,
    onSuccess,
    setCreatedAccountId,
    setCreatedItemId,
    setStep,
  });

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

  const validateCpfCnpj = useCallback((value: string): boolean => {
    const cleaned = value.replaceAll(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 14;
  }, []);

  const handleCpfCnpjChange = useCallback((value: string) => {
    const cleaned = value.replaceAll(/\D/g, '');
    setCpfCnpj(cleaned);
  }, [setCpfCnpj]);

  const handleSearchConnectors = useCallback(() => {
    if (!validateCpfCnpj(cpfCnpj)) {
      toast.error('CPF/CNPJ inválido. Digite 11 dígitos para CPF ou 14 para CNPJ.');
      return;
    }
    setStep('connector-selection');
  }, [cpfCnpj, validateCpfCnpj, setStep]);

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
        processConflictError({
          error,
          context: {
            variables: { accountId: accountId ?? '', connectorId: connector.id, parameters: {} },
            accounts,
            companyId,
          },
          queryClient,
          onSuccess,
          setCreatedItemId,
          setStep,
        });
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
      setSelectedConnector,
      setStep,
      setCreatedAccountId,
      setCreatedItemId,
    ],
  );

  const handleOpenAuthUrl = useCallback((authUrl: string) => {
    window.open(authUrl, '_blank');
  }, []);

  const handleAddAnotherConnection = useCallback(() => {
    setStep('cpf-input');
  }, [setStep]);

  const handleCancel = useCallback(() => {
    setStep('cpf-input');
    setCpfCnpj('');
    setSelectedConnector(null);
    setCreatedAccountId(null);
    setCreatedItemId(null);
  }, [setStep, setCpfCnpj, setSelectedConnector, setCreatedAccountId, setCreatedItemId]);

  const handleClose = useCallback(() => {
    setStep('cpf-input');
    setCpfCnpj('');
    setSelectedConnector(null);
    setCreatedAccountId(null);
    setCreatedItemId(null);
  }, [setStep, setCpfCnpj, setSelectedConnector, setCreatedAccountId, setCreatedItemId]);

  return {
    step,
    cpfCnpj,
    connectors: connectors ?? [],
    isLoadingConnectors,
    connectorsError,
    selectedConnector,
    createdAccountId,
    createdItemId,
    existingItems: existingItems ?? [],
    isLoadingExistingItems,
    isInitializing,
    itemStatus,
    isLoadingItemStatus,
    sseConnectionStatus,
    sseError,
    isCreatingAccount: createAccountMutation.isPending,
    isCreatingItem: createItemMutation.isPending,
    handleCpfCnpjChange,
    handleSearchConnectors,
    handleConnectorSearch,
    handleSelectConnector,
    handleOpenAuthUrl,
    handleAddAnotherConnection,
    handleCancel,
    handleClose,
    validateCpfCnpj,
  };
}
