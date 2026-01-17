import { CompanyTableRow } from '@/components/companies/CompanyTableRow';
import { CompanyCard } from './CompanyCard';
import { CompanyListItem } from './CompanyListItem';
import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn , SortConfig } from '@/components/ui/SortableColumn';
import { Company } from '@/types/company';

interface CompaniesListProps {
  companies: Company[];
  viewMode: 'grid' | 'list';
  sortConfig: SortConfig<'name' | 'type' | 'cnpj' | 'foundationDate' | 'email' | 'phone' | 'address'> | null;
  onSort: (field: 'name' | 'type' | 'cnpj' | 'foundationDate' | 'email' | 'phone' | 'address') => void;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function CompaniesList({
  companies,
  viewMode,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<CompaniesListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </RecordsGrid>
    );
  }

  return (
    <>
      {/* Desktop: Table view */}
      <Card className="hidden md:block bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border-dark">
                <SortableColumn field="name" currentSort={sortConfig} onSort={onSort}>
                  Empresa
                </SortableColumn>
                <SortableColumn field="cnpj" currentSort={sortConfig} onSort={onSort}>
                  Informações
                </SortableColumn>
                <SortableColumn field="email" currentSort={sortConfig} onSort={onSort}>
                  Contato
                </SortableColumn>
                <SortableColumn field="address" currentSort={sortConfig} onSort={onSort}>
                  Endereço
                </SortableColumn>
                <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <CompanyTableRow
                  key={company.id}
                  company={company}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile: List view (lista horizontal simples) */}
      <div className="md:hidden space-y-1">
        {companies.map((company) => (
          <CompanyListItem
            key={company.id}
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </>
  );
}
