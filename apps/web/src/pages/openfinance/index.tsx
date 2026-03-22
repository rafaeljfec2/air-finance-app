import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenBankingPaywallModal } from '@/components/accounts/OpenBankingPaywallModal';
import { LoadingState } from '@/components/accounts/OpenFinanceConnectModal.LoadingState';
import { OAuthWaitingStep } from '@/components/accounts/OpenFinanceConnectModal.OAuthWaitingStep';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { ViewDefault } from '@/layouts/ViewDefault';
import {
  processConflictError,
  type ModalStep,
} from '@/pages/accounts/hooks/handlers/openiStatusHandlers';
import { useOpenFinanceMutations } from '@/pages/accounts/hooks/useOpenFinanceMutations';
import { useOpeniAccountImport } from '@/pages/accounts/hooks/useOpeniAccountImport';
import { useOpeniSseHandler } from '@/pages/accounts/hooks/useOpeniSseHandler';
import {
  getConnectors,
  getItems,
  type OpeniConnector,
  type OpeniItem,
} from '@/services/openiService';
import { openBankingService } from '@/services/subscriptionService';
import { useCompanyStore } from '@/stores/company';

import { PageExistingConnections, PageCpfInput, PageConnectorSelection } from './components';

type PageStep =
  | 'loading'
  | 'existing-connections'
  | 'cpf-input'
  | 'connector-selection'
  | 'creating-item'
  | 'oauth-waiting';

function PageHeader() {
  return (
    <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-border dark:border-border-dark">
      <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-400/10">
        <Link2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">
          Conectar com Open Finance
        </h2>
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Conecte suas contas bancárias via Open Finance
        </p>
      </div>
    </div>
  );
}

