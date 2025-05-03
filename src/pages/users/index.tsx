import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useUsers, User } from '@/hooks/useUsers';
import { useCompanies } from '@/hooks/useCompanies';
import { UserIcon } from '@heroicons/react/24/outline';

const permissionsOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'finance', label: 'Financeiro' },
  { value: 'operations', label: 'Operacional' },
  { value: 'viewer', label: 'Visualizador' },
];

export function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { companies } = useCompanies();
  const [form, setForm] = useState<User>({
    id: '',
    name: '',
    email: '',
    companyId: '',
    phone: '',
    permissions: [],
    notes: '',
    status: 'active',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (name === 'permissions' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (checked) {
        setForm((prev) => ({ ...prev, permissions: [...prev.permissions, value] }));
      } else {
        setForm((prev) => ({ ...prev, permissions: prev.permissions.filter((p) => p !== value) }));
      }
    } else if (name === 'status') {
      setForm((prev) => ({ ...prev, status: value as 'active' | 'inactive' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = 'E-mail inválido';
    if (!form.companyId) errs.companyId = 'Empresa obrigatória';
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Telefone inválido';
    if (!form.permissions.length) errs.permissions = 'Selecione ao menos uma permissão';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...userData } = form;
    if (editingId) {
      await updateUser(editingId, userData);
      setEditingId(null);
    } else {
      await addUser(userData);
    }
    setForm({
      id: '',
      name: '',
      email: '',
      companyId: '',
      phone: '',
      permissions: [],
      notes: '',
      status: 'active',
    });
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setForm(user);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteUser(deleteId);
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-primary-500" /> Usuários
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
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="E-mail" error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="usuario@email.com"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Empresa" error={errors.companyId}>
                <Select name="companyId" value={form.companyId} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Telefone" error={errors.phone}>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Permissões" error={errors.permissions}>
                <div className="flex flex-wrap gap-3">
                  {permissionsOptions.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={perm.value}
                        checked={form.permissions.includes(perm.value)}
                        onChange={handleChange}
                        className="accent-primary-500"
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </FormField>
              <FormField label="Status">
                <Select name="status" value={form.status} onChange={handleChange} required>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormField>
              <FormField label="Observações">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Observações adicionais"
                  rows={2}
                  className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors rounded-md resize-none"
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Usuário'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        id: '',
                        name: '',
                        email: '',
                        companyId: '',
                        phone: '',
                        permissions: [],
                        notes: '',
                        status: 'active',
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
              {users.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhum usuário cadastrado.</li>
              )}
              {users.map((user) => {
                const company = companies.find((c) => c.id === user.companyId);
                return (
                  <li key={user.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-text dark:text-text-dark">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email} • Empresa: {company?.name || '-'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Permissões:{' '}
                        {user.permissions
                          .map((p) => permissionsOptions.find((opt) => opt.value === p)?.label)
                          .join(', ')}
                        {user.phone && ` • Tel: ${user.phone}`}
                        {user.status === 'inactive' && (
                          <span className="ml-2 text-red-500">(Inativo)</span>
                        )}
                      </div>
                      {user.notes && (
                        <div className="text-xs text-gray-400 italic">Obs: {user.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" color="secondary" onClick={() => handleEdit(user.id)}>
                        Editar
                      </Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(user.id)}>
                        Excluir
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
        <ConfirmModal
          open={showConfirmDelete}
          title="Confirmar exclusão"
          description={
            <>
              Tem certeza que deseja excluir este usuário?
              <br />
              Esta ação não poderá ser desfeita.
            </>
          }
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          danger
        />
      </div>
    </ViewDefault>
  );
}
