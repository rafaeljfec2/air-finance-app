import React from 'react';
import { Label } from '@/components/ui/label';
import { CategoryCard } from './CategoryCard';
import { type CategoryFormData } from '../schemas';

interface CategoriesListProps {
  categories: CategoryFormData[];
  onRemove: (index: number) => void;
  iconOptions: ReadonlyArray<{ value: string; icon: React.ComponentType<{ className?: string }> }>;
  categoryTypes: ReadonlyArray<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
}

export function CategoriesList({
  categories,
  onRemove,
  iconOptions,
  categoryTypes,
}: Readonly<CategoriesListProps>) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-text dark:text-text-dark">
        Categorias Criadas ({categories.length})
      </Label>
      <div className="space-y-0.5 max-h-28 overflow-y-auto">
        {categories.map((category, index) => (
          <CategoryCard
            key={`category-${index}-${category.name}`}
            category={category}
            index={index}
            onRemove={onRemove}
            iconOptions={iconOptions}
            categoryTypes={categoryTypes}
          />
        ))}
      </div>
    </div>
  );
}
