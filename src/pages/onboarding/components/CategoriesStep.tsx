import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Landmark,
  Plus,
  ShoppingCart,
  Tags,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { type CategoryFormData } from '../schemas';

interface CategoriesStepProps {
  onNext: (data: CategoryFormData[]) => void;
  onBack: () => void;
  initialData: CategoryFormData[];
}

export function CategoriesStep({ onNext, onBack, initialData }: Readonly<CategoriesStepProps>) {
  const [categoriesData, setCategoriesData] = useState<CategoryFormData[]>(initialData);
  const [currentCategoryForm, setCurrentCategoryForm] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    color: '#8A05BE',
    icon: 'Tags',
  });
  const [categoryFormErrors, setCategoryFormErrors] = useState<Record<string, string>>({});

  const iconOptions = [
    { value: 'Tags', icon: Tags },
    { value: 'TrendingUp', icon: TrendingUp },
    { value: 'TrendingDown', icon: TrendingDown },
    { value: 'Wallet', icon: Wallet },
    { value: 'ShoppingCart', icon: ShoppingCart },
    { value: 'Gift', icon: Gift },
    { value: 'Landmark', icon: Landmark },
  ] as const;

  const categoryTypes = [
    { value: 'income', label: 'Receita', icon: TrendingUp },
    { value: 'expense', label: 'Despesa', icon: TrendingDown },
  ] as const;

  const handleAddCategory = () => {
    const errors: Record<string, string> = {};
    if (!currentCategoryForm.name.trim()) {
      errors.name = 'Nome obrigatório';
    }
    setCategoryFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCategoriesData([...categoriesData, { ...currentCategoryForm }]);
    setCurrentCategoryForm({
      name: '',
      type: 'expense',
      color: '#8A05BE',
      icon: 'Tags',
    });
    setCategoryFormErrors({});
  };

  const handleRemoveCategory = (index: number) => {
    setCategoriesData(categoriesData.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-text-dark text-xl sm:text-2xl">Categorias</CardTitle>
        <CardDescription className="text-text-dark/70 text-sm sm:text-base">
          Crie categorias para organizar suas transações. Você pode adicionar quantas quiser ou usar
          as categorias padrão.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Categories List */}
        {categoriesData.length > 0 && (
          <div className="space-y-2">
            <Label className="text-text-dark">Categorias Criadas ({categoriesData.length})</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categoriesData.map((category, index) => {
                const iconOption = iconOptions.find((opt) => opt.value === category.icon);
                const IconComponent = iconOption?.icon ?? Tags;
                const typeOption = categoryTypes.find((type) => type.value === category.type);
                const TypeIcon = typeOption?.icon ?? TrendingDown;
                return (
                  <div
                    key={`category-${index}-${category.name}`}
                    className="flex items-center justify-between p-3 bg-card-dark/50 border border-border-dark rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-text-dark font-medium">{category.name}</div>
                        <div className="flex items-center gap-1 text-xs text-text-dark/60">
                          <TypeIcon className="h-3 w-3" />
                          {categoryTypes.find((t) => t.value === category.type)?.label}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      type="button"
                      size="sm"
                      onClick={() => handleRemoveCategory(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Form */}
        <div className="space-y-4 border-t border-border-dark pt-4">
          <Label className="text-text-dark">Adicionar Nova Categoria</Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-text-dark">
                Nome da Categoria
              </Label>
              <Input
                id="categoryName"
                placeholder="Ex: Alimentação, Transporte..."
                className="bg-card-dark border-border-dark text-text-dark"
                value={currentCategoryForm.name}
                onChange={(e) =>
                  setCurrentCategoryForm({ ...currentCategoryForm, name: e.target.value })
                }
              />
              {categoryFormErrors.name && (
                <p className="text-sm text-red-400">{categoryFormErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-text-dark">Tipo</Label>
              <Select
                value={currentCategoryForm.type}
                onValueChange={(value) =>
                  setCurrentCategoryForm({
                    ...currentCategoryForm,
                    type: value as 'income' | 'expense',
                  })
                }
              >
                <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                  {categoryTypes.map((opt) => {
                    const TypeIcon = opt.icon;
                    return (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
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
                <Label className="text-text-dark">Cor</Label>
                <ColorPicker
                  value={currentCategoryForm.color}
                  onChange={(color) => setCurrentCategoryForm({ ...currentCategoryForm, color })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-dark">Ícone</Label>
                <IconPicker
                  value={currentCategoryForm.icon}
                  onChange={(icon) => setCurrentCategoryForm({ ...currentCategoryForm, icon })}
                  options={iconOptions.map((opt) => ({
                    value: opt.value,
                    icon: opt.icon,
                  }))}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddCategory}
              variant="outline"
              className="w-full border-border-dark text-text-dark hover:bg-border-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          type="button"
          onClick={onBack}
          className="text-text-dark hover:bg-border-dark"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              setCategoriesData([]);
              onNext([]); // Pass empty or null? Logic in main was empty means skip/default
            }}
            className="text-text-dark hover:bg-border-dark w-full sm:w-auto"
          >
            Pular
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (categoriesData.length > 0) {
                onNext(categoriesData);
              } else {
                // Create default categories if none were added
                const defaultCategories: CategoryFormData[] = [
                  {
                    name: 'Alimentação',
                    type: 'expense',
                    color: '#EF4444',
                    icon: 'Tags',
                  },
                  { name: 'Transporte', type: 'expense', color: '#3B82F6', icon: 'Tags' },
                  { name: 'Moradia', type: 'expense', color: '#10B981', icon: 'Tags' },
                  {
                    name: 'Salário',
                    type: 'income',
                    color: '#22C55E',
                    icon: 'TrendingUp',
                  },
                ];
                onNext(defaultCategories);
              }
            }}
            className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 w-full sm:w-auto"
          >
            {categoriesData.length > 0 ? 'Continuar' : 'Usar Categorias Padrão'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </motion.div>
  );
}
