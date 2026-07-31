import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback, useMemo, useState } from 'react';

import { DetailSkeleton } from '@/components/skeletons';
import { useAccounts } from '@/hooks/useAccounts';
import { ViewDefault } from '@/layouts/ViewDefault';
import { DayExpensesModal } from '@/pages/dashboard/components/DayExpensesModal';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';

import { BillsCalendarCard } from './components/BillsCalendarCard';
import { BillSelector, type ClosedBillOption } from './components/BillSelector';
import { CreditCardsKpiStrip } from './components/CreditCardsKpiStrip';
import { CreditCardsV2Header } from './components/CreditCardsV2Header';
import { DayExpensesPanel } from './components/DayExpensesPanel';
import { EmptyOpenFinanceCards } from './components/EmptyOpenFinanceCards';
import { MonthSummaryCard } from './components/MonthSummaryCard';
import { OfCardsContainer } from './components/OfCardsContainer';
import type { ClosedBillDisplay } from './components/OfCreditCardVisual';
import { ProjectedInstallmentsModal } from './components/ProjectedInstallmentsModal';
import { QuickAnalysisCard } from './components/QuickAnalysisCard';
import { StatementErrorState } from './components/StatementErrorState';
import { UpcomingBillsCard } from './components/UpcomingBillsCard';
import { useAllCardDetails } from './hooks/useAllCardDetails';
import { useAllCardsOpenBills } from './hooks/useAllCardsOpenBills';
import { useComposedCreditCardBills } from './hooks/useComposedCreditCardBills';
import { useOpenFinanceCreditCards } from './hooks/useOpenFinanceCreditCards';
import { useTransactionsRange } from './hooks/useTransactionsRange';
import { buildCreditCardOverview } from './mappers/buildCreditCardOverview';
import { buildCreditCardsKpis } from './mappers/buildCreditCardsKpis';
import { buildQuickAnalysis } from './mappers/buildQuickAnalysis';
import { filterTransactionsByAccountIds } from './mappers/filterTransactionsByAccountIds';
import { getBestPurchaseDay } from './mappers/getBestPurchaseDay';
import { resolveComposedOpenBill } from './mappers/resolveComposedOpenBill';

const QUICK_ANALYSIS_WINDOW_DAYS = 30;

function isoDaysAgo(reference: Date, days: number): string {
  const date = new Date(reference);
  date.setDate(date.getDate() - days);
  return formatDateToLocalISO(date);
}

function toDateOnly(value: string): string {
  return value.split('T')[0] ?? value;
}

