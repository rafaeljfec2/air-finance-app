import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Category } from '@/types/transaction';

interface StatementFiltersProps {
  categories: Category[];
  onSearch: (term: string) => void;
  onFilterCategory: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

export function StatementFilters({ 
  categories, 
  onSearch, 
  onFilterCategory,
  selectedCategory: externalSelectedCategory = null 
}: StatementFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(externalSelectedCategory);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onFilterCategory(categoryId);
    setIsFilterOpen(false);
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar transações..."
            className="block w-full pl-10 pr-3 py-2 border border-border dark:border-border-dark rounded-lg bg-background dark:bg-background-dark text-text dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`inline-flex items-center px-4 py-2 border ${
              selectedCategory
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-border dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {selectedCategory ? 'Filtrado' : 'Filtrar'}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-card dark:bg-card-dark ring-1 ring-border dark:ring-border-dark z-10">
              <div className="py-1">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    !selectedCategory
                      ? 'bg-background dark:bg-background-dark text-text dark:text-text-dark'
                      : 'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark'
                  }`}
                >
                  Todas as categorias
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedCategory === category.id
                        ? 'bg-background dark:bg-background-dark text-text dark:text-text-dark'
                        : 'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 