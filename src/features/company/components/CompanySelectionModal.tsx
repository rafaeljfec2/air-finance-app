import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { Modal } from '@/components/ui/Modal';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { companyService } from '@/services/company';
import { useAuthStore } from '@/stores/auth';
import { formatCNPJ } from '@/utils/formatCNPJ';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function CompanySelectionModal() {
  const { user } = useAuthStore();
  const { activeCompany, changeActiveCompany, clearActiveCompany } = useActiveCompany();

  const {
    data: companies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => companyService.getUserCompanies(),
    enabled: !!user,
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const hasCompanies = Array.isArray(companies) && companies.length > 0;
  const shouldShowModal = !!user && !activeCompany;

  // Memoize first company ID to avoid unnecessary re-renders
  const firstCompanyId = useMemo(() => {
    return hasCompanies && companies[0]?.id ? companies[0].id : null;
  }, [hasCompanies, companies]);

  // Stabilize clearActiveCompany callback to avoid infinite loops
  const handleClearActiveCompany = useCallback(() => {
    clearActiveCompany();
  }, [clearActiveCompany]);

  useEffect(() => {
    if (!user) {
      setSelectedCompanyId('');
      handleClearActiveCompany();
      return;
    }

    if (activeCompany?.id) {
      setSelectedCompanyId(activeCompany.id);
      return;
    }

    if (firstCompanyId) {
      setSelectedCompanyId(firstCompanyId);
    }
  }, [user, activeCompany?.id, firstCompanyId, handleClearActiveCompany]);

  const handleConfirmSelection = () => {
    if (!selectedCompanyId) return;
    if (!Array.isArray(companies) || companies.length === 0) return;
    const selectedCompany = companies.find((company) => company?.id === selectedCompanyId);
    if (!selectedCompany) return;
    changeActiveCompany(selectedCompany);
  };

  const modalTitle = useMemo(() => {
    if (isLoading) return 'Carregando empresas';
    if (!hasCompanies) return 'Nenhuma empresa encontrada';
    return 'Selecione uma empresa';
  }, [isLoading, hasCompanies]);

  // Convert companies to ComboBox options
  const companyOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      Array.isArray(companies)
        ? companies.map((company) => ({
            value: company.id,
            label: company.name || 'Sem nome',
          }))
        : [],
    [companies],
  );

  // Format selected value to show name and CNPJ
  const formatSelectedCompany = (option: ComboBoxOption<string> | undefined) => {
    if (!option) return 'Selecione uma empresa';
    const company = Array.isArray(companies) ? companies.find((c) => c.id === option.value) : null;
    if (!company) return option.label;
    return `${company.name || 'Sem nome'} - ${formatCNPJ(company.cnpj || '')}`;
  };

  // Custom render for company items (name + CNPJ in two lines)
  const renderCompanyItem = (option: ComboBoxOption<string>) => {
    const company = Array.isArray(companies) ? companies.find((c) => c.id === option.value) : null;
    if (!company) return <span>{option.label}</span>;

    return (
      <div className="flex flex-col">
        <span className="text-sm">{company.name || 'Sem nome'}</span>
        <span className="text-xs opacity-80">{formatCNPJ(company.cnpj || '')}</span>
      </div>
    );
  };

  return (
    <Modal
      open={shouldShowModal}
      onClose={() => {}}
      dismissible={false}
      title={modalTitle}
      className="max-w-lg p-8"
    >
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Escolha a empresa que deseja gerenciar. Essa definição pode ser alterada depois no seletor
          do cabeçalho.
        </p>

        {isLoading && (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-lg bg-muted/40 py-6">
            <Loading size="large" />
            <p className="text-sm text-muted-foreground">
              Carregando empresas vinculadas ao seu usuário...
            </p>
          </div>
        )}

        {!isLoading && isError && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Não foi possível carregar as empresas. Tente novamente em instantes.
          </div>
        )}

        {!isLoading && !isError && !hasCompanies && (
          <div className="rounded-lg bg-muted/40 px-4 py-5 text-center text-sm text-muted-foreground">
            Nenhuma empresa está vinculada à sua conta. Solicite o cadastro de uma empresa para
            continuar utilizando a plataforma.
          </div>
        )}

        {!isLoading && !isError && hasCompanies && (
          <div className="space-y-5">
            <div className="space-y-2">
              <ComboBox
                label="Empresa"
                options={companyOptions}
                value={selectedCompanyId}
                onValueChange={(value) => setSelectedCompanyId(value ?? '')}
                placeholder="Selecione uma empresa"
                searchable
                searchPlaceholder="Buscar empresa..."
                formatSelectedValue={formatSelectedCompany}
                renderItem={renderCompanyItem}
                maxHeight="max-h-56"
              />
              <p className="text-xs text-muted-foreground">
                Você pode alterar essa seleção a qualquer momento pelo menu superior.
              </p>
            </div>

            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedCompanyId}
              className="w-full h-11 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Continuar
            </Button>
          </div>
        )}

        {!isLoading && isError && (
          <Button onClick={() => refetch()} className="w-full" variant="default">
            Tentar novamente
          </Button>
        )}
      </div>
    </Modal>
  );
}
