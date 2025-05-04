import { useState } from 'react';
import { Company } from '@/types/company';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/company';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Loading } from '@/components/Loading';

export const CompanySelector = () => {
  const { user } = useAuthStore();
  const { activeCompany, changeActiveCompany } = useActiveCompany();
  const [isOpen, setIsOpen] = useState(false);

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => companyService.getUserCompanies(),
    enabled: !!user,
  });

  if (!user) return null;

  if (isLoading) {
    return <Loading size="small" />;
  }

  if (!companies?.length) {
    return <div className="text-sm text-gray-500">Nenhuma empresa cadastrada</div>;
  }

  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find((company: Company) => company.id === companyId);
    changeActiveCompany(selectedCompany || null);
  };

  return (
    <div className="relative w-[200px]">
      <Select value={activeCompany?.id || ''} onValueChange={handleCompanyChange}>
        <SelectTrigger>
          <span className="truncate">{activeCompany?.name || 'Selecione uma empresa'}</span>
        </SelectTrigger>
        <SelectContent>
          {companies.map((company: Company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex flex-col">
                <span className="font-medium">{company.name}</span>
                <span className="text-xs text-gray-500">{company.cnpj}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
