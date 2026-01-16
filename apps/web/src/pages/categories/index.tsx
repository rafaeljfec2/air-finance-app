import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCategories } from '@/hooks/useCategories';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Category, CreateCategory } from '@/services/categoryService';
import { useCompanyStore } from '@/stores/company';
import { useMemo, useState } from 'react';
import { CategoriesEmptyState } from './components/CategoriesEmptyState';
import { CategoriesErrorState } from './components/CategoriesErrorState';
import { CategoriesFilters } from './components/CategoriesFilters';
import { CategoriesHeader } from './components/CategoriesHeader';
import { CategoriesList } from './components/CategoriesList';
import { useCategoryFilters } from './hooks/useCategoryFilters';
import { useCategorySorting } from './hooks/useCategorySorting';

export function CategoriesPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories(companyId);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode('categories-view-mode');

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCategories,
    hasActiveFilters,
  } = useCategoryFilters();

  const { sortConfig, handleSort, sortCategories } = useCategorySorting();

  const filteredAndSortedCategories = useMemo(() => {
    if (!categories) return [];
    const filtered = filterCategories(categories);
    return sortCategories(filtered);
  }, [categories, filterCategories, sortCategories]);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowFormModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateCategory) => {
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, data });
    } else {
      createCategory(data);
    }
    setShowFormModal(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCategory(deleteId);
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Loading size="large">Carregando categorias, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <CategoriesErrorState error={error} />;
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar categorias, você precisa criar uma empresa primeiro.
            </p>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <CategoriesHeader onCreate={handleCreate} />

          <CategoriesFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedCategories.length === 0 ? (
            <CategoriesEmptyState hasFilters={hasActiveFilters} onCreate={handleCreate} />
          ) : (
            <CategoriesList
              categories={filteredAndSortedCategories}
              viewMode={viewMode}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        category={editingCategory}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
