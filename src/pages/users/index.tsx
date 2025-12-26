import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useUsers } from '@/hooks/useUsers';
import { ViewDefault } from '@/layouts/ViewDefault';
import { CreateUser } from '@/services/userService';
import { useCompanyStore } from '@/stores/company';
import { User } from 'lucide-react';
import React, { useState } from 'react';

export function UsersPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUsers();

  const [form, setForm] = useState<CreateUser>({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive',
    companyIds: companyId ? [companyId] : [],
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = 'E-mail inválido';
    if (!form.companyIds || form.companyIds.length === 0) errs.companyIds = 'Empresa obrigatória';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editingId) {
        // Prepare data matching CreateUser structure
        const updateData: CreateUser = {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
          companyIds: form.companyIds,
          integrations: form.integrations,
        };
        updateUser({ id: editingId, data: updateData });
        setEditingId(null);
      } else {
        createUser(form);
      }
      setForm({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        companyIds: companyId ? [companyId] : [],
        integrations: {
          openaiApiKey: '',
          openaiModel: 'gpt-3.5-turbo',
        },
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleEdit = (id: string) => {
    const user = users?.find((u) => u.id === id);
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        companyIds: user.companyIds,
        integrations: {
          openaiApiKey: user.integrations?.openaiApiKey || '',
          openaiModel: user.integrations?.openaiModel || 'gpt-3.5-turbo',
        },
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteUser(deleteId);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10">
          <div className="text-red-500">Erro ao carregar usuários: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <User className="h-6 w-6 text-primary-500" /> Usuários
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
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
                />
              </FormField>

              <FormField label="Função" error={errors.role}>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, role: value as 'user' | 'admin' }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark">
                    {form.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Status" error={errors.status}>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, status: value as 'active' | 'inactive' }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark">
                    {form.status === 'active' ? 'Ativo' : 'Inativo'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Modelo OpenAI (Padrão)">
                <Select
                  value={form.integrations?.openaiModel || 'gpt-3.5-turbo'}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      integrations: {
                        ...prev.integrations,
                        openaiModel: value as any,
                      },
                    }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark">
                    {form.integrations?.openaiModel || 'gpt-3.5-turbo'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-5.2">GPT-5.2</SelectItem>
                    <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                  disabled={isCreating || isUpdating}
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Usuário'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                    onClick={() => {
                      setForm({
                        name: '',
                        email: '',
                        role: 'user',
                        status: 'active',
                        companyIds: companyId ? [companyId] : [],
                        integrations: {
                          openaiApiKey: '',
                          openaiModel: 'gpt-3.5-turbo',
                        },
                      });
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Listagem */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Usuários Cadastrados</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {users?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhum usuário cadastrado.</li>
              )}
              {users?.map((user) => (
                <li key={user.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-text dark:text-text-dark">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-800">
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                        {user.integrations?.openaiModel && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                             🤖 {user.integrations.openaiModel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleEdit(user.id)}
                        disabled={isUpdating}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
