import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Button } from '@/components/ui/button';
import { UserGroupIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui/FormField';
import { useDependents } from '@/hooks/useDependents';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCompanyContext } from '@/contexts/companyContext';

const relationTypes = [
  { value: 'filho', label: 'Filho(a)', icon: UserIcon },
  { value: 'conjuge', label: 'Cônjuge', icon: HeartIcon },
  { value: 'pai', label: 'Pai', icon: UserIcon },
  { value: 'mae', label: 'Mãe', icon: UserIcon },
  { value: 'outro', label: 'Outro', icon: UserIcon },
] as const;

type RelationType = (typeof relationTypes)[number]['value'];

export function DependentsPage() {
  const { companyId } = useCompanyContext() as { companyId: string };
  const {
    dependents,
    isLoading,
    error,
    createDependent,
    updateDependent,
    deleteDependent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDependents();

  const [form, setForm] = useState({
    name: '',
    relation: 'filho' as RelationType,
    color: '#8A05BE',
    icon: 'UserIcon',
    companyId: companyId || '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setForm((prev) => ({ ...prev, color }));
  };

  const handleIconChange = (icon: string) => {
    setForm((prev) => ({ ...prev, icon }));
  };

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.relation) errs.relation = 'Relação obrigatória';
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editingId) {
        await updateDependent({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createDependent(form);
      }
      setForm({
        name: '',
        relation: 'filho',
        color: '#8A05BE',
        icon: 'UserIcon',
        companyId: companyId || '',
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar dependente:', error);
    }
  };

  const handleEdit = (id: string) => {
    const dependent = dependents?.find((d) => d.id === id);
    if (dependent) {
      setForm({
        name: dependent.name,
        relation: dependent.relation as RelationType,
        color: dependent.color,
        icon: dependent.icon,
        companyId: dependent.companyId,
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
        await deleteDependent(deleteId);
      } catch (error) {
        console.error('Erro ao deletar dependente:', error);
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
          <div className="text-red-500">Erro ao carregar dependentes: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-primary-500" /> Dependentes
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
                  placeholder="Nome do dependente"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Relação" error={errors.relation}>
                <Select
                  value={form.relation}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, relation: value as RelationType }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark">
                    {relationTypes.find((t) => t.value === form.relation)?.label || 'Selecione...'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    {relationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Cor">
                <ColorPicker value={form.color} onChange={handleColorChange} />
              </FormField>
              <FormField label="Ícone">
                <IconPicker
                  value={form.icon}
                  onChange={handleIconChange}
                  options={relationTypes.map((t) => ({
                    value: t.icon.displayName || t.icon.name || t.value,
                    icon: t.icon,
                  }))}
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                  disabled={isCreating || isUpdating}
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Dependente'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                    onClick={() => {
                      setForm({
                        name: '',
                        relation: 'filho',
                        color: '#8A05BE',
                        icon: 'UserIcon',
                        companyId: companyId || '',
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
            <h2 className="text-lg font-semibold mb-4">Meus Dependentes</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {dependents?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhum dependente cadastrado.</li>
              )}
              {dependents?.map((dependent) => {
                const Icon =
                  relationTypes.find((t) => t.value === dependent.relation)?.icon || UserIcon;
                return (
                  <li key={dependent.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: dependent.color }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">
                          {dependent.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {relationTypes.find((t) => t.value === dependent.relation)?.label}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleEdit(dependent.id)}
                        disabled={isUpdating}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleDelete(dependent.id)}
                        disabled={isDeleting}
                      >
                        Excluir
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este dependente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
