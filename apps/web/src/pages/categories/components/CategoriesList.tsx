import { CategoryTableRow } from '@/components/categories/CategoryTableRow';
import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn , SortConfig } from '@/components/ui/SortableColumn';
import { Category } from '@/services/categoryService';
import { CategoryCard } from './CategoryCard';

interface CategoriesListProps {
  categories: Category[];
  viewMode: 'grid' | 'list';
  sortConfig: SortConfig<'name' | 'type' | 'icon'> | null;
  onSort: (field: 'name' | 'type' | 'icon') => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function CategoriesList({
  categories,
  viewMode,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<CategoriesListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </RecordsGrid>
    );
  }

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-border-dark">
              <SortableColumn field="name" currentSort={sortConfig} onSort={onSort}>
                Categoria
              </SortableColumn>
              <SortableColumn field="type" currentSort={sortConfig} onSort={onSort}>
                Tipo
              </SortableColumn>
              <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryTableRow
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
