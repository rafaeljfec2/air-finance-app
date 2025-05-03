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
import { useCategories, Category } from '@/hooks/useCategories';
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
];

export function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [form, setForm] = useState<Category>({
    id: '',
    name: '',
    type: 'despesa',
    color: '#8A05BE',
    icon: 'TagIcon',
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
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...categoryData } = form;
    if (editingId) {
      await updateCategory(editingId, categoryData);
      setEditingId(null);
    } else {
      await addCategory(categoryData);
    }
    setForm({ id: '', name: '', type: 'despesa', color: '#8A05BE', icon: 'TagIcon' });
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setForm(cat);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteCategory(deleteId);
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
                  placeholder="Ex: Alimentação, Salário, Lazer..."
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Tipo">
                <Select name="type" value={form.type} onChange={handleChange} required>
                  <option value="despesa">Despesa</option>
                  <option value="receita">Receita</option>
                </Select>
              </FormField>
              <FormField label="Cor">
                <ColorPicker value={form.color} onChange={handleColorChange} />
              </FormField>
              <FormField label="Ícone">
                <IconPicker value={form.icon} onChange={handleIconChange} options={iconOptions} />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Categoria'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        id: '',
                        name: '',
                        type: 'despesa',
                        color: '#8A05BE',
                        icon: 'TagIcon',
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
              {categories.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma categoria cadastrada.</li>
              )}
              {categories.map((cat) => {
                const Icon = iconOptions.find((t) => t.value === cat.icon)?.icon || TagIcon;
                return (
                  <li key={cat.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{ background: cat.color, width: 32, height: 32 }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">{cat.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {cat.type === 'receita' ? 'Receita' : 'Despesa'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" color="secondary" onClick={() => handleEdit(cat.id)}>
                        Editar
                      </Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(cat.id)}>
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
              Tem certeza que deseja excluir esta categoria?
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
