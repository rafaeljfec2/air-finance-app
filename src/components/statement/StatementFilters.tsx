import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Category } from '@/types/transaction';

interface StatementFiltersProps {
  categories: Category[];
  onSearch: (term: string) => void;
  onFilterCategory: (categoryId: string | null) => void;
}

export function StatementFilters({ categories, onSearch, onFilterCategory }: StatementFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar transações..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`inline-flex items-center px-4 py-2 border ${
              selectedCategory
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {selectedCategory ? 'Filtrado' : 'Filtrar'}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    !selectedCategory
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.nome}
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