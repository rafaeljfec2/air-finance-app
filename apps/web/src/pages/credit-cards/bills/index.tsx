import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loading } from '@/components/Loading';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { useCreditCardBills } from './hooks/useCreditCardBills';
import { useBillNavigation } from './hooks/useBillNavigation';
import { CreditCardBillHeader } from './components/CreditCardBillHeader';
import { BillSummary } from './components/BillSummary';
import { BillTransactionList } from './components/BillTransactionList';
import { BillEmptyState } from './components/BillEmptyState';
import { BillErrorState } from './components/BillErrorState';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanyStore } from '@/stores/company';
import { CreditCardBillsPageDesktop } from './desktop';

export function CreditCardBillsPage() {
  // All hooks must be called before any conditional returns
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const [selectedCardId, setSelectedCardId] = useState<string>(cardId ?? '');
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
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

  useEffect(() => {
    if (cardId) {
      setSelectedCardId(cardId);
    }
  }, [cardId]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Render desktop version if on desktop (after all hooks)
  if (isDesktop) {
    return <CreditCardBillsPageDesktop />;
  }

  const handleCardSelect = (newCardId: string) => {
    if (newCardId !== selectedCardId) {
      setSelectedCardId(newCardId);
      // Update URL without full navigation to avoid re-rendering the entire page
      navigate(`/credit-cards/${newCardId}/bills`, { replace: true });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-background dark:bg-background-dark pb-20 lg:pb-0">
          <Loading size="large">Carregando fatura, por favor aguarde...</Loading>
        </div>
        <MobileBottomNav
          onNewTransaction={() => setIsFabModalOpen(true)}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          <CreditCardBillHeader
            creditCard={creditCard}
            creditCards={creditCards ?? []}
            onCardSelect={handleCardSelect}
            month={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark">
            <BillErrorState error={error} />
          </div>
        </div>
        <MobileBottomNav
          onNewTransaction={() => setIsFabModalOpen(true)}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      </>
    );
  }

  if (!currentBill && !isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
          <CreditCardBillHeader
            creditCard={creditCard}
            creditCards={creditCards ?? []}
            onCardSelect={handleCardSelect}
            month={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background-dark flex flex-col">
            <BillEmptyState />
          </div>
        </div>
        <MobileBottomNav
          onNewTransaction={() => setIsFabModalOpen(true)}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
      </>
    );
  }

  if (!currentBill) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background dark:bg-background-dark overflow-hidden pb-20 lg:pb-0">
        <CreditCardBillHeader
          creditCard={creditCard}
          creditCards={creditCards ?? []}
          onCardSelect={handleCardSelect}
          month={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          billTotal={currentBill.total}
          billStatus={currentBill.status}
          dueDate={currentBill.dueDate}
        />

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

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <MobileBottomNav
        onNewTransaction={() => setIsFabModalOpen(true)}
        onMenuOpen={() => setIsSidebarOpen(true)}
      />

      <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />
    </>
  );
}
