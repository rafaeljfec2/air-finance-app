import { useState, useEffect, useRef } from 'react';
import type { CreditCardBillResponse } from '@/services/creditCardService';

interface UseInitialLoadParams {
  billData: CreditCardBillResponse | undefined;
  cardId: string;
  month: string;
}

export const useInitialLoad = ({ billData, cardId, month }: UseInitialLoadParams) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const previousCardIdRef = useRef<string>(cardId);
  const previousMonthRef = useRef<string>(month);

  useEffect(() => {
    const cardChanged = previousCardIdRef.current !== cardId;
    const monthChanged = previousMonthRef.current !== month;

    if (cardChanged || monthChanged) {
      previousCardIdRef.current = cardId;
      previousMonthRef.current = month;
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }

    if (billData && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [billData, cardId, month, isInitialLoad]);

  return { isInitialLoad };
};
