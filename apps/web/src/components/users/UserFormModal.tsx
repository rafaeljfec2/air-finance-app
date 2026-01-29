import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCompanies } from '@/hooks/useCompanies';
import { CreateUser, User } from '@/services/userService';
import { companyService } from '@/services/companyService';
import { useCompanyStore } from '@/stores/company';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CompanyRole, UserCompanyRolesSection } from './UserCompanyRolesSection';
import type { Company } from '@/types/company';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUser) => void;
  user?: User | null;
  isLoading?: boolean;
}

export function UserFormModal({
  open,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: Readonly<UserFormModalProps>) {
  const { activeCompany } = useCompanyStore();
  const { companies } = useCompanies();
  const companyId = activeCompany?.id || '';
  const companyName = activeCompany?.name || '';
  const [fetchedCompanies, setFetchedCompanies] = useState<Map<string, Company>>(new Map());

  // Combine companies from hook and fetched companies
  const allCompanies = useMemo(() => {
    const companiesMap = new Map<string, Company>();
    companies?.forEach((c) => companiesMap.set(c.id, c));
    fetchedCompanies.forEach((c, id) => companiesMap.set(id, c));
    return Array.from(companiesMap.values());
  }, [companies, fetchedCompanies]);

  const initialFormState: CreateUser = useMemo(
    () => ({
      name: '',
      email: '',
      role: 'viewer', // Default to lowest permission role
      status: 'active',
      plan: 'free',
      companyIds: companyId ? [companyId] : [],
      integrations: {
        openaiApiKey: '',
        openaiModel: 'gpt-4o-mini',
      },
    }),
    [companyId],
  );

  const [form, setForm] = useState<CreateUser>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for company roles management
  const [companyRoles, setCompanyRoles] = useState<CompanyRole[]>(() => {
    if (companyId && companyName) {
      return [{ companyId, companyName, role: 'viewer' }];
    }
    return [];
  });

  const statusOptions: ComboBoxOption<'active' | 'inactive'>[] = useMemo(
    () => [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
    ],
    [],
  );

  const openaiModelOptions: ComboBoxOption<
    'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  >[] = useMemo(
    () => [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Recomendado)' },
      { value: 'gpt-4o', label: 'GPT-4o (Mais preciso)' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Legacy)' },
    ],
    [],
  );

  // Helper function to find missing company IDs
  const findMissingCompanyIds = (companyIds: string[], existingCompanies: Company[]): string[] => {
    const existingIds = new Set(existingCompanies.map((c) => c.id));
    return companyIds.filter((cId) => !existingIds.has(cId));
  };

  // Helper function to fetch a single company
  const fetchCompanyById = async (cId: string): Promise<Company | null> => {
    try {
      return await companyService.getById(cId);
    } catch (error) {
      console.error(`Erro ao buscar empresa ${cId}:`, error);
      return null;
    }
  };

  // Helper function to update fetched companies state
  const updateFetchedCompanies = (newCompanies: Map<string, Company>) => {
    if (newCompanies.size === 0) return;

    setFetchedCompanies((prev) => {
      const updated = new Map(prev);
      newCompanies.forEach((company, id) => updated.set(id, company));
      return updated;
    });
  };

  // Fetch companies that are not in the companies list
  useEffect(() => {
    if (!user?.companyIds || !companies) return;

    const fetchMissingCompanies = async () => {
      const missingCompanyIds = findMissingCompanyIds(user.companyIds, companies);

      if (missingCompanyIds.length === 0) return;

      const fetchPromises = missingCompanyIds.map((cId) => fetchCompanyById(cId));
      const results = await Promise.allSettled(fetchPromises);

      const newFetchedCompanies = new Map<string, Company>();
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          newFetchedCompanies.set(missingCompanyIds[index] ?? '', result.value);
        }
      });

      updateFetchedCompanies(newFetchedCompanies);
    };

    fetchMissingCompanies();
  }, [user?.companyIds, companies]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        plan: user.plan || 'free',
        companyIds: user.companyIds,
        integrations: {
          openaiApiKey: '',
          openaiModel: user.integrations?.openaiModel || 'gpt-4o-mini',
        },
      });

      // Load company roles from user data
      if (user.companyIds && user.companyRoles && allCompanies) {
        const roles: CompanyRole[] = user.companyIds.map((cId) => {
          const company = allCompanies.find((c) => c.id === cId);
          return {
            companyId: cId,
            companyName: company?.name ?? 'Empresa desconhecida',
            role: (user.companyRoles?.[cId] as CompanyRole['role']) ?? 'viewer',
          };
        });
        setCompanyRoles(roles);
      } else if (user.companyIds && allCompanies) {
        // User has companyIds but no companyRoles defined
        const roles: CompanyRole[] = user.companyIds.map((cId) => {
          const company = allCompanies.find((c) => c.id === cId);
          return {
            companyId: cId,
            companyName: company?.name ?? 'Empresa desconhecida',
            role: 'viewer',
          };
        });
        setCompanyRoles(roles);
      }
    } else {
      setForm(initialFormState);
      // Reset to active company with default role for new users
      if (companyId && companyName) {
        setCompanyRoles([{ companyId, companyName, role: 'viewer' }]);
      } else {
        setCompanyRoles([]);
      }
      setFetchedCompanies(new Map());
    }
    setErrors({});
  }, [user, initialFormState, allCompanies, companyId, companyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = 'E-mail inválido';
    if (companyRoles.length === 0) errs.companyIds = 'Pelo menos uma empresa é obrigatória';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Build companyIds and companyRoles from the section data
    const companyIds = companyRoles.map((cr) => cr.companyId);
    const companyRolesMap: Record<string, string> = {};
    companyRoles.forEach((cr) => {
      companyRolesMap[cr.companyId] = cr.role;
    });

    onSubmit({
      ...form,
      companyIds,
      companyRoles: companyRolesMap,
    });
  };

  const handleClose = () => {
    setForm(initialFormState);
    setErrors({});
    // Reset company roles to active company
    if (companyId && companyName) {
      setCompanyRoles([{ companyId, companyName, role: 'viewer' }]);
    } else {
      setCompanyRoles([]);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={user ? 'Editar Usuário' : 'Novo Usuário'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nome" error={errors.name}>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome completo"
            required
            disabled={isLoading}
            className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all"
          />
        </FormField>

        <FormField label="E-mail" error={errors.email}>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="exemplo@email.com"
            required
            disabled={isLoading || !!user}
            className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all"
          />
        </FormField>

        <FormField label="Status" error={errors.status}>
          <ComboBox
            options={statusOptions}
            value={form.status}
            onValueChange={(value: 'active' | 'inactive' | null) =>
              setForm((prev) => ({ ...prev, status: value ?? 'active' }))
            }
            placeholder="Selecione o status"
            disabled={isLoading}
            className="w-full"
          />
        </FormField>

        {/* Company Roles Section */}
        <div className="space-y-2">
          <UserCompanyRolesSection
            companyRoles={companyRoles}
            onChange={setCompanyRoles}
            disabled={isLoading}
          />
          {errors.companyIds && <p className="text-sm text-red-500">{errors.companyIds}</p>}
        </div>

        <FormField label="Modelo OpenAI (Padrão)">
          <ComboBox
            options={openaiModelOptions}
            value={form.integrations?.openaiModel ?? 'gpt-4o-mini'}
            onValueChange={(
              value: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | null,
            ) =>
              setForm((prev) => ({
                ...prev,
                integrations: {
                  ...prev.integrations,
                  openaiModel: value ?? 'gpt-4o-mini',
                },
              }))
            }
            placeholder="Selecione o modelo OpenAI"
            disabled={isLoading}
            className="w-full"
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border-dark">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="text-text dark:text-text-dark border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user ? 'Salvar Alterações' : 'Adicionar Usuário'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
