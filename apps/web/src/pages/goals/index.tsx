import { GoalFormModal } from '@/components/goals/GoalFormModal';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useGoals } from '@/hooks/useGoals';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { CreateGoal, Goal } from '@/services/goalService';
import { useCompanyStore } from '@/stores/company';
import { useMemo, useState } from 'react';
import { GoalsEmptyState } from './components/GoalsEmptyState';
import { GoalsErrorState } from './components/GoalsErrorState';
import { GoalsFilters } from './components/GoalsFilters';
import { GoalsHeader } from './components/GoalsHeader';
import { GoalsList } from './components/GoalsList';
import { useGoalFilters } from './hooks/useGoalFilters';
import { useGoalSorting } from './hooks/useGoalSorting';

export function GoalsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGoals(companyId);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode('goals-view-mode');

  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGoals,
    hasActiveFilters,
  } = useGoalFilters();

  const { sortConfig, handleSort, sortGoals } = useGoalSorting();

  const filteredAndSortedGoals = useMemo(() => {
    if (!goals) return [];
    const filtered = filterGoals(goals);
    return sortGoals(filtered);
  }, [goals, filterGoals, sortGoals]);

  const handleCreate = () => {
    setEditingGoal(null);
    setShowFormModal(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateGoal) => {
    if (editingGoal) {
      updateGoal({ id: editingGoal.id, data });
    } else {
      createGoal(data);
    }
    setShowFormModal(false);
    setEditingGoal(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteGoal(deleteId);
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
          <Loading size="large">Carregando metas, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <GoalsErrorState error={error} />;
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">Para cadastrar metas, você precisa criar uma empresa primeiro.</p>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <GoalsHeader onCreate={handleCreate} />

          <GoalsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedGoals.length === 0 ? (
            <GoalsEmptyState hasFilters={hasActiveFilters} onCreate={handleCreate} />
          ) : (
            <GoalsList
              goals={filteredAndSortedGoals}
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
      <GoalFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSubmit}
        goal={editingGoal}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
