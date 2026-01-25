import { useMemo, useRef } from 'react';
import type { CreditCard, CreditCardBillResponse } from '@/services/creditCardService';
import type { Account } from '@/services/accountService';
import type { BillTransaction } from './transactionProcessing';

export interface CurrentBill {
  id: string;
  cardId: string;
  month: string;
  total: number;
  dueDate: string;
  status: 'OPEN' | 'CLOSED' | 'PAID';
  transactions: BillTransaction[];
}

interface BuildCurrentBillParams {
  billData: CreditCardBillResponse | undefined;
  creditCard: CreditCard | null;
  month: string;
  account: Account | null;
  allTransactions: BillTransaction[];
}

export const useCurrentBill = ({
  billData,
  creditCard,
  month,
  account,
  allTransactions,
}: BuildCurrentBillParams): CurrentBill | null => {
  const previousBillRef = useRef<CurrentBill | null>(null);

  return useMemo(() => {
    if (billData?.data && creditCard && month && account) {
      const bill: CurrentBill = {
        id: billData.data.id,
        cardId: billData.data.cardId,
        month: billData.data.month,
        total: billData.data.total,
        dueDate: billData.data.dueDate,
        status: billData.data.status,
        transactions: allTransactions.length > 0 ? allTransactions : [],
      };
      previousBillRef.current = bill;
      return bill;
    }
    return previousBillRef.current;
  }, [billData?.data, creditCard, month, account, allTransactions]);
};
