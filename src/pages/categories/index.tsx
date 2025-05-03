import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCategories } from '@/hooks/useCategories';
import { useCompanyContext } from '@/contexts/companyContext';
import {
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  ShoppingCartIcon,
  GiftIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

const iconOptions = [
  { value: 'TagIcon', icon: TagIcon },
  { value: 'ArrowTrendingUpIcon', icon: ArrowTrendingUpIcon },
  { value: 'ArrowTrendingDownIcon', icon: ArrowTrendingDownIcon },
  { value: 'WalletIcon', icon: WalletIcon },
  { value: 'ShoppingCartIcon', icon: ShoppingCartIcon },
  { value: 'GiftIcon', icon: GiftIcon },
  { value: 'BuildingLibraryIcon', icon: BuildingLibraryIcon },
] as const;

const categoryTypes = [
  { value: 'income', label: 'Receita', icon: ArrowTrendingUpIcon },
  { value: 'expense', label: 'Despesa', icon: ArrowTrendingDownIcon },
] as const;

type CategoryType = (typeof categoryTypes)[number]['value'];

export function CategoriesPage() {
  const { companyId } = useCompanyContext() as { companyId: string };
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories();

  const [form, setForm] = useState({
    name: '',
    type: 'expense' as CategoryType,
    color: '#8A05BE',
    icon: 'TagIcon',
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
    if (!form.type) errs.type = 'Tipo obrigatório';
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
        await updateCategory({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createCategory(form);
      }
      setForm({
        name: '',
        type: 'expense',
        color: '#8A05BE',
        icon: 'TagIcon',
        companyId: companyId || '',
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleEdit = (id: string) => {
    const category = categories?.find((c) => c.id === id);
    if (category) {
      setForm({
        name: category.name,
        type: category.type as CategoryType,
        color: category.color,
        icon: category.icon,
        companyId: category.companyId,
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
        await deleteCategory(deleteId);
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
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
          <div className="text-red-500">Erro ao carregar categorias: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <TagIcon className="h-6 w-6 text-primary-500" /> Categorias
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome da categoria" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Alimentação"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Tipo" error={errors.type}>
                <Select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {categoryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
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
                  options={iconOptions.map((t) => ({
                    value: t.icon.displayName || t.icon.name || t.value,
                    icon: t.icon,
                  }))}
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary" disabled={isCreating || isUpdating}>
                  {editingId ? 'Salvar Alterações' : 'Adicionar Categoria'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        name: '',
                        type: 'expense',
                        color: '#8A05BE',
                        icon: 'TagIcon',
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
            <h2 className="text-lg font-semibold mb-4">Minhas Categorias</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {categories?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma categoria cadastrada.</li>
              )}
              {categories?.map((category) => {
                const Icon = iconOptions.find((t) => t.value === category.icon)?.icon || TagIcon;
                const TypeIcon =
                  categoryTypes.find((t) => t.value === category.type)?.icon || TagIcon;
                return (
                  <li key={category.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {categoryTypes.find((t) => t.value === category.type)?.label}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="secondary"
                        onClick={() => handleEdit(category.id)}
                        disabled={isUpdating}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => handleDelete(category.id)}
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
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
