import { useState, useEffect, useCallback } from 'react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanyStore } from '@/stores/company';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCreditCardBills } from './hooks/useCreditCardBills';
import { useBillNavigation } from './hooks/useBillNavigation';
import { useCreditCardManagement } from './hooks/useCreditCardManagement';
import { useAllCardsBillTotals } from './hooks/useAllCardsBillTotals';
import { CreditCardCardsContainer } from './components/CreditCardCardsContainer';
import { CreditCardSummary } from './components/CreditCardSummary';
import { BillCard } from './components/BillCard';
import { BillEmptyState } from './components/BillEmptyState';
import { BillErrorState } from './components/BillErrorState';
import { CreditCardModals } from './components/CreditCardModals';
import { NoCreditCardsState } from './components/NoCreditCardsState';

export function CreditCardBillsPageDesktop() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const searchTermToSend = debouncedSearch.length >= 3 ? debouncedSearch : undefined;

  const { creditCards, isLoading: isLoadingCards } = useCreditCards(companyId);
  const { currentMonth, goToPreviousMonth, goToNextMonth, canGoPrevious, canGoNext } =
    useBillNavigation();
  const { cardLimitsUsed, aggregated } = useAllCardsBillTotals({
    companyId,
    creditCards: creditCards ?? [],
    month: currentMonth,
  });

  const hasCards = creditCards && creditCards.length > 0;

  const {
    creditCard,
    currentBill,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    pagination,
    isFetching,
  } = useCreditCardBills(selectedCardId, currentMonth, searchTermToSend);

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
    if (isLoadingCards || !hasCards) return;

    if (!selectedCardId || !creditCards?.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(creditCards?.[0]?.id ?? '');
    }
  }, [creditCards, selectedCardId, isLoadingCards, hasCards]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const isSearching = searchInput !== debouncedSearch;

  const renderCardsContainer = () => (
    <CreditCardCardsContainer
      creditCards={creditCards ?? []}
      selectedCardId={selectedCardId}
      onCardSelect={handleCardSelect}
      onEditCard={handlers.onEditCard}
      onDeleteCard={handlers.onDeleteCard}
      onAddCard={handlers.onAddCard}
      cardLimitsUsed={cardLimitsUsed}
    />
  );

  if (isLoadingCards) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="large">Carregando cartões, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (!hasCards) {
    return (
      <ViewDefault>
        <NoCreditCardsState onAddCard={handlers.onAddCard} />
        <CreditCardModals formModal={formModal} deleteModal={deleteModal} />
      </ViewDefault>
    );
  }

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="-m-4 sm:-m-6 lg:-m-6">
          {renderCardsContainer()}
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loading size="large">Carregando fatura, por favor aguarde...</Loading>
          </div>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="-m-4 sm:-m-6 lg:-m-6">
          {renderCardsContainer()}
          <div className="container mx-auto px-4 py-4 lg:px-6">
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <BillErrorState error={error} />
            </div>
          </div>
        </div>
        <CreditCardModals formModal={formModal} deleteModal={deleteModal} />
      </ViewDefault>
    );
  }

  const billTotal = currentBill?.total ?? 0;
  const limitAvailable = aggregated?.totalAvailable ?? (creditCard?.limit ?? 0) - billTotal;
  const limitTotal = aggregated?.totalLimit ?? creditCard?.limit ?? 0;
  const totalUsed = aggregated?.totalUsed ?? billTotal;

  return (
    <ViewDefault>
      <div className="-m-4 sm:-m-6 lg:-m-6">
        {renderCardsContainer()}

        <CreditCardSummary
          limitAvailable={limitAvailable}
          limitTotal={limitTotal}
          billTotal={totalUsed}
          billStatus={currentBill?.status}
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
              searchTerm={searchInput}
              onSearchChange={handleSearchChange}
              isSearching={isSearching || isFetching}
            />
          ) : (
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <BillEmptyState />
            </div>
          )}
        </div>
      </div>

      <CreditCardModals formModal={formModal} deleteModal={deleteModal} />
    </ViewDefault>
  );
}
