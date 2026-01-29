import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/Loading';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { useResponsiveBreakpoint } from '@/hooks/useResponsiveBreakpoint';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanyStore } from '@/stores/company';
import { useCreditCardBills } from './hooks/useCreditCardBills';
import { useBillNavigation } from './hooks/useBillNavigation';
import { useCreditCardManagement } from './hooks/useCreditCardManagement';
import { CreditCardBillHeader } from './components/CreditCardBillHeader';
import { BillSummary } from './components/BillSummary';
import { BillTransactionList } from './components/BillTransactionList';
import { BillEmptyState } from './components/BillEmptyState';
import { BillErrorState } from './components/BillErrorState';
import { CreditCardModals } from './components/CreditCardModals';
import { CreditCardBillsPageDesktop } from './desktop';

export function CreditCardBillsPage() {
  const navigate = useNavigate();
  const { isDesktop } = useResponsiveBreakpoint();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { creditCards } = useCreditCards(companyId);
  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useBillNavigation();

  const {
    creditCard,
    currentBill,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    isInitialLoad,
  } = useCreditCardBills(selectedCardId, currentMonth);

  const handleCardSelect = useCallback(
    (newCardId: string) => {
      if (newCardId !== selectedCardId) {
        setSelectedCardId(newCardId);
      }
    },
    [selectedCardId],
  );

  const { formModal, deleteModal, handlers } = useCreditCardManagement({
    creditCards: creditCards ?? [],
    selectedCardId,
    onSelectCard: setSelectedCardId,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!creditCards || creditCards.length === 0) {
      navigate('/credit-cards/bills', { replace: true });
      return;
    }

    if (!selectedCardId || !creditCards.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(creditCards[0].id);
    }
  }, [creditCards, selectedCardId, isLoading, navigate]);

  if (isDesktop) {
    return <CreditCardBillsPageDesktop />;
  }

  const openFabModal = () => setIsFabModalOpen(true);
  const closeFabModal = () => setIsFabModalOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const renderBillHeader = (billProps?: {
    billTotal?: number;
    billStatus?: 'OPEN' | 'CLOSED' | 'PAID';
    dueDate?: string;
  }) => (
    <CreditCardBillHeader
      creditCard={creditCard}
      creditCards={creditCards ?? []}
      onCardSelect={handleCardSelect}
      month={currentMonth}
      onPreviousMonth={goToPreviousMonth}
      onNextMonth={goToNextMonth}
      canGoPrevious={canGoPrevious}
      canGoNext={canGoNext}
      onMenuClick={openSidebar}
      onEditCard={handlers.onEditCard}
      onDeleteCard={handlers.onDeleteCard}
      onAddCard={handlers.onAddCard}
      {...billProps}
    />
  );

  const renderMobileNavigation = () => (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <MobileBottomNav onNewTransaction={openFabModal} />
      <TransactionTypeModal isOpen={isFabModalOpen} onClose={closeFabModal} />
      <CreditCardModals formModal={formModal} deleteModal={deleteModal} />
    </>
  );

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-background dark:bg-background-dark pb-20 lg:pb-0">
          <Loading size="large">Carregando fatura, por favor aguarde...</Loading>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          {renderBillHeader()}
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark">
            <BillErrorState error={error} />
          </div>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (!currentBill && !isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          {renderBillHeader()}
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark flex flex-col">
            <BillEmptyState />
          </div>
        </div>
        {renderMobileNavigation()}
      </>
    );
  }

  if (!currentBill) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
        {renderBillHeader({
          billTotal: currentBill.total,
          billStatus: currentBill.status,
          dueDate: currentBill.dueDate,
        })}

        <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark relative flex flex-col">
          {isLoading && !isInitialLoad && (
            <div className="absolute inset-0 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loading size="large">Carregando...</Loading>
            </div>
          )}
          <BillSummary
            dueDate={currentBill.dueDate}
            status={currentBill.status}
            total={currentBill.total}
          />

          <div className="flex-1 px-4 pb-4">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
              <BillTransactionList
                transactions={currentBill.transactions}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </div>
          </div>
        </div>
      </div>

      {renderMobileNavigation()}
    </>
  );
}
