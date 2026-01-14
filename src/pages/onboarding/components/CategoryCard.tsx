import React from 'react';
import { Button } from '@/components/ui/button';
import { Tags, Trash2, TrendingDown } from 'lucide-react';
import { type CategoryFormData } from '../schemas';

interface CategoryCardProps {
  category: CategoryFormData;
  index: number;
  onRemove: (index: number) => void;
  iconOptions: ReadonlyArray<{ value: string; icon: React.ComponentType<{ className?: string }> }>;
  categoryTypes: ReadonlyArray<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
}

export function CategoryCard({
  category,
  index,
  onRemove,
  iconOptions,
  categoryTypes,
}: Readonly<CategoryCardProps>) {
  const iconOption = iconOptions.find((opt) => opt.value === category.icon);
  const IconComponent = iconOption?.icon ?? Tags;
  const typeOption = categoryTypes.find((type) => type.value === category.type);
  const TypeIcon = typeOption?.icon ?? TrendingDown;

  return (
    <div className="flex items-center justify-between px-2 py-1.5 bg-card/50 dark:bg-card-dark/50 border border-border dark:border-border-dark rounded">
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: category.color }}
        >
          <IconComponent className="h-2.5 w-2.5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-text dark:text-text-dark font-medium text-xs truncate leading-tight">
            {category.name}
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-text dark:text-text-dark/60 leading-tight">
            <TypeIcon className="h-2 w-2" />
            {categoryTypes.find((t) => t.value === category.type)?.label}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        type="button"
        size="sm"
        onClick={() => onRemove(index)}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-6 w-6 p-0 flex-shrink-0"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
