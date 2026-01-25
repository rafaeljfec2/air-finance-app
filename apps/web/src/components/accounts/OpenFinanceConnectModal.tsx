import { Modal } from '@/components/ui/Modal';
import { useOpenFinanceModal } from '@/pages/accounts/hooks/useOpenFinanceModal';
import { ModalHeader } from './OpenFinanceConnectModal.Header';
import { LoadingState } from './OpenFinanceConnectModal.LoadingState';
import { CpfInputStep } from './OpenFinanceConnectModal.CpfInputStep';
import { ConnectorSelectionStep } from './OpenFinanceConnectModal.ConnectorSelectionStep';
import { ExistingConnectionsStep } from './OpenFinanceConnectModal.ExistingConnectionsStep';
import { OAuthWaitingStep } from './OpenFinanceConnectModal.OAuthWaitingStep';
import { MODAL_MAX_WIDTH, MODAL_MAX_HEIGHT } from './OpenFinanceConnectModal.constants';

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

  const isLoading = isLoadingConnectors || isCreatingAccount || isCreatingItem || isInitializing || isLoadingExistingItems;
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
