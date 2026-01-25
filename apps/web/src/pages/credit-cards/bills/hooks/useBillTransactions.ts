import { useState, useEffect, useRef } from 'react';
import { processExtractTransactions, type BillTransaction } from './utils/transactionProcessing';
import { updateTransactionsState } from './utils/stateManagement';
import type { CreditCardBillResponse } from '@/services/creditCardService';

interface UseBillTransactionsParams {
  billData: CreditCardBillResponse | undefined;
  currentPage: number;
  cardId: string;
  month: string;
}

export const useBillTransactions = ({
  billData,
  currentPage,
  cardId,
  month,
}: UseBillTransactionsParams) => {
  const [allTransactions, setAllTransactions] = useState<BillTransaction[]>([]);
  const previousMonthRef = useRef<string>(month);
  const previousCardIdRef = useRef<string>(cardId);

  useEffect(() => {
    const monthChanged = previousMonthRef.current !== month;
    const cardChanged = previousCardIdRef.current !== cardId;

    if (monthChanged || cardChanged) {
      previousMonthRef.current = month;
      previousCardIdRef.current = cardId;
      setAllTransactions([]);
      if (!billData?.data) {
        return;
      }
    }

    if (!billData?.data) {
      if (!(monthChanged || cardChanged)) {
        setAllTransactions([]);
      }
      return;
    }

    const pageTransactions = processExtractTransactions(billData.data.transactions);

    if (pageTransactions.length === 0) {
      if (!(monthChanged || cardChanged)) {
        setAllTransactions([]);
      }
      return;
    }

    if (monthChanged || cardChanged) {
      setAllTransactions(pageTransactions);
    } else {
      updateTransactionsState(pageTransactions, currentPage, allTransactions, setAllTransactions);
    }
  }, [billData, currentPage, cardId, month, allTransactions]);

  return {
    allTransactions,
  };
};
