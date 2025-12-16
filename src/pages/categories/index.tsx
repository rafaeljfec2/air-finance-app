import { useState, useMemo, useEffect } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCategories } from '@/hooks/useCategories';
import { useCompanyStore } from '@/stores/company';
import { TagIcon } from '@heroicons/react/24/outline';
import { Plus, Search, Edit, Trash2, Grid3x3, List } from 'lucide-react';
import { Category } from '@/services/categoryService';
import { CreateCategory } from '@/services/categoryService';
import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { Loading } from '@/components/Loading';
import { cn } from '@/lib/utils';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  GiftIcon,
  ShoppingCartIcon,
  TagIcon as TagIconHero,
  WalletIcon,
} from '@heroicons/react/24/outline';

const iconOptions = [
  { value: 'TagIcon', icon: TagIconHero },
  { value: 'ArrowTrendingUpIcon', icon: ArrowTrendingUpIcon },
  { value: 'ArrowTrendingDownIcon', icon: ArrowTrendingDownIcon },
  { value: 'WalletIcon', icon: WalletIcon },
  { value: 'ShoppingCartIcon', icon: ShoppingCartIcon },
  { value: 'GiftIcon', icon: GiftIcon },
  { value: 'BuildingLibraryIcon', icon: BuildingLibraryIcon },
] as const;

const categoryTypes = [
  { value: 'income', label: 'Receita', icon: ArrowTrendingUpIcon },
  { value: 'expense', label: 'Despesa', icon: ArrowTrendingDownIcon },
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('categories-view-mode');
    if (saved === 'grid' || saved === 'list') {
      return saved;
    }
    return 'grid';
  });

  useEffect(() => {
    localStorage.setItem('categories-view-mode', viewMode);
  }, [viewMode]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || category.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [categories, searchTerm, filterType]);

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
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="text-red-500">Erro ao carregar categorias: {error.message}</div>
        </div>
      </ViewDefault>
    );
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
            <Button
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => (window.location.href = '/companies')}
            >
              Criar empresa
            </Button>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TagIcon className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Categorias</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie suas categorias de receitas e despesas
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Categoria
            </Button>
          </div>

          {/* Busca e Filtros */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                    <span>
                      {filterType === 'all'
                        ? 'Todos os tipos'
                        : getTypeLabel(filterType as CategoryType)}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {categoryTypes.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 border border-border dark:border-border-dark rounded-md overflow-hidden bg-background dark:bg-background-dark">
                <Button
                    type="button"
                    variant="ghost"
                  size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex-1 rounded-none border-0',
                      viewMode === 'grid'
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
                    )}
                >
                    <Grid3x3 className="h-4 w-4" />
                </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex-1 rounded-none border-0',
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de Categorias */}
          {filteredCategories.length === 0 ? (
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-12 text-center">
                <TagIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                {(() => {
                  const hasFilters = searchTerm || filterType !== 'all';
                  const emptyTitle = hasFilters
                    ? 'Nenhuma categoria encontrada'
                    : 'Nenhuma categoria cadastrada';
                  const emptyDescription = hasFilters
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira categoria';

                  return (
                    <>
                      <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
                        {emptyTitle}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {emptyDescription}
                      </p>
                      {!hasFilters && (
                        <Button
                          onClick={handleCreate}
                          className="bg-primary-500 hover:bg-primary-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Primeira Categoria
                        </Button>
                      )}
                    </>
                  );
                })()}
              </div>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const Icon =
                      iconOptions.find((t) => t.value === category.icon)?.icon || TagIconHero;
                const TypeIcon =
                      categoryTypes.find((t) => t.value === category.type)?.icon || TagIconHero;
                return (
                      <Card
                        key={category.id}
                        className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      >
                                <Icon className="h-6 w-6 text-white" />
                      </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-1 truncate">
                          {category.name}
                                </h3>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                    getTypeBadgeColor(category.type as CategoryType),
                                  )}
                                >
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {getTypeLabel(category.type as CategoryType)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(category)}
                              disabled={isUpdating}
                              className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(category.id)}
                              disabled={isDeleting}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCategories.map((category) => {
                    const Icon =
                      iconOptions.find((t) => t.value === category.icon)?.icon || TagIconHero;
                    const TypeIcon =
                      categoryTypes.find((t) => t.value === category.type)?.icon || TagIconHero;
                    return (
                      <Card
                        key={category.id}
                        className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Informações principais */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                              >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                                    {category.name}
                                  </h3>
                                  <span
                                    className={cn(
                                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                      getTypeBadgeColor(category.type as CategoryType),
                                    )}
                                  >
                                    <TypeIcon className="h-3 w-3 mr-1" />
                                    {getTypeLabel(category.type as CategoryType)}
                                  </span>
                        </div>
                      </div>
                    </div>

                            {/* Ações */}
                            <div className="flex gap-2 md:flex-shrink-0">
                      <Button
                        size="sm"
                                variant="outline"
                                onClick={() => handleEdit(category)}
                        disabled={isUpdating}
                                className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                      >
                                <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                                variant="outline"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
                      >
                                <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                          </div>
                        </div>
                      </Card>
                );
              })}
                </div>
              )}
            </>
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
