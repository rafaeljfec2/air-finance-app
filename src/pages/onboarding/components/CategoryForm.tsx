import React from 'react';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { type CategoryFormData } from '../schemas';

interface CategoryFormProps {
  formData: CategoryFormData;
  errors: Record<string, string>;
  iconOptions: ReadonlyArray<{ value: string; icon: React.ComponentType<{ className?: string }> }>;
  categoryTypes: ReadonlyArray<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  onNameChange: (name: string) => void;
  onTypeChange: (type: 'income' | 'expense') => void;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
  onSubmit: () => void;
}

export function CategoryForm({
  formData,
  errors,
  iconOptions,
  categoryTypes,
  onNameChange,
  onTypeChange,
  onColorChange,
  onIconChange,
  onSubmit,
}: Readonly<CategoryFormProps>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName" className="text-text dark:text-text-dark">
          Nome da Categoria
        </Label>
        <Input
          id="categoryName"
          placeholder="Ex: Alimentação, Transporte..."
          className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-text dark:text-text-dark">Tipo</Label>
        <Select value={formData.type} onValueChange={(value) => onTypeChange(value as 'income' | 'expense')}>
          <SelectTrigger className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
            {categoryTypes.map((opt) => {
              const TypeIcon = opt.icon;
              return (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark focus:bg-border dark:focus:bg-border-dark"
                >
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4" />
                    {opt.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-text dark:text-text-dark">Cor</Label>
          <ColorPicker value={formData.color} onChange={onColorChange} />
        </div>

        <div className="space-y-2">
          <Label className="text-text dark:text-text-dark">Ícone</Label>
          <IconPicker
            value={formData.icon}
            onChange={onIconChange}
            options={iconOptions.map((opt) => ({
              value: opt.value,
              icon: opt.icon,
            }))}
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        variant="outline"
        className="w-full border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Categoria
      </Button>
    </div>
  );
}
