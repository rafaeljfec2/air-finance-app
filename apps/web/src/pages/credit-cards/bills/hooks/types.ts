import type { CreditCard } from '@/services/creditCardService';
import type { Account } from '@/services/accountService';
import type { CurrentBill } from './utils/billConstruction';
import type { PaginationState } from './utils/stateManagement';

export interface UseCreditCardBillsReturn {
  creditCard: CreditCard | null;
  account: Account | null;
  currentBill: CurrentBill | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isInitialLoad: boolean;
  error: Error | null;
  pagination: PaginationState;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isFetching: boolean;
}
