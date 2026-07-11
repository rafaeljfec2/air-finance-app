import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCompanyStore } from '@/stores/company';

import {
  filterTransactionsByBillId,
  formatOpenFinanceBillLabel,
} from '../mappers/filterTransactionsByBillId';
import type {
  StatementPeriodPreset,
  StatementPeriodRange,
} from '../mappers/getStatementPeriodRange';
import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';
import type { OpenFinanceBillView } from '../mappers/mapOpeniBillsToView';
import type { StatementTransactionItem } from '../mappers/mapOpeniTransactionToStatementItem';
import { resolveCreditCardsV2FetchPeriod } from '../mappers/resolveCreditCardsV2FetchPeriod';

import { useOpenFinanceCardDetails } from './useOpenFinanceCardDetails';
import { useOpenFinanceCardStatement } from './useOpenFinanceCardStatement';
import { useOpenFinanceCreditCards } from './useOpenFinanceCreditCards';

export interface CreditCardsV2Controller {
  readonly cards: OpenFinanceCreditCard[];
  readonly isLoadingCards: boolean;
  readonly cardsError: Error | null;
  readonly selectedCard: OpenFinanceCreditCard | null;
  readonly selectedCardId: string;
  readonly bills: OpenFinanceBillView[];
  readonly isLoadingBills: boolean;
  readonly selectedBillId: string | null;
  readonly selectedBill: OpenFinanceBillView | null;
  readonly selectedBillLabel: string | null;
  readonly preset: StatementPeriodPreset;
  readonly windowOffset: number;
  readonly fetchPeriod: StatementPeriodRange;
  readonly transactions: StatementTransactionItem[];
  readonly isLoadingStatement: boolean;
  readonly isFetching: boolean;
  readonly statementError: Error | null;
  readonly refetch: () => void;
  readonly handleSelectCard: (cardId: string) => void;
  readonly handleSelectBill: (billId: string | null) => void;
  readonly handlePresetChange: (next: StatementPeriodPreset) => void;
  readonly handlePreviousPeriod: () => void;
  readonly handleNextPeriod: () => void;
}

export function useCreditCardsV2Controller(): CreditCardsV2Controller {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [preset, setPreset] = useState<StatementPeriodPreset>(30);
  const [windowOffset, setWindowOffset] = useState(0);

  const { cards, isLoading: isLoadingCards, error: cardsError } = useOpenFinanceCreditCards();

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId],
  );

  const { bills, isLoading: isLoadingBills } = useOpenFinanceCardDetails({
    companyId,
    card: selectedCard,
  });

  const selectedBill = useMemo(
    () => bills.find((bill) => bill.id === selectedBillId) ?? null,
    [bills, selectedBillId],
  );

  const fetchPeriod = useMemo(
    () =>
      resolveCreditCardsV2FetchPeriod({
        selectedBill,
        preset,
        windowOffset,
      }),
    [selectedBill, preset, windowOffset],
  );

  useEffect(() => {
    if (isLoadingCards || cards.length === 0) return;
    if (!selectedCardId || !cards.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(cards[0]?.id ?? '');
    }
  }, [cards, selectedCardId, isLoadingCards]);

  useEffect(() => {
    if (isLoadingBills || !selectedBillId) return;
    if (!bills.some((bill) => bill.id === selectedBillId)) {
      setSelectedBillId(null);
    }
  }, [bills, selectedBillId, isLoadingBills]);

  const {
    transactions: rawTransactions,
    isLoading: isLoadingStatement,
    isFetching,
    error: statementError,
    refetch,
  } = useOpenFinanceCardStatement({
    companyId,
    card: selectedCard,
    period: fetchPeriod,
  });

  const transactions = useMemo(
    () => filterTransactionsByBillId(rawTransactions, selectedBillId),
    [rawTransactions, selectedBillId],
  );

  const selectedBillLabel = selectedBill ? formatOpenFinanceBillLabel(selectedBill) : null;

  const handleSelectCard = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setSelectedBillId(null);
  }, []);

  const handleSelectBill = useCallback((billId: string | null) => {
    setSelectedBillId(billId);
    if (billId) {
      setWindowOffset(0);
    }
  }, []);

  const handlePresetChange = useCallback((next: StatementPeriodPreset) => {
    setPreset(next);
    setWindowOffset(0);
    setSelectedBillId(null);
  }, []);

  const handlePreviousPeriod = useCallback(() => {
    setWindowOffset((prev) => prev + 1);
  }, []);

  const handleNextPeriod = useCallback(() => {
    setWindowOffset((prev) => Math.max(0, prev - 1));
  }, []);

  return {
    cards,
    isLoadingCards,
    cardsError,
    selectedCard,
    selectedCardId,
    bills,
    isLoadingBills,
    selectedBillId,
    selectedBill,
    selectedBillLabel,
    preset,
    windowOffset,
    fetchPeriod,
    transactions,
    isLoadingStatement,
    isFetching,
    statementError,
    refetch,
    handleSelectCard,
    handleSelectBill,
    handlePresetChange,
    handlePreviousPeriod,
    handleNextPeriod,
  };
}
