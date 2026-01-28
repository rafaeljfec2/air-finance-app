import { useState, useEffect, useRef } from 'react';
import type { StatementResponse } from '@/services/bankingStatementService';

interface UseInitialLoadParams {
  readonly statementData: StatementResponse | undefined;
  readonly accountId: string;
  readonly month: string;
}

export function useInitialLoad({ statementData, accountId, month }: UseInitialLoadParams) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const contextKeyRef = useRef<string>(`${accountId}-${month}`);

  useEffect(() => {
    const currentContextKey = `${accountId}-${month}`;

    if (contextKeyRef.current !== currentContextKey) {
      contextKeyRef.current = currentContextKey;
      setIsInitialLoad(true);
    }
  }, [accountId, month]);

  useEffect(() => {
    if (statementData && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [statementData, isInitialLoad]);

  return { isInitialLoad };
}
