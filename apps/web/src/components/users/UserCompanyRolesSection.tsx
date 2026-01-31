import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/useCompanies';
import { Building2, Trash2 } from 'lucide-react';
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
  { value: 'admin', label: 'Admin' },
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
      role: 'viewer',
    };

    onChange([...companyRoles, newCompanyRole]);
  };

  const handleRemoveCompany = (companyId: string) => {
    onChange(companyRoles.filter((cr) => cr.companyId !== companyId));
  };

  const handleRoleChange = (companyId: string, role: CompanyRole['role'] | null) => {
    if (!role) return;
    onChange(companyRoles.map((cr) => (cr.companyId === companyId ? { ...cr, role } : cr)));
  };

  return (
    <div className="space-y-2">
      {/* Header with label and add button */}
      <div className="flex items-center w-full">
        <label className="text-sm font-medium text-text dark:text-text-dark flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-gray-400" />
          Perfis ({companyRoles.length})
        </label>
        {availableCompanies.length > 0 && (
          <ComboBox
            options={companyOptions}
            value={null}
            onValueChange={handleAddCompany}
            placeholder="Selecionar perfil"
            disabled={disabled || isLoadingCompanies}
            className="w-[180px] h-7 text-xs ml-auto"
          />
        )}
      </div>

      {/* Company list - compact table style */}
      {companyRoles.length === 0 ? (
        <div className="text-xs text-gray-500 dark:text-gray-400 py-3 text-center border border-dashed border-border dark:border-border-dark rounded-md bg-gray-50/50 dark:bg-gray-900/20">
          Nenhum perfil vinculado
        </div>
      ) : (
        <div className="border border-border dark:border-border-dark rounded-md overflow-hidden">
          {/* Scrollable list with max height */}
          <div className="max-h-[180px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                <tr>
                  <th className="text-left py-1.5 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Perfil
                  </th>
                  <th className="text-left py-1.5 px-2 font-medium text-gray-500 dark:text-gray-400 w-[110px]">
                    Função
                  </th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {companyRoles.map((cr) => (
                  <tr
                    key={cr.companyId}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-1.5 px-2">
                      <span
                        className="text-text dark:text-text-dark truncate block max-w-[200px]"
                        title={cr.companyName}
                      >
                        {cr.companyName}
                      </span>
                    </td>
                    <td className="py-1 px-2">
                      <ComboBox
                        options={ROLE_OPTIONS}
                        value={cr.role}
                        onValueChange={(value) => handleRoleChange(cr.companyId, value)}
                        placeholder="Função"
                        disabled={disabled}
                        className="w-full h-6 text-xs border-0 bg-transparent shadow-none hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        searchable={false}
                      />
                    </td>
                    <td className="py-1 px-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCompany(cr.companyId)}
                        disabled={disabled}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer showing count if many items */}
          {companyRoles.length > 4 && (
            <div className="text-[10px] text-gray-400 text-center py-1 bg-gray-50/50 dark:bg-gray-800/30 border-t border-border dark:border-border-dark">
              {companyRoles.length} empresas vinculadas
            </div>
          )}
        </div>
      )}

      {/* Info text when no more companies available */}
      {availableCompanies.length === 0 && companyRoles.length > 0 && (
        <p className="text-[10px] text-gray-400 text-center">
          Todas as empresas disponíveis foram adicionadas
        </p>
      )}
    </div>
  );
}
