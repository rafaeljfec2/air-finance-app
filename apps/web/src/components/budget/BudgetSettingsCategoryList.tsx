import type { Category } from '@/services/categoryService';

interface BudgetSettingsCategoryListProps {
  readonly categories: Category[];
  readonly excludedIds: Set<string>;
  readonly onToggle: (categoryId: string) => void;
  readonly isEmptySearch?: boolean;
}

export function BudgetSettingsCategoryList({
  categories,
  excludedIds,
  onToggle,
  isEmptySearch = false,
}: BudgetSettingsCategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {isEmptySearch
          ? 'Nenhuma categoria encontrada para sua pesquisa'
          : 'Nenhuma categoria de despesa encontrada'}
      </div>
    );
  }

  return (
    <ul className="divide-y dark:divide-gray-700">
      {categories.map((category) => (
        <li key={category.id}>
          <label className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={excludedIds.has(category.id)}
              onChange={() => onToggle(category.id)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">{category.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
