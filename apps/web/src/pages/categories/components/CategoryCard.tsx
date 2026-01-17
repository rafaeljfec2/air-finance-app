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
  { value: 'income', label: 'Receita', icon: TrendingUp },
  { value: 'expense', label: 'Despesa', icon: TrendingDown },
] as const;

type CategoryType = (typeof categoryTypes)[number]['value'];

function getTypeLabel(type: CategoryType): string {
  return categoryTypes.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: CategoryType): string {
  const colors: Record<CategoryType, string> = {
    income: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    expense: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
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
    <div className="w-full rounded-lg transition-all text-left bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Ícone com cor personalizada */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: category.color }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Nome */}
            <h3 className="font-bold text-sm text-text dark:text-text-dark mb-1.5 line-clamp-1">
              {category.name}
            </h3>

            {/* Badge Tipo com ícone */}
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold border',
                getTypeBadgeColor(category.type),
              )}
            >
              <TypeIcon className="h-3 w-3 mr-1" />
              {getTypeLabel(category.type)}
            </span>
          </div>
        </div>

        {/* Menu Vertical */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 data-[state=open]:bg-muted"
                disabled={isUpdating || isDeleting}
              >
                <span className="sr-only">Abrir menu</span>
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
      </div>
    </div>
  );
}