export function OpenFinancePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeCompany } = useCompanyStore();
  const { accounts } = useAccounts();

  const companyId = activeCompany?.id ?? '';
  const openiTenantId = activeCompany?.openiTenantId;
  const companyDocument = activeCompany?.cnpj ?? '';

  const [step, setStep] = useState<PageStep>('loading');
  const [cpfCnpj, setCpfCnpj] = useState(companyDocument);
  const [selectedConnector, setSelectedConnector] = useState<OpeniConnector | null>(null);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const importedItemIdsRef = useRef<Set<string>>(new Set());
  const isAutoImportingRef = useRef(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const hasOpeniTenant = Boolean(openiTenantId?.trim());
  const isCompanyLoaded = Boolean(activeCompany);

  const { data: entitlement, isLoading: isLoadingEntitlement } = useQuery({
    queryKey: ['open-banking-entitlement', companyId],
    queryFn: () => openBankingService.getEntitlement(companyId),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const { data: existingItems, isLoading: isLoadingExistingItems } = useQuery<OpeniItem[]>({
    queryKey: ['openi-items', companyId],
    queryFn: () => getItems(companyId),
    enabled: !!companyId && hasOpeniTenant,
    staleTime: 30_000,
    retry: false,
  });

  useEffect(() => {
    if (!isCompanyLoaded) {
      setStep('loading');
      return;
    }

    if (isLoadingEntitlement) {
      setStep('loading');
      return;
    }

    if (entitlement && entitlement.entitledSlots === 0 && !entitlement.isGodBypass) {
      setShowPaywall(true);
      setStep('loading');
      return;
    }

    if (!hasOpeniTenant) {
      if (!hasInitialized) {
        setStep('cpf-input');
        setHasInitialized(true);
      }
      return;
    }

    if (isLoadingExistingItems) {
      setStep('loading');
      return;
    }

    if (!hasInitialized && existingItems !== undefined) {
      setStep(existingItems.length > 0 ? 'existing-connections' : 'cpf-input');
      setHasInitialized(true);
    }
  }, [
    isCompanyLoaded,
    hasOpeniTenant,
    isLoadingExistingItems,
    existingItems,
    hasInitialized,
    isLoadingEntitlement,
    entitlement,
  ]);

  useEffect(() => {
    if (companyDocument) {
      setCpfCnpj(companyDocument);
    }
  }, [companyDocument]);

  const onSuccess = useCallback(() => {
    navigate('/accounts');
  }, [navigate]);

  // For manual connection flow - redirects to accounts after success
  const { importAccountsWithRetry } = useOpeniAccountImport({
    companyId,
    onSuccess,
  });

  // For auto-import - stays on page, just refreshes queries
  const { importAccountsWithRetry: importAccountsSilent } = useOpeniAccountImport({
    companyId,
    onSuccess: undefined, // No redirect
  });

  useEffect(() => {
    if (!existingItems || existingItems.length === 0) return;
    if (isAutoImportingRef.current) return;

    const syncedItems = existingItems.filter(
      (item) =>
        item.status.toUpperCase() === 'SYNCED' && !importedItemIdsRef.current.has(item.itemId),
    );

    if (syncedItems.length === 0) return;

    isAutoImportingRef.current = true;

    const processSequentially = async () => {
      for (const item of syncedItems) {
        if (importedItemIdsRef.current.has(item.itemId)) continue;
        importedItemIdsRef.current.add(item.itemId);

        try {
          await importAccountsSilent(item.itemId, item.status);
        } catch (error) {
          console.error('[OpenFinancePage] Error importing accounts for item:', item.itemId, error);
        }

        if (syncedItems.indexOf(item) < syncedItems.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      isAutoImportingRef.current = false;
    };

    processSequentially();
  }, [existingItems, importAccountsSilent]);

  const sseStep: ModalStep = step === 'loading' ? 'cpf-input' : step;

  const { itemStatus, isLoadingItemStatus, sseConnectionStatus, sseError } = useOpeniSseHandler({
    companyId,
    createdItemId,
    step: sseStep,
    onImportAccounts: importAccountsWithRetry,
  });

  const { createItemMutation } = useOpenFinanceMutations({
    companyId,
    onSuccess,
    setCreatedAccountId: () => {},
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
      !!companyId && step === 'connector-selection' && (!!getDocumentType() || hasOpeniTenant),
    staleTime: 5 * 60 * 1000,
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

      try {
        const cpfField = connector.rules.find((r) => r.field === 'cpf' || r.field === 'document');
        const fieldName = cpfField?.field ?? 'cpf';
        const documentToUse = cpfCnpj || companyDocument || '';

        await createItemMutation.mutateAsync({
          connectorId: connector.id,
          parameters: {
            [fieldName]: documentToUse,
          },
        });
      } catch (error) {
        console.error('[OpenFinancePage] Error creating Openi item:', error);
        processConflictError({
          error,
          context: {
            variables: { accountId: '', connectorId: connector.id, parameters: {} },
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
    [companyId, cpfCnpj, companyDocument, accounts, createItemMutation, queryClient, onSuccess],
  );

  const handleOpenAuthUrl = useCallback((authUrl: string) => {
    window.open(authUrl, '_blank');
  }, []);

  const handleAddAnotherConnection = useCallback(() => {
    setStep('cpf-input');
  }, []);

  const handleBackToExistingConnections = useCallback(() => {
    setStep('existing-connections');
  }, []);

  const handleBackToCpfInput = useCallback(() => {
    setStep('cpf-input');
  }, []);

  const hasExistingConnections = (existingItems?.length ?? 0) > 0;

  const isLoading = isLoadingConnectors || createItemMutation.isPending;

  return (
    <ViewDefault>
      {companyId && showPaywall && (
        <OpenBankingPaywallModal
          open={showPaywall}
          onClose={() => {
            setShowPaywall(false);
            navigate('/accounts');
          }}
          companyId={companyId}
          currentSlots={entitlement?.entitledSlots ?? 0}
          usedSlots={entitlement?.usedSlots ?? 0}
        />
      )}

      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-4 lg:py-6 max-w-2xl">
          <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
            <PageHeader />

            <div className="px-6 py-4">
              {step === 'loading' && (
                <LoadingState
                  message="Carregando informações..."
                  subMessage="Aguarde enquanto verificamos suas conexões..."
                />
              )}

              {step === 'existing-connections' && (
                <PageExistingConnections
                  items={existingItems ?? []}
                  onAddAnother={handleAddAnotherConnection}
                />
              )}

              {step === 'cpf-input' && (
                <PageCpfInput
                  cpfCnpj={cpfCnpj}
                  onCpfCnpjChange={handleCpfCnpjChange}
                  onSearchConnectors={handleSearchConnectors}
                  validateCpfCnpj={validateCpfCnpj}
                  onBack={handleBackToExistingConnections}
                  showBackButton={hasExistingConnections}
                />
              )}

              {step === 'connector-selection' && (
                <PageConnectorSelection
                  connectors={connectors ?? []}
                  isLoadingConnectors={isLoadingConnectors}
                  connectorsError={connectorsError}
                  selectedConnector={selectedConnector}
                  onSearch={handleConnectorSearch}
                  onSelect={handleSelectConnector}
                  onBack={handleBackToCpfInput}
                />
              )}

              {step === 'creating-item' && (
                <LoadingState
                  message="Criando conexão com o banco..."
                  subMessage="Aguarde enquanto preparamos a conexão..."
                />
              )}

              {step === 'oauth-waiting' && (
                <OAuthWaitingStep
                  itemStatus={itemStatus}
                  isLoadingItemStatus={isLoadingItemStatus}
                  sseConnectionStatus={sseConnectionStatus}
                  sseError={sseError}
                  onOpenAuthUrl={handleOpenAuthUrl}
                />
              )}
            </div>
          </div>

          {!isLoading &&
            step !== 'oauth-waiting' &&
            step !== 'creating-item' &&
            step !== 'loading' && (
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  Como funciona o Open Finance?
                </h3>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1.5">
                  <li>✅ Seus dados são compartilhados de forma segura e criptografada</li>
                  <li>✅ Você autoriza diretamente no site do seu banco</li>
                  <li>✅ Novas transações são sincronizadas automaticamente</li>
                  <li>✅ Seu extrato é sincronizado entre 6h e 24h após a conexão</li>
                  <li>✅ Você pode revogar o acesso a qualquer momento no site do seu banco</li>
                </ul>
              </div>
            )}
        </div>
      </div>
    </ViewDefault>
  );
}
