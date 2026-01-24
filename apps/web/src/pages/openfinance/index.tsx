import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { useOpeniIntegration } from '@/pages/accounts/hooks/useOpeniIntegration';
import { OpeniConnectorSelector } from '@/components/accounts/OpeniConnectorSelector';
import { OpeniItemForm } from '@/components/accounts/OpeniItemForm';
import { OpeniItemStatus } from '@/components/accounts/OpeniItemStatus';
import { useAccounts } from '@/hooks/useAccounts';

export function OpenFinancePage() {
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [step, setStep] = useState<
    'select-account' | 'select-connector' | 'create-item' | 'view-status'
  >('select-account');

  const openiIntegration = useOpeniIntegration({
    companyId,
    accountId: selectedAccountId,
    onSuccess: () => {
      setStep('view-status');
    },
  });

  const accountsWithOpeni = accounts?.filter((acc) => acc.openiItemId && acc.openiItemStatus) ?? [];

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setStep('select-connector');
  };

  const handleCreateItem = () => {
    openiIntegration.handleCreateItem();
  };

  const handleBack = () => {
    if (step === 'select-connector' || step === 'view-status') {
      setStep('select-account');
      setSelectedAccountId(undefined);
    } else if (step === 'create-item') {
      setStep('select-connector');
    }
  };

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/home')} className="mb-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary-500/10">
              <Link2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-text dark:text-text-dark">Open Finance</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Conecte suas contas bancárias via Open Finance de forma segura e automatizada
          </p>
        </div>

        {step === 'select-account' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-4">
                Conectar Nova Conta
              </h2>
              <div className="bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Selecione uma conta para conectar via Open Finance:
                </p>
                <div className="space-y-2">
                  {accounts
                    ?.filter((acc) => !acc.openiItemId)
                    .map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleSelectAccount(account.id)}
                        className="w-full p-4 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-text dark:text-text-dark">
                              {account.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {account.institution}
                            </p>
                          </div>
                          <Link2 className="h-5 w-5 text-primary-500" />
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {accountsWithOpeni.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-4">
                  Conexões Existentes
                </h2>
                <div className="space-y-2">
                  {accountsWithOpeni.map((account) => (
                    <div
                      key={account.id}
                      className="p-4 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text dark:text-text-dark">
                            {account.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: {account.openiItemStatus}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAccountId(account.id);
                            setStep('view-status');
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'select-connector' && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={handleBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              Selecione o Banco
            </h2>
            <OpeniConnectorSelector
              connectors={openiIntegration.connectors}
              isLoading={openiIntegration.isLoadingConnectors}
              selectedConnector={openiIntegration.selectedConnector}
              onSearch={openiIntegration.handleSearchConnectors}
              onSelect={(connector) => {
                openiIntegration.handleSelectConnector(connector);
                setStep('create-item');
              }}
            />
          </div>
        )}

        {step === 'create-item' && openiIntegration.selectedConnector && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={handleBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              Conectar com {openiIntegration.selectedConnector.name}
            </h2>
            <OpeniItemForm
              connector={openiIntegration.selectedConnector}
              parameters={openiIntegration.itemParameters}
              isLoading={openiIntegration.isCreatingItem}
              onParameterChange={openiIntegration.handleParameterChange}
              onSubmit={handleCreateItem}
            />
          </div>
        )}

        {step === 'view-status' && selectedAccountId && openiIntegration.itemStatus && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={handleBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              Status da Conexão
            </h2>
            <OpeniItemStatus
              item={openiIntegration.itemStatus}
              isLoading={openiIntegration.isResyncingItem}
              onResync={() => {
                if (openiIntegration.itemStatus) {
                  openiIntegration.handleResyncItem(openiIntegration.itemStatus.id);
                }
              }}
              onOpenAuthUrl={openiIntegration.handleOpenAuthUrl}
            />
          </div>
        )}
      </div>
    </ViewDefault>
  );
}
