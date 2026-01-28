import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCreditCardBills } from './hooks/useCreditCardBills';
import { useBillNavigation } from './hooks/useBillNavigation';
import { CreditCardHeader } from './components/CreditCardHeader';
import { CreditCardSummary } from './components/CreditCardSummary';
import { BillCard } from './components/BillCard';
import { BillEmptyState } from './components/BillEmptyState';
import { BillErrorState } from './components/BillErrorState';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanyStore } from '@/stores/company';

export function CreditCardBillsPageDesktop() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const [selectedCardId, setSelectedCardId] = useState<string>(cardId ?? '');
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
    pagination,
  } = useCreditCardBills(selectedCardId, currentMonth);

  useEffect(() => {
    if (cardId) {
      setSelectedCardId(cardId);
    }
  }, [cardId]);

  const handleCardSelect = (newCardId: string) => {
    if (newCardId !== selectedCardId) {
      setSelectedCardId(newCardId);
      navigate(`/credit-cards/${newCardId}/bills`, { replace: true });
    }
  };

  const handleBack = () => navigate('/credit-cards');

  const limitInfo = useMemo(() => {
    const limitTotal = creditCard?.limit ?? 0;
    const limitUsed = currentBill?.total ?? 0;
    const limitAvailable = Math.max(0, limitTotal - limitUsed);
    return { limitTotal, limitUsed, limitAvailable };
  }, [creditCard?.limit, currentBill?.total]);

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center min-h-[60vh] bg-background dark:bg-background-dark">
          <Loading size="large">Carregando fatura, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
          <CreditCardHeader
            creditCard={creditCard}
            creditCards={creditCards ?? []}
            onBack={handleBack}
            onCardSelect={handleCardSelect}
            selectedCardId={selectedCardId}
            limitUsed={limitInfo.limitUsed}
            limitTotal={limitInfo.limitTotal}
          />
          <div className="container mx-auto px-4 py-4 lg:px-6">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <BillErrorState error={error} />
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  const billTotal = currentBill?.total ?? 0;

  return (
    <ViewDefault>
      <div className="-m-4 sm:-m-6 lg:-m-6">
        <CreditCardHeader
          creditCard={creditCard}
          creditCards={creditCards ?? []}
          onBack={handleBack}
          onCardSelect={handleCardSelect}
          selectedCardId={selectedCardId}
          limitUsed={limitInfo.limitUsed}
          limitTotal={limitInfo.limitTotal}
        />

        <CreditCardSummary
          limitAvailable={limitInfo.limitAvailable}
          limitTotal={limitInfo.limitTotal}
          billTotal={billTotal}
        />

        <div className="px-4 pb-6 lg:px-6">
          {currentBill ? (
            <BillCard
              month={currentMonth}
              billTotal={currentBill.total}
              dueDate={currentBill.dueDate}
              status={currentBill.status}
              transactions={currentBill.transactions}
              totalTransactions={pagination.total}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
            />
          ) : (
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <BillEmptyState />
            </div>
          )}
        </div>
      </div>
    </ViewDefault>
  );
}
