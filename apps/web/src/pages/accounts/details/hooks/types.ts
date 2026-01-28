import type { Account } from '@/services/accountService';
import type { StatementTransaction, StatementResponse } from '@/services/bankingStatementService';

export interface StatementSummary {
  readonly startBalance: number;
  readonly endBalance: number;
  readonly totalCredits: number;
  readonly totalDebits: number;
}

export interface PaginationState {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface CurrentStatement {
  readonly transactions: StatementTransaction[];
  readonly summary: StatementSummary;
  readonly periodStart: string;
  readonly periodEnd: string;
}

export interface UseAccountDetailsReturn {
  readonly account: Account | null;
  readonly accounts: Account[];
  readonly currentStatement: CurrentStatement | null;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly isInitialLoad: boolean;
  readonly error: Error | null;
  readonly pagination: PaginationState;
  readonly loadMore: () => Promise<void>;
  readonly hasMore: boolean;
}

export interface UseStatementPaginationParams {
  readonly accountId: string;
  readonly month: string;
  readonly companyId: string;
}

export interface UseStatementTransactionsParams {
  readonly statementData: StatementResponse | undefined;
  readonly currentPage: number;
  readonly accountId: string;
  readonly month: string;
  readonly categoryMap?: Map<string, string>;
}

export const createInitialPaginationState = (): PaginationState => ({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

export const createInitialSummary = (): StatementSummary => ({
  startBalance: 0,
  endBalance: 0,
  totalCredits: 0,
  totalDebits: 0,
});
