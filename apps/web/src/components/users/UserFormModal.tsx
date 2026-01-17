import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { CreateUser, User } from '@/services/userService';
import { UserRole } from '@/types/user';
import { useCompanyStore } from '@/stores/company';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

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
  const { user: currentUser } = useAuth();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

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
        openaiModel: 'gpt-3.5-turbo',
      },
    }),
    [companyId],
  );

  const [form, setForm] = useState<CreateUser>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // All available roles with labels
  const allRoleOptions: ComboBoxOption<
    'god' | 'sys_admin' | 'user' | 'owner' | 'admin' | 'editor' | 'operator' | 'viewer'
  >[] = useMemo(
    () => [
      { value: 'god', label: 'God (SuperUser)' },
      { value: 'sys_admin', label: 'Administrador (Sistema)' },
      { value: 'user', label: 'Usuário Comum (Sistema)' },
      { value: 'owner', label: 'Dono (Empresa)' },
      { value: 'admin', label: 'Administrador (Empresa)' },
      { value: 'editor', label: 'Editor (Empresa)' },
      { value: 'operator', label: 'Operador (Empresa)' },
      { value: 'viewer', label: 'Visualizador (Empresa)' },
    ],
    [],
  );

  // Filter role options based on current user's role
  // Security: Users can only assign roles equal or below their own level
  const roleOptions = useMemo(() => {
    const currentRole = currentUser?.role;

    // Company-level roles only (for owner, admin, etc.)
    const companyRoles: typeof allRoleOptions = [
      { value: 'owner', label: 'Dono (Empresa)' },
      { value: 'admin', label: 'Administrador (Empresa)' },
      { value: 'editor', label: 'Editor (Empresa)' },
      { value: 'operator', label: 'Operador (Empresa)' },
      { value: 'viewer', label: 'Visualizador (Empresa)' },
    ];

    switch (currentRole) {
      case 'god':
        // God can assign any role
        return allRoleOptions;

      case 'sys_admin':
        // Sys admin can assign all except god
        return allRoleOptions.filter((r) => r.value !== 'god');

      case 'owner':
        // Owner can assign company roles (including owner for other companies)
        return companyRoles;

      case 'admin':
        // Admin can assign company roles except owner
        return companyRoles.filter((r) => r.value !== 'owner');

      case 'editor':
        // Editor can only assign editor, operator, viewer
        return companyRoles.filter((r) => ['editor', 'operator', 'viewer'].includes(r.value));

      case 'operator':
        // Operator can only assign operator, viewer
        return companyRoles.filter((r) => ['operator', 'viewer'].includes(r.value));

      default:
        // Viewer and others cannot assign any roles (show only viewer as read-only)
        return [{ value: 'viewer' as const, label: 'Visualizador (Empresa)' }];
    }
  }, [currentUser?.role, allRoleOptions]);

  const statusOptions: ComboBoxOption<'active' | 'inactive'>[] = useMemo(
    () => [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
    ],
    [],
  );

  const openaiModelOptions: ComboBoxOption<
    'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-5.2' | 'gpt-5-mini'
  >[] = useMemo(
    () => [
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-5.2', label: 'GPT-5.2' },
      { value: 'gpt-5-mini', label: 'GPT-5 Mini' },
    ],
    [],
  );

  useEffect(() => {
    if (user) {
      // Se temos uma empresa ativa, tentamos pegar o papel específico da empresa
      const companyRole =
        activeCompany && user.companyRoles ? user.companyRoles[activeCompany.id] : undefined;
      // Se não tiver papel na empresa, usa o papel global
      const displayRole = (companyRole || user.role) as UserRole;

      setForm({
        name: user.name,
        email: user.email,
        role: displayRole,
        status: user.status,
        plan: user.plan || 'free',
        companyIds: user.companyIds,
        integrations: {
          openaiApiKey: user.integrations?.openaiApiKey || '',
          openaiModel: user.integrations?.openaiModel || 'gpt-3.5-turbo',
        },
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [user, initialFormState, activeCompany]);

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
    if (!form.companyIds || form.companyIds.length === 0) errs.companyIds = 'Empresa obrigatória';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit(form);
  };

  const handleClose = () => {
    setForm(initialFormState);
    setErrors({});
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Função" error={errors.role}>
            <ComboBox
              options={roleOptions}
              value={form.role}
              onValueChange={(
                value:
                  | 'god'
                  | 'sys_admin'
                  | 'user'
                  | 'owner'
                  | 'admin'
                  | 'editor'
                  | 'operator'
                  | 'viewer'
                  | null,
              ) => setForm((prev) => ({ ...prev, role: value ?? 'user' }))}
              placeholder="Selecione a função"
              disabled={isLoading}
              className="w-full"
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
        </div>

        <FormField label="Modelo OpenAI (Padrão)">
          <ComboBox
            options={openaiModelOptions}
            value={form.integrations?.openaiModel ?? 'gpt-3.5-turbo'}
            onValueChange={(
              value: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-5.2' | 'gpt-5-mini' | null,
            ) =>
              setForm((prev) => ({
                ...prev,
                integrations: {
                  ...prev.integrations,
                  openaiModel: value ?? 'gpt-3.5-turbo',
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
