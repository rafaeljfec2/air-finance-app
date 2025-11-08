import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loading } from '@/components/Loading';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuthStore } from '@/stores/auth';
import { companyService } from '@/services/company';
import { Company } from '@/types/company';
import { useQuery } from '@tanstack/react-query';
import { formatCNPJ } from '@/utils/formatCNPJ';

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
  const hasCompanies = companies.length > 0;
  const shouldShowModal = !!user && !activeCompany;

  useEffect(() => {
    if (!user) {
      setSelectedCompanyId('');
      clearActiveCompany();
      return;
    }

    if (activeCompany) {
      setSelectedCompanyId(activeCompany.id);
      return;
    }

    if (hasCompanies) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [user, activeCompany, hasCompanies, companies, clearActiveCompany]);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const handleConfirmSelection = () => {
    if (!selectedCompanyId) return;
    const selectedCompany = companies.find((company) => company.id === selectedCompanyId);
    if (!selectedCompany) return;
    changeActiveCompany(selectedCompany);
  };

  const modalTitle = useMemo(() => {
    if (isLoading) return 'Carregando empresas';
    if (!hasCompanies) return 'Nenhuma empresa encontrada';
    return 'Selecione uma empresa';
  }, [isLoading, hasCompanies]);

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
              <p className="text-sm font-medium text-foreground">Empresa</p>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="h-11 w-full bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg">
                  {companies.map((company: Company) => (
                    <SelectItem
                      key={company.id}
                      value={company.id}
                      className="relative overflow-hidden before:absolute before:inset-0 before:rounded-md before:border before:border-border/60 before:opacity-0 before:transition-opacity data-[state=checked]:before:opacity-100 data-[state=checked]:before:border-primary-500 hover:bg-primary-500 hover:text-white data-[state=checked]:hover:bg-primary-600 data-[state=checked]:text-white data-[state=checked]:font-semibold data-[state=checked]:shadow-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">{company.name}</span>
                        <span className="text-xs opacity-80">{formatCNPJ(company.cnpj)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
