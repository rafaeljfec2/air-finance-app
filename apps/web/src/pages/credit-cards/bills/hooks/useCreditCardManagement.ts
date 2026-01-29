import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanyStore } from '@/stores/company';
import type { CreditCard, CreateCreditCardPayload } from '@/services/creditCardService';

interface UseCreditCardManagementParams {
  readonly creditCards: ReadonlyArray<CreditCard>;
  readonly selectedCardId: string;
  readonly onSelectCard: (id: string) => void;
}

export function useCreditCardManagement({
  creditCards,
  selectedCardId,
  onSelectCard,
}: UseCreditCardManagementParams) {
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const {
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCreditCards(companyId);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingCard, setDeletingCard] = useState<CreditCard | null>(null);

  const handleAddCard = useCallback(() => {
    setEditingCard(null);
    setShowFormModal(true);
  }, []);

  const handleEditCard = useCallback((card: CreditCard) => {
    setEditingCard(card);
    setShowFormModal(true);
  }, []);

  const handleSubmitCard = useCallback(
    async (data: CreateCreditCardPayload) => {
      if (editingCard) {
        await updateCreditCard({ id: editingCard.id, data });
      } else {
        await createCreditCard(data);
      }
      setShowFormModal(false);
      setEditingCard(null);
    },
    [editingCard, updateCreditCard, createCreditCard],
  );

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingCard(null);
  }, []);

  const handleDeleteCard = useCallback((card: CreditCard) => {
    setDeletingCard(card);
    setShowConfirmDelete(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deletingCard) {
      await deleteCreditCard(deletingCard.id);
      if (deletingCard.id === selectedCardId && creditCards.length > 1) {
        const nextCard = creditCards.find((card) => card.id !== deletingCard.id);
        if (nextCard) {
          onSelectCard(nextCard.id);
        }
      } else if (creditCards.length <= 1) {
        navigate('/credit-cards/bills', { replace: true });
      }
    }
    setShowConfirmDelete(false);
    setDeletingCard(null);
  }, [deletingCard, deleteCreditCard, selectedCardId, creditCards, navigate, onSelectCard]);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setDeletingCard(null);
  }, []);

  return {
    formModal: {
      isOpen: showFormModal,
      card: editingCard,
      isLoading: isCreating || isUpdating,
      onClose: handleCloseFormModal,
      onSubmit: handleSubmitCard,
    },
    deleteModal: {
      isOpen: showConfirmDelete,
      card: deletingCard,
      isLoading: isDeleting,
      onConfirm: confirmDelete,
      onCancel: cancelDelete,
    },
    handlers: {
      onAddCard: handleAddCard,
      onEditCard: handleEditCard,
      onDeleteCard: handleDeleteCard,
    },
  };
}
