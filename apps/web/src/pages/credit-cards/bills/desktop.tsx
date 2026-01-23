import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCreditCardBills } from './hooks/useCreditCardBills';
import { useBillNavigation } from './hooks/useBillNavigation';
import { BillSummary } from './components/BillSummary';
import { BillTransactionList } from './components/BillTransactionList';
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

  const { creditCard, currentBill, isLoading, isLoadingMore, error, loadMore, hasMore } =
    useCreditCardBills(selectedCardId, currentMonth);

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

  // Calculate the display month based on the bill period for desktop
  const displayMonth = useMemo(() => {
    if (!currentBill || !creditCard) {
      return currentMonth;
    }
    const [year, monthNum] = currentMonth.split('-').map(Number);
    const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
    const nextYear = monthNum === 12 ? year + 1 : year;
    return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
  }, [currentBill, creditCard, currentMonth]);

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
          <div className="container mx-auto px-4 py-2 sm:py-4">
            {/* Desktop Header */}
            <div className="mb-6">
              <div
                className="relative rounded-xl shadow-md overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${creditCard?.color ?? '#8A05BE'}80 0%, ${creditCard?.color ?? '#8A05BE'}60 100%)`,
                }}
              >
              <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
              <div className="relative p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigate('/home')}
                    className="text-white/80 hover:text-white/95 transition-all flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white/5"
                  >
                    <span className="text-sm font-normal">← Voltar</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {creditCards && creditCards.length > 1 ? (
                      <select
                        value={selectedCardId}
                        onChange={(e) => handleCardSelect(e.target.value)}
                        className="text-xl font-medium text-white/90 border-none outline-none cursor-pointer rounded-lg px-3 py-1.5 hover:bg-white/5 transition-all bg-transparent"
                      >
                        {(creditCards ?? []).map((card) => (
                          <option key={card.id} value={card.id} className="bg-gray-900">
                            {card.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <h1 className="text-xl font-medium text-white/90 uppercase">
                        {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
                      </h1>
                    )}
                  </div>
                  {currentMonth && goToPreviousMonth && goToNextMonth && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={goToPreviousMonth}
                        disabled={!canGoPrevious}
                        className="text-white/80 hover:text-white/95 disabled:opacity-25 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 disabled:hover:bg-transparent"
                      >
                        <span className="text-sm font-normal">← Anterior</span>
                      </button>
                      <span className="text-base font-medium text-white/90 min-w-[140px] text-center capitalize">
                        {new Date(`${displayMonth}-01`).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        disabled={!canGoNext}
                        className="text-white/80 hover:text-white/95 disabled:opacity-25 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 disabled:hover:bg-transparent"
                      >
                        <span className="text-sm font-normal">Próximo →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
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
          <div className="container mx-auto px-4 py-2 sm:py-4">
            {/* Desktop Header */}
            <div className="mb-6">
              <div
                className="relative rounded-xl shadow-md overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${creditCard?.color ?? '#8A05BE'}80 0%, ${creditCard?.color ?? '#8A05BE'}60 100%)`,
                }}
              >
              <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
              <div className="relative p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigate('/home')}
                    className="text-white/80 hover:text-white/95 transition-all flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white/5"
                  >
                    <span className="text-sm font-normal">← Voltar</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {creditCards && creditCards.length > 1 ? (
                      <select
                        value={selectedCardId}
                        onChange={(e) => handleCardSelect(e.target.value)}
                        className="text-xl font-medium text-white/90 border-none outline-none cursor-pointer rounded-lg px-3 py-1.5 hover:bg-white/5 transition-all bg-transparent"
                      >
                        {(creditCards ?? []).map((card) => (
                          <option key={card.id} value={card.id} className="bg-gray-900">
                            {card.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <h1 className="text-xl font-medium text-white/90 uppercase">
                        {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
                      </h1>
                    )}
                  </div>
                  {currentMonth && goToPreviousMonth && goToNextMonth && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={goToPreviousMonth}
                        disabled={!canGoPrevious}
                        className="text-white/80 hover:text-white/95 disabled:opacity-25 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 disabled:hover:bg-transparent"
                      >
                        <span className="text-sm font-normal">← Anterior</span>
                      </button>
                      <span className="text-base font-medium text-white/90 min-w-[140px] text-center capitalize">
                        {new Date(`${displayMonth}-01`).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        disabled={!canGoNext}
                        className="text-white/80 hover:text-white/95 disabled:opacity-25 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 disabled:hover:bg-transparent"
                      >
                        <span className="text-sm font-normal">Próximo →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
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
        <div className="container mx-auto px-4 py-2 sm:py-4">
          {/* Desktop Header */}
          <div className="mb-6">
            <div
              className="relative rounded-xl shadow-md overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${creditCard?.color ?? '#8A05BE'}80 0%, ${creditCard?.color ?? '#8A05BE'}60 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
              <div className="relative p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigate('/home')}
                    className="text-white/80 hover:text-white/95 transition-all flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white/5"
                  >
                    <span className="text-sm font-normal">← Voltar</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {creditCards && creditCards.length > 1 ? (
                      <select
                        value={selectedCardId}
                        onChange={(e) => handleCardSelect(e.target.value)}
                        className="text-xl font-medium text-white/90 border-none outline-none cursor-pointer rounded-lg px-3 py-1.5 hover:bg-white/5 transition-all bg-transparent"
                      >
                        {(creditCards ?? []).map((card) => (
                          <option key={card.id} value={card.id} className="bg-gray-900">
                            {card.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <h1 className="text-xl font-medium text-white/90 uppercase">
                        {creditCard?.name ?? 'CARTÃO DE CRÉDITO'}
                      </h1>
                    )}
                  </div>
                  {currentMonth && goToPreviousMonth && goToNextMonth && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={goToPreviousMonth}
                        disabled={!canGoPrevious}
                        className="text-white/80 hover:text-white/95 disabled:opacity-25 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 disabled:hover:bg-transparent"
                      >
                        <span className="text-sm font-normal">← Anterior</span>
                      </button>
                      <span className="text-base font-medium text-white/90 min-w-[140px] text-center capitalize">
                        {new Date(`${displayMonth}-01`).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        disabled={!canGoNext}
                        className="text-white/80 hover:text-white/95 disabled:opacity-25 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 disabled:hover:bg-transparent"
                      >
                        <span className="text-sm font-normal">Próximo →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Summary Card */}
            <div className="col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
                <BillSummary
                  dueDate={currentBill.dueDate}
                  status={currentBill.status}
                  total={currentBill.total}
                />
              </div>
            </div>

            {/* Transactions */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
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
      </div>
    </ViewDefault>
  );
}
