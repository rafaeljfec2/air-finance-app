import { Category } from '@/services/categoryService';
import {
  Gift,
  Landmark,
  ShoppingCart,
  Tag,
  TrendingDown,
  TrendingUp,
  Wallet,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
] as const;

type CategoryType = (typeof categoryTypes)[number]['value'];

function getTypeLabel(type: CategoryType): string {
  return categoryTypes.find((t) => t.value === type)?.label ?? type;
}

function getIcon(icon: string) {
  return iconOptions.find((t) => t.value === icon)?.icon || Tag;
}

interface CategoryListItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function CategoryListItem({
  category,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<CategoryListItemProps>) {
  const Icon = getIcon(category.icon);

  return (
    <div className="flex items-center gap-2.5 p-2 bg-card dark:bg-card-dark hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors rounded-lg border border-border/50 dark:border-border-dark/50">
      {/* Ícone com cor */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.color }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[13px] text-text dark:text-text-dark truncate leading-tight">
          {category.name}
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          {getTypeLabel(category.type)}
        </p>
      </div>

      {/* Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isUpdating || isDeleting}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1" align="end">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEdit(category)}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Editar
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
