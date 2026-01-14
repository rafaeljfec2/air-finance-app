import { CompanyFormModal } from '@/components/companies/CompanyFormModal';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCompanies } from '@/hooks/useCompanies';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { CreateCompany } from '@/services/companyService';
import { Company } from '@/types/company';
import { useMemo, useState } from 'react';
import { CompaniesEmptyState } from './components/CompaniesEmptyState';
import { CompaniesErrorState } from './components/CompaniesErrorState';
import { CompaniesFilters } from './components/CompaniesFilters';
import { CompaniesHeader } from './components/CompaniesHeader';
import { CompaniesList } from './components/CompaniesList';
import { useCompanyFilters } from './hooks/useCompanyFilters';
import { useCompanySorting } from './hooks/useCompanySorting';

export function CompaniesPage() {
  const {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCompanies();
  const { canCreateCompany } = usePlanLimits();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode('companies-view-mode');

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCompanies,
    hasActiveFilters,
  } = useCompanyFilters();

  const { sortConfig, handleSort, sortCompanies } = useCompanySorting();

  const filteredAndSortedCompanies = useMemo(() => {
    if (!companies) return [];
    const filtered = filterCompanies(companies);
    return sortCompanies(filtered);
  }, [companies, filterCompanies, sortCompanies]);

  const handleCreate = () => {
    setEditingCompany(null);
    setShowFormModal(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateCompany) => {
    if (editingCompany) {
      updateCompany({ id: editingCompany.id, data });
    } else {
      createCompany(data);
    }
    setShowFormModal(false);
    setEditingCompany(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCompany(deleteId);
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
          <Loading size="large">Carregando empresas, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <CompaniesErrorState error={error} />;
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <CompaniesHeader onCreate={handleCreate} canCreate={canCreateCompany} />

          <CompaniesFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedCompanies.length === 0 ? (
            <CompaniesEmptyState hasFilters={hasActiveFilters} onCreate={handleCreate} />
          ) : (
            <CompaniesList
              companies={filteredAndSortedCompanies}
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
      <CompanyFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCompany(null);
        }}
        onSubmit={handleSubmit}
        company={editingCompany}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
