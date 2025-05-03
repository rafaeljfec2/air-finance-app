import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Button } from '@/components/ui/button';
import { UserGroupIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui/FormField';
import { useDependents, Dependent } from '@/hooks/useDependents';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const relationTypes = [
  { value: 'filho', label: 'Filho(a)', icon: UserIcon },
  { value: 'conjuge', label: 'Cônjuge', icon: HeartIcon },
  { value: 'pai', label: 'Pai', icon: UserIcon },
  { value: 'mae', label: 'Mãe', icon: UserIcon },
  { value: 'outro', label: 'Outro', icon: UserIcon },
];

export function DependentsPage() {
  const { dependents, addDependent, updateDependent, deleteDependent } = useDependents();
  const [form, setForm] = useState<Dependent>({
    id: '',
    name: '',
    relation: 'filho',
    color: '#8A05BE',
    icon: 'UserIcon',
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
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...dependentData } = form;
    if (editingId) {
      await updateDependent(editingId, dependentData);
      setEditingId(null);
    } else {
      await addDependent(dependentData);
    }
    setForm({
      id: '',
      name: '',
      relation: 'filho',
      color: '#8A05BE',
      icon: 'UserIcon',
    });
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const dep = dependents.find((d) => d.id === id);
    if (dep) {
      setForm(dep);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteDependent(deleteId);
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
                <Select name="relation" value={form.relation} onChange={handleChange} required>
                  {relationTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
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
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Dependente'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        id: '',
                        name: '',
                        relation: 'filho',
                        color: '#8A05BE',
                        icon: 'UserIcon',
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
              {dependents.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhum dependente cadastrado.</li>
              )}
              {dependents.map((dep) => {
                const Icon = relationTypes.find((t) => t.value === dep.relation)?.icon || UserIcon;
                return (
                  <li key={dep.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{ background: dep.color, width: 32, height: 32 }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">{dep.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {relationTypes.find((t) => t.value === dep.relation)?.label}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" color="secondary" onClick={() => handleEdit(dep.id)}>
                        Editar
                      </Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(dep.id)}>
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
              Tem certeza que deseja excluir este dependente?
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
