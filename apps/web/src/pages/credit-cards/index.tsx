import { CreditCardFormModal } from '@/components/credit-cards/CreditCardFormModal';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCreditCards } from '@/hooks/useCreditCards';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { CreateCreditCardPayload, CreditCard } from '@/services/creditCardService';
import { useCompanyStore } from '@/stores/company';
import { useMemo, useState } from 'react';
import { CreditCardsEmptyState } from './components/CreditCardsEmptyState';
import { CreditCardsErrorState } from './components/CreditCardsErrorState';
import { CreditCardsFilters } from './components/CreditCardsFilters';
import { CreditCardsHeader } from './components/CreditCardsHeader';
import { CreditCardsList } from './components/CreditCardsList';
import { useCreditCardFilters } from './hooks/useCreditCardFilters';
import { useCreditCardSorting } from './hooks/useCreditCardSorting';

export function CreditCardsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const {
    creditCards,
    isLoading,
    error,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCreditCards(companyId);
  const { canCreateCreditCard } = usePlanLimits();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCreditCard, setEditingCreditCard] = useState<CreditCard | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode('credit-cards-view-mode');

  const { searchTerm, setSearchTerm, filterCreditCards, hasActiveFilters } =
    useCreditCardFilters();

  const { sortConfig, handleSort, sortCreditCards } = useCreditCardSorting();

  const filteredAndSortedCreditCards = useMemo(() => {
    if (!creditCards) return [];
    const filtered = filterCreditCards(creditCards);
    return sortCreditCards(filtered);
  }, [creditCards, filterCreditCards, sortCreditCards]);

  const handleCreate = () => {
    setEditingCreditCard(null);
    setShowFormModal(true);
  };

  const handleEdit = (creditCard: CreditCard) => {
    setEditingCreditCard(creditCard);
    setShowFormModal(true);
  };

  const handleSubmit = async (data: CreateCreditCardPayload) => {
    if (editingCreditCard) {
      updateCreditCard({ id: editingCreditCard.id, data });
    } else {
      createCreditCard(data);
    }
    setShowFormModal(false);
    setEditingCreditCard(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCreditCard(deleteId);
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
          <Loading size="large">Carregando cartões de crédito, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return <CreditCardsErrorState error={error} />;
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar cartões de crédito, você precisa criar uma empresa primeiro.
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
          <CreditCardsHeader onCreate={handleCreate} canCreate={canCreateCreditCard} />

          <CreditCardsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredAndSortedCreditCards.length === 0 ? (
            <CreditCardsEmptyState hasFilters={hasActiveFilters} onCreate={handleCreate} />
          ) : (
            <CreditCardsList
              creditCards={filteredAndSortedCreditCards}
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
      <CreditCardFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCreditCard(null);
        }}
        onSubmit={handleSubmit}
        creditCard={editingCreditCard}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
