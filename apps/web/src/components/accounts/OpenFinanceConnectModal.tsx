import { useQuery } from '@tanstack/react-query';

import { Modal } from '@/components/ui/Modal';
import { useOpenFinanceModal } from '@/pages/accounts/hooks/useOpenFinanceModal';
import { openBankingService } from '@/services/subscriptionService';

import { ConnectorSelectionStep } from './OpenFinanceConnectModal.ConnectorSelectionStep';
import { MODAL_MAX_WIDTH, MODAL_MAX_HEIGHT } from './OpenFinanceConnectModal.constants';
import { CpfInputStep } from './OpenFinanceConnectModal.CpfInputStep';
import { ExistingConnectionsStep } from './OpenFinanceConnectModal.ExistingConnectionsStep';
import { ModalHeader } from './OpenFinanceConnectModal.Header';
import { LoadingState } from './OpenFinanceConnectModal.LoadingState';
import { OAuthWaitingStep } from './OpenFinanceConnectModal.OAuthWaitingStep';

function SlotInfoBanner({
  entitlement,
}: Readonly<{
  entitlement: { entitledSlots: number; usedSlots: number; isGodBypass: boolean };
}>) {
  const available = entitlement.entitledSlots - entitlement.usedSlots;
  const hasSlots = available > 0;

  return (
    <div
      className={`mx-6 mt-3 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
        hasSlots
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
      }`}
    >
      <span>
        {available > 0
          ? `${available} de ${entitlement.entitledSlots} conta(s) disponível(is)`
          : `Nenhuma conta disponível (${entitlement.usedSlots}/${entitlement.entitledSlots} usadas)`}
      </span>
      {!hasSlots && <span className="text-xs underline cursor-pointer">Comprar mais</span>}
    </div>
  );
}

interface OpenFinanceConnectModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly companyId: string;
  readonly openiTenantId?: string;
  readonly companyDocument?: string;
  readonly onSuccess?: () => void;
}

export function OpenFinanceConnectModal({
  open,
  onClose,
  companyId,
  openiTenantId,
  companyDocument,
  onSuccess,
}: Readonly<OpenFinanceConnectModalProps>) {
  const {
    step,
    cpfCnpj,
    connectors,
    isLoadingConnectors,
    connectorsError,
    selectedConnector,
    existingItems,
    isLoadingExistingItems,
    isInitializing,
    itemStatus,
    isLoadingItemStatus,
    isCreatingAccount,
    isCreatingItem,
    sseConnectionStatus,
    sseError,
    handleCpfCnpjChange,
    handleSearchConnectors,
    handleConnectorSearch,
    handleSelectConnector,
    handleOpenAuthUrl,
    handleAddAnotherConnection,
    handleCancel,
    handleClose,
    validateCpfCnpj,
  } = useOpenFinanceModal({
    companyId,
    openiTenantId,
    companyDocument,
    onSuccess: () => {
      handleClose();
      onSuccess?.();
    },
    open,
  });

  const { data: entitlement } = useQuery({
    queryKey: ['open-banking-entitlement', companyId],
    queryFn: () => openBankingService.getEntitlement(companyId),
    enabled: open && !!companyId,
    staleTime: 30_000,
  });

  const isLoading =
    isLoadingConnectors ||
    isCreatingAccount ||
    isCreatingItem ||
    isInitializing ||
    isLoadingExistingItems;
  const canClose = !isLoading && step !== 'oauth-waiting';

  const handleModalClose = () => {
    if (canClose) {
      handleClose();
      onClose();
    }
  };

  const modalClassName = `${MODAL_MAX_WIDTH} bg-card dark:bg-card-dark p-0 flex flex-col h-auto ${MODAL_MAX_HEIGHT}`;

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      title=""
      dismissible={canClose}
      className={modalClassName}
    >
      <div className="flex flex-col min-h-0">
        <ModalHeader />

        {entitlement && <SlotInfoBanner entitlement={entitlement} />}

        <div className="px-6 py-4 min-h-0 flex-1 overflow-y-auto">
          {isInitializing || isLoadingExistingItems ? (
            <LoadingState
              message="Carregando informações..."
              subMessage="Aguarde enquanto verificamos suas conexões..."
            />
          ) : (
            <>
              {step === 'existing-connections' && (
                <ExistingConnectionsStep
                  items={existingItems}
                  isLoading={isLoadingExistingItems}
                  onAddAnother={handleAddAnotherConnection}
                  onCancel={() => {
                    handleCancel();
                    onClose();
                  }}
                />
              )}

              {step === 'cpf-input' && (
                <CpfInputStep
                  cpfCnpj={cpfCnpj}
                  onCpfCnpjChange={handleCpfCnpjChange}
                  onSearchConnectors={handleSearchConnectors}
                  validateCpfCnpj={validateCpfCnpj}
                />
              )}

              {step === 'connector-selection' && (
                <ConnectorSelectionStep
                  connectors={connectors}
                  isLoadingConnectors={isLoadingConnectors}
                  connectorsError={connectorsError}
                  selectedConnector={selectedConnector}
                  onSearch={handleConnectorSearch}
                  onSelect={handleSelectConnector}
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
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
