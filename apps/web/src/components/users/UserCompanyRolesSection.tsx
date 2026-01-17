import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/useCompanies';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

export interface CompanyRole {
  companyId: string;
  companyName: string;
  role: 'owner' | 'admin' | 'editor' | 'operator' | 'viewer';
}

interface UserCompanyRolesSectionProps {
  companyRoles: CompanyRole[];
  onChange: (companyRoles: CompanyRole[]) => void;
  disabled?: boolean;
}

const ROLE_OPTIONS: ComboBoxOption<'owner' | 'admin' | 'editor' | 'operator' | 'viewer'>[] = [
  { value: 'owner', label: 'Dono' },
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'operator', label: 'Operador' },
  { value: 'viewer', label: 'Visualizador' },
];

export function UserCompanyRolesSection({
  companyRoles,
  onChange,
  disabled = false,
}: Readonly<UserCompanyRolesSectionProps>) {
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  // Filter out companies that are already added
  const availableCompanies = useMemo(() => {
    if (!companies) return [];
    const addedCompanyIds = new Set(companyRoles.map((cr) => cr.companyId));
    return companies.filter((c) => !addedCompanyIds.has(c.id));
  }, [companies, companyRoles]);

  const companyOptions: ComboBoxOption<string>[] = useMemo(() => {
    return availableCompanies.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [availableCompanies]);

  const handleAddCompany = (companyId: string | null) => {
    if (!companyId) return;
    const company = companies?.find((c) => c.id === companyId);
    if (!company) return;

    const newCompanyRole: CompanyRole = {
      companyId: company.id,
      companyName: company.name,
      role: 'viewer', // Default role
    };

    onChange([...companyRoles, newCompanyRole]);
  };

  const handleRemoveCompany = (companyId: string) => {
    onChange(companyRoles.filter((cr) => cr.companyId !== companyId));
  };

  const handleRoleChange = (companyId: string, role: CompanyRole['role'] | null) => {
    if (!role) return;
    onChange(
      companyRoles.map((cr) => (cr.companyId === companyId ? { ...cr, role } : cr)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text dark:text-text-dark">
          Empresas e Funções
        </label>
        {availableCompanies.length > 0 && (
          <ComboBox
            options={companyOptions}
            value={null}
            onValueChange={handleAddCompany}
            placeholder="+ Adicionar empresa"
            disabled={disabled || isLoadingCompanies}
            className="w-[200px] h-8 text-xs"
          />
        )}
      </div>

      {companyRoles.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-border dark:border-border-dark rounded-lg">
          Nenhuma empresa vinculada. Selecione uma empresa acima para adicionar.
        </div>
      ) : (
        <div className="space-y-2">
          {companyRoles.map((cr) => (
            <div
              key={cr.companyId}
              className="flex items-center gap-3 p-3 bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text dark:text-text-dark truncate">
                  {cr.companyName}
                </p>
              </div>

              <ComboBox
                options={ROLE_OPTIONS}
                value={cr.role}
                onValueChange={(value) => handleRoleChange(cr.companyId, value)}
                placeholder="Função"
                disabled={disabled}
                className="w-[150px] h-8 text-xs"
                searchable={false}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCompany(cr.companyId)}
                disabled={disabled}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {companyRoles.length > 0 && availableCompanies.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            // Open company selector - just a visual cue, actual selection is via ComboBox above
          }}
          disabled={disabled || isLoadingCompanies}
          className="w-full text-xs h-8 border-dashed"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar outra empresa
        </Button>
      )}
    </div>
  );
}
