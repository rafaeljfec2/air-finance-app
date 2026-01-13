import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Landmark,
  ShoppingCart,
  Tags,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { CategoriesList } from './CategoriesList';
import { CategoryForm } from './CategoryForm';
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
        <CardTitle className="text-text dark:text-text-dark text-xl sm:text-2xl">
          Categorias
        </CardTitle>
        <CardDescription className="text-text/70 dark:text-text-dark/70 text-sm sm:text-base">
          Crie categorias para organizar suas transações. Você pode adicionar quantas quiser ou usar
          as categorias padrão.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="space-y-4 border-t border-border dark:border-border-dark pt-4">
          <CategoryForm
            formData={currentCategoryForm}
            errors={categoryFormErrors}
            iconOptions={iconOptions}
            categoryTypes={categoryTypes}
            onNameChange={(name) => setCurrentCategoryForm({ ...currentCategoryForm, name })}
            onTypeChange={(type) => setCurrentCategoryForm({ ...currentCategoryForm, type })}
            onColorChange={(color) => setCurrentCategoryForm({ ...currentCategoryForm, color })}
            onIconChange={(icon) => setCurrentCategoryForm({ ...currentCategoryForm, icon })}
            onSubmit={handleAddCategory}
          />
          <CategoriesList
            categories={categoriesData}
            onRemove={handleRemoveCategory}
            iconOptions={iconOptions}
            categoryTypes={categoryTypes}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          type="button"
          onClick={onBack}
          className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark"
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
            className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark w-full sm:w-auto"
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
