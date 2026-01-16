import { RecordCard } from '@/components/ui/RecordCard';
import { Category } from '@/services/categoryService';
import { cn } from '@/lib/utils';
import {
  Gift,
  Landmark,
  ShoppingCart,
  Tag,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const iconOptions = [
  { value: 'TagIcon', icon: Tag },
  { value: 'ArrowTrendingUpIcon', icon: TrendingUp },
  { value: 'ArrowTrendingDownIcon', icon: TrendingDown },
  { value: 'WalletIcon', icon: Wallet },
  { value: 'ShoppingCartIcon', icon: ShoppingCart },
  { value: 'GiftIcon', icon: Gift },
  { value: 'BuildingLibraryIcon', icon: Landmark },
] as const;

const categoryTypes = [
  { value: 'income', label: 'Receita', icon: TrendingUp },
  { value: 'expense', label: 'Despesa', icon: TrendingDown },
] as const;

type CategoryType = (typeof categoryTypes)[number]['value'];

function getTypeLabel(type: CategoryType): string {
  return categoryTypes.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: CategoryType): string {
  const colors: Record<CategoryType, string> = {
    income: 'bg-green-500/20 text-green-400 border-green-500/30',
    expense: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[type] ?? colors.expense;
}

function getIcon(icon: string) {
  return iconOptions.find((t) => t.value === icon)?.icon || Tag;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<CategoryCardProps>) {
  const Icon = getIcon(category.icon);
  const TypeIcon = categoryTypes.find((t) => t.value === category.type)?.icon || Tag;

  return (
    <RecordCard
      onEdit={() => onEdit(category)}
      onDelete={() => onDelete(category.id)}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: category.color }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-1 truncate leading-tight">
              {category.name}
            </h3>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border leading-tight',
                getTypeBadgeColor(category.type),
              )}
            >
              <TypeIcon className="h-3 w-3 mr-1" />
              {getTypeLabel(category.type)}
            </span>
          </div>
        </div>
      </div>
    </RecordCard>
  );
}