export function CreditCardsV2PageDesktop() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [todayIso] = useState(() => formatDateToLocalISO(new Date()));
  const today = useMemo(() => parseLocalDate(todayIso), [todayIso]);

  const { cards, isLoading: isLoadingCards, error: cardsError } = useOpenFinanceCreditCards();
  const { accounts } = useAccounts();
  const { detailsByCardId } = useAllCardDetails(companyId, cards);
  const { openBillByCardId } = useAllCardsOpenBills(companyId, cards, today);
  const { composedByAccountId } = useComposedCreditCardBills(companyId, today);

  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [isProjectedModalOpen, setIsProjectedModalOpen] = useState(false);

  const handleCardSelect = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setSelectedBillId(null);
    setIsProjectedModalOpen(false);
  }, []);

  const overviews = useMemo(
    () =>
      cards.map((card) => {
        const composed = composedByAccountId.get(card.id);
        const openBill = resolveComposedOpenBill({
          openBill: openBillByCardId.get(card.id) ?? null,
          composedTotal: composed?.total ?? null,
          sourceState: composed?.sourceState,
        });

        return buildCreditCardOverview({
          card,
          details: detailsByCardId.get(card.id) ?? null,
          openBill,
          referenceDate: today,
          sourceState: composed?.sourceState ?? null,
        });
      }),
    [cards, composedByAccountId, detailsByCardId, openBillByCardId, today],
  );

  const kpis = useMemo(() => buildCreditCardsKpis(overviews), [overviews]);

  const bestPurchaseDay = useMemo(
    () =>
      getBestPurchaseDay(
        cards.map((card) => ({
          name: card.name,
          closingDay: card.closingDay,
          dueDay: card.dueDay,
          isActive: overviews.find((overview) => overview.cardId === card.id)?.isActive ?? false,
        })),
        today,
      ),
    [cards, overviews, today],
  );

  const effectiveSelectedCardId = selectedCardId || (cards[0]?.id ?? '');

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === effectiveSelectedCardId) ?? cards[0] ?? null,
    [cards, effectiveSelectedCardId],
  );

  const selectedOverview = useMemo(
    () => overviews.find((overview) => overview.cardId === effectiveSelectedCardId) ?? null,
    [overviews, effectiveSelectedCardId],
  );

  const closedBills = useMemo<ClosedBillOption[]>(() => {
    if (!selectedCard) {
      return [];
    }
    const details = detailsByCardId.get(selectedCard.id);
    if (!details) {
      return [];
    }
    const referenceIso = todayIso;
    return details.bills
      .filter((bill) => toDateOnly(bill.dueDate) < referenceIso)
      .map((bill) => ({
        id: bill.id,
        amount: bill.amount,
        dueDate: toDateOnly(bill.dueDate),
      }));
  }, [detailsByCardId, selectedCard, todayIso]);

  const closedBillOverride = useMemo<ClosedBillDisplay | null>(() => {
    if (!selectedBillId) {
      return null;
    }
    const bill = closedBills.find((item) => item.id === selectedBillId);
    if (!bill) {
      return null;
    }
    return { amount: bill.amount, dueDate: bill.dueDate };
  }, [closedBills, selectedBillId]);

  const closingDays = useMemo(() => {
    if (typeof selectedCard?.closingDay !== 'number') {
      return [];
    }
    return [selectedCard.closingDay];
  }, [selectedCard]);

  const dueDates = useMemo(() => {
    if (!selectedCard) {
      return [];
    }
    const details = detailsByCardId.get(selectedCard.id);
    if (!details) {
      return [];
    }
    return details.bills.map((bill) => bill.dueDate);
  }, [detailsByCardId, selectedCard]);

  const cardAccountIds = useMemo(() => new Set(cards.map((card) => card.id)), [cards]);

  const quickAnalysisQuery = useTransactionsRange(
    companyId,
    isoDaysAgo(today, QUICK_ANALYSIS_WINDOW_DAYS - 1),
    todayIso,
  );
  const quickAnalysis = useMemo(
    () =>
      buildQuickAnalysis(
        filterTransactionsByAccountIds(quickAnalysisQuery.data ?? [], cardAccountIds),
        today,
      ),
    [quickAnalysisQuery.data, cardAccountIds, today],
  );

  const monthSummaryLabel = `até ${format(today, 'd MMM', { locale: ptBR })}.`;

  if (isLoadingCards) {
    return (
      <ViewDefault>
        <div className="px-4 py-10">
          <DetailSkeleton title="Cartões" />
        </div>
      </ViewDefault>
    );
  }

  if (cards.length === 0) {
    return (
      <ViewDefault>
        <EmptyOpenFinanceCards />
      </ViewDefault>
    );
  }

  if (cardsError) {
    return (
      <ViewDefault>
        <StatementErrorState error={cardsError} />
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="-m-4 sm:-m-6 lg:-m-6">
        <CreditCardsV2Header
          billSelector={
            <BillSelector
              closedBills={closedBills}
              selectedBillId={selectedBillId}
              openBillAmount={selectedOverview?.currentBillAmount ?? null}
              cycleBillAmount={selectedOverview?.cycleBillAmount ?? null}
              projectedInstallmentsAmount={selectedOverview?.projectedInstallmentsAmount ?? null}
              isBillEstimated={selectedOverview?.isBillEstimated ?? false}
              sourceFreshnessLabel={selectedOverview?.sourceFreshnessLabel ?? null}
              onSelectBill={setSelectedBillId}
            />
          }
        />

        <OfCardsContainer
          overviews={overviews}
          selectedCardId={effectiveSelectedCardId}
          onCardSelect={handleCardSelect}
          closedBillOverride={closedBillOverride}
        />

        <CreditCardsKpiStrip
          kpis={kpis}
          bestPurchaseDay={bestPurchaseDay}
          onOpenProjectedInstallments={() => setIsProjectedModalOpen(true)}
        />

        <div className="grid grid-cols-1 items-stretch gap-4 px-4 pb-6 pt-2 lg:px-6 xl:grid-cols-[minmax(0,27fr)_minmax(0,46fr)_minmax(0,27fr)]">
          <BillsCalendarCard
            companyId={companyId}
            accounts={accounts ?? []}
            accountId={effectiveSelectedCardId}
            closingDays={closingDays}
            dueDates={dueDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onOpenDayDetails={() => setModalDate(selectedDate)}
          />

          {/* Wrapper keeps the row height defined by the sibling columns on xl:
              the panel fills it absolutely and scrolls internally. */}
          <div className="relative xl:min-h-0">
            <DayExpensesPanel
              className="xl:absolute xl:inset-0"
              companyId={companyId}
              date={selectedDate}
              accountId={effectiveSelectedCardId}
              onOpenDayDetails={() => setModalDate(selectedDate)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <MonthSummaryCard kpis={kpis} referenceLabel={monthSummaryLabel} />
            <UpcomingBillsCard overviews={overviews} />
            <QuickAnalysisCard analysis={quickAnalysis} />
          </div>
        </div>
      </div>

      <DayExpensesModal
        companyId={companyId}
        date={modalDate}
        accountId={effectiveSelectedCardId}
        onClose={() => setModalDate(null)}
      />

      <ProjectedInstallmentsModal
        open={isProjectedModalOpen}
        cardName={selectedOverview?.name ?? ''}
        projectedAmount={selectedOverview?.projectedInstallmentsAmount ?? 0}
        cycleAmount={selectedOverview?.cycleBillAmount ?? 0}
        totalEstimated={selectedOverview?.currentBillAmount ?? 0}
        installments={selectedOverview?.projectedInstallments ?? []}
        onClose={() => setIsProjectedModalOpen(false)}
      />
    </ViewDefault>
  );
}
