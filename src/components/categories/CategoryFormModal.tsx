import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Tag, TrendingUp, TrendingDown, Palette, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { FormField } from '@/components/ui/FormField';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Category } from '@/services/categoryService';
import { CreateCategory } from '@/services/categoryService';
import { cn } from '@/lib/utils';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  GiftIcon,
  ShoppingCartIcon,
  TagIcon,
  WalletIcon,
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

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategory) => void;
  category?: Category | null;
  isLoading?: boolean;
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  category,
  isLoading = false,
}: Readonly<CategoryFormModalProps>) {
  const initialFormState: CreateCategory = useMemo(
    () => ({
      name: '',
      type: 'expense',
      color: '#8A05BE',
      icon: 'TagIcon',
    }),
    [],
  );

  const [form, setForm] = useState<CreateCategory>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        type: category.type as CategoryType,
        color: category.color,
        icon: category.icon,
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [category, open, initialFormState]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.type) errs.type = 'Tipo obrigatório';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit(form);
    onClose();
    setForm(initialFormState);
    setErrors({});
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
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col h-[90vh] max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <Tag className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                {category ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {category
                  ? 'Atualize as informações da categoria'
                  : 'Preencha os dados da nova categoria'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <form onSubmit={handleSubmit} id="category-form" className="space-y-6 py-4">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nome da categoria *"
                  error={errors.name}
                  className="md:col-span-2"
                >
                  <div className="relative">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Alimentação"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.name && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Tipo *" error={errors.type}>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, type: value as CategoryType }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.type && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {form.type === 'income' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span>
                          {categoryTypes.find((t) => t.value === form.type)?.label ||
                            'Selecione...'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
                      {categoryTypes.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                        >
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Seção: Personalização */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Personalização
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="category-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return category ? 'Salvar Alterações' : 'Criar Categoria';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
