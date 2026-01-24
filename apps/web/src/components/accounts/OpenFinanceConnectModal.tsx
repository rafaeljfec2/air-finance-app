import { type ChangeEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Loader2, CheckCircle2, AlertCircle, Clock, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { OpeniConnectorSelector } from './OpeniConnectorSelector';
import { useOpenFinanceModal } from '@/pages/accounts/hooks/useOpenFinanceModal';

const MODAL_MAX_HEIGHT = 'max-h-[85vh]';
const MODAL_MAX_WIDTH = 'max-w-2xl';
const BUTTON_HEIGHT = 'h-10';
const BUTTON_FULL_WIDTH = 'w-full';

interface OpenFinanceConnectModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  openiTenantId?: string;
  companyDocument?: string;
  onSuccess?: () => void;
}

interface CpfInputStepProps {
  cpfCnpj: string;
  onCpfCnpjChange: (value: string) => void;
  onSearchConnectors: () => void;
  validateCpfCnpj: (value: string) => boolean;
}

function ModalHeader() {
  return (
    <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
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

function CpfInputStep({
  cpfCnpj,
  onCpfCnpjChange,
  onSearchConnectors,
  validateCpfCnpj,
}: Readonly<CpfInputStepProps>) {
  const formatCpfCnpj = (value: string): string => {
    const cleaned = value.replaceAll(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, '');
    onCpfCnpjChange(value);
  };

  const isButtonDisabled = !validateCpfCnpj(cpfCnpj);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cpfCnpj" className="text-sm font-medium text-text dark:text-text-dark">
          CPF/CNPJ *
        </Label>
        <Input
          id="cpfCnpj"
          type="text"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={formatCpfCnpj(cpfCnpj)}
          onChange={handleInputChange}
          maxLength={18}
          className="h-10"
        />
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Digite seu CPF (11 dígitos) ou CNPJ (14 dígitos)
        </p>
      </div>

      <Button
        onClick={onSearchConnectors}
        disabled={isButtonDisabled}
        className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} bg-purple-600 hover:bg-purple-700 text-white font-medium`}
      >
        <Link2 className="h-4 w-4 mr-2" />
        Buscar Bancos
      </Button>
    </div>
  );
}

function LoadingState({ message, subMessage }: Readonly<{ message: string; subMessage?: string }>) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
      <p className="text-sm font-medium text-text dark:text-text-dark">{message}</p>
      {subMessage && (
        <p className="text-xs text-muted-foreground dark:text-gray-400">{subMessage}</p>
      )}
    </div>
  );
}

function ConnectionStatusIndicator({
  status,
  message,
}: Readonly<{ status: 'connecting' | 'connected' | 'error' | 'reconnecting' | 'disconnected' | 'closed'; message?: string }>) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          label: 'Conectado',
        };
      case 'connecting':
      case 'reconnecting':
        return {
          icon: Loader2,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          label: status === 'reconnecting' ? 'Reconectando...' : 'Conectando...',
        };
      case 'error':
        return {
          icon: WifiOff,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          label: 'Erro na conexão',
        };
      case 'disconnected':
      case 'closed':
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Icon
            className={`h-4 w-4 ${config.color} ${status === 'connecting' || status === 'reconnecting' ? 'animate-spin' : ''}`}
          />
          <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
        </div>
        {message && (
          <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1 ml-6">{message}</p>
        )}
      </CardContent>
    </Card>
  );
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

  const isLoading = isLoadingConnectors || isCreatingAccount || isCreatingItem;
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
          {step === 'cpf-input' && (
            <CpfInputStep
              cpfCnpj={cpfCnpj}
              onCpfCnpjChange={handleCpfCnpjChange}
              onSearchConnectors={handleSearchConnectors}
              validateCpfCnpj={validateCpfCnpj}
            />
          )}

          {step === 'connector-selection' && (
            <div className="space-y-4">
              {connectorsError ? (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    Erro ao carregar bancos. Tente novamente.
                  </p>
                </div>
              ) : (
                <OpeniConnectorSelector
                  connectors={connectors}
                  isLoading={isLoadingConnectors}
                  selectedConnector={selectedConnector}
                  onSearch={handleConnectorSearch}
                  onSelect={handleSelectConnector}
                />
              )}
            </div>
          )}

          {step === 'creating-item' && (
            <LoadingState
              message="Criando conexão com o banco..."
              subMessage="Aguarde enquanto preparamos a conexão..."
            />
          )}

          {step === 'oauth-waiting' && (
            <div className="space-y-4">
              {!itemStatus && isLoadingItemStatus && (
                <LoadingState
                  message="Aguardando preparação da autenticação..."
                  subMessage="Estamos preparando o link de autenticação do banco..."
                />
              )}

              {itemStatus && (
                <div className="space-y-4">
                  {itemStatus.status === 'WAITING_USER_INPUT' && (
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <CardTitle className="text-sm text-blue-900 dark:text-blue-100">
                              Aguardando Autenticação
                            </CardTitle>
                            <CardDescription className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                              É necessário autenticar no site do banco
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        {itemStatus.auth?.authUrl && (
                          <>
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              Clique no botão abaixo para ser redirecionado ao site do banco e completar a autenticação:
                            </p>
                            <Button
                              onClick={() => handleOpenAuthUrl(itemStatus.auth!.authUrl)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Autenticar no Banco
                            </Button>
                            {itemStatus.auth.expiresAt && (
                              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                                Link expira em: {new Date(itemStatus.auth.expiresAt).toLocaleString('pt-BR')}
                              </p>
                            )}
                            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                Complete a autenticação no site do banco. Após autenticar, volte para esta página e aguarde a conexão ser estabelecida.
                              </p>
                            </div>
                          </>
                        )}
                        {!itemStatus.auth?.authUrl && (
                          <p className="text-xs text-blue-800 dark:text-blue-200">
                            Complete a autenticação no site do banco. Após autenticar, volte para esta página e aguarde a conexão ser estabelecida.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {itemStatus.status === 'PENDING' && (
                    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                              Preparando autenticação...
                            </p>
                            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                              Aguarde enquanto preparamos o link de autenticação. Isso pode levar alguns segundos.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {itemStatus.status === 'CONNECTED' && (
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                              Conexão estabelecida com sucesso!
                            </p>
                            <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                              Sua conta bancária foi conectada e está sendo sincronizada.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {itemStatus.status !== 'CONNECTED' &&
                    itemStatus.status !== 'WAITING_USER_INPUT' &&
                    itemStatus.status !== 'PENDING' && (
                      <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Processando conexão...
                              </p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                                Aguarde enquanto processamos sua conexão. Você será notificado quando estiver concluída.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {sseConnectionStatus &&
                    sseConnectionStatus !== 'disconnected' &&
                    sseConnectionStatus !== 'closed' &&
                    itemStatus.status !== 'CONNECTED' && (
                      <ConnectionStatusIndicator
                        status={sseConnectionStatus}
                        message={
                          sseConnectionStatus === 'connected'
                            ? 'Conectado ao servidor. Aguardando atualizações...'
                            : sseConnectionStatus === 'connecting'
                              ? 'Conectando ao servidor...'
                              : sseConnectionStatus === 'reconnecting'
                                ? 'Reconectando ao servidor...'
                                : sseError
                                  ? 'Erro na conexão com o servidor'
                                  : undefined
                        }
                      />
                    )}
                </div>
              )}

              {!itemStatus && !isLoadingItemStatus && (
                <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Aguardando informações da conexão...
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                          Estamos aguardando atualizações sobre o status da sua conexão.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
