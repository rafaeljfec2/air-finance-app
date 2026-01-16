import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Category } from '@/services/categoryService';
import {
    Edit,
    Gift,
    Landmark,
    ShoppingCart,
    Tag,
    Trash2,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';

interface CategoryTableRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

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

export function CategoryTableRow({
  category,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<CategoryTableRowProps>) {
  const Icon = iconOptions.find((t) => t.value === category.icon)?.icon || Tag;
  const TypeIcon = categoryTypes.find((t) => t.value === category.type)?.icon || Tag;

  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: category.color }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="font-medium text-text dark:text-text-dark">{category.name}</div>
        </div>
      </td>
      <td className="p-4">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
            getTypeBadgeColor(category.type),
          )}
        >
          <TypeIcon className="h-3 w-3 mr-1" />
          {getTypeLabel(category.type)}
        </span>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(category)}
            disabled={isUpdating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(category.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
