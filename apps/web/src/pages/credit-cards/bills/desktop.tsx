import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCreditCardBills } from './hooks/useCreditCardBills';
import { useBillNavigation } from './hooks/useBillNavigation';
import { ConsolidatedHeader } from './components/ConsolidatedHeader';
import { BillCard } from './components/BillCard';
import { LimitUsageCard } from './components/LimitUsageCard';
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

  const limitInfo = useMemo(() => {
    const limitTotal = creditCard?.limit ?? 0;
    const limitUsed = currentBill?.total ?? 0;
    const limitAvailable = Math.max(0, limitTotal - limitUsed);
    return { limitTotal, limitUsed, limitAvailable };
  }, [creditCard?.limit, currentBill?.total]);

  const bestPurchaseDay = useMemo(() => {
    if (!creditCard?.closingDay) return 1;
    const closingDay = creditCard.closingDay;
    return closingDay < 28 ? closingDay + 1 : 1;
  }, [creditCard?.closingDay]);

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center min-h-[60vh] bg-background dark:bg-background-dark">
          <Loading size="large">Carregando fatura, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/credit-cards')}
          className="p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5 text-text dark:text-text-dark" />
        </button>
        {creditCards && creditCards.length > 1 ? (
          <div className="relative inline-flex items-center">
            <select
              value={selectedCardId}
              onChange={(e) => handleCardSelect(e.target.value)}
              className="text-xl font-semibold text-text dark:text-text-dark bg-transparent pr-8 cursor-pointer appearance-none focus:outline-none hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {creditCards.map((card) => (
                <option key={card.id} value={card.id} className="bg-card dark:bg-card-dark text-text dark:text-text-dark">
                  {card.name}
                </option>
              ))}
            </select>
            <svg className="h-4 w-4 text-text-muted dark:text-text-muted-dark absolute right-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-text dark:text-text-dark">
            {creditCard?.name ?? 'Cartão de Crédito'}
          </h1>
        )}
      </div>
    </div>
  );

  if (error) {
    return (
      <ViewDefault>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4 lg:py-6">
            {renderHeader()}
            <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <BillErrorState error={error} />
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  if (!currentBill) {
    return (
      <ViewDefault>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4 lg:py-6">
            {renderHeader()}
            <ConsolidatedHeader
              limitTotal={limitInfo.limitTotal}
              limitUsed={0}
              limitAvailable={limitInfo.limitTotal}
            />
            <div className="mt-6 bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark">
              <BillEmptyState />
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          {renderHeader()}

          <ConsolidatedHeader
            limitTotal={limitInfo.limitTotal}
            limitUsed={limitInfo.limitUsed}
            limitAvailable={limitInfo.limitAvailable}
            cardColor={creditCard?.color}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-6">
                <LimitUsageCard
                  limitTotal={limitInfo.limitTotal}
                  limitUsed={limitInfo.limitUsed}
                  limitAvailable={limitInfo.limitAvailable}
                  dueDay={creditCard?.dueDay ?? 1}
                  bestPurchaseDay={bestPurchaseDay}
                  billStatus={currentBill.status}
                />
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
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
            </div>
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
