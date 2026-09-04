/**
 * Cross-boundary types for receivables inline update (frontend internal).
 * Feature: 007-receivables-inline-update
 *
 * Canonical implementation: apps/web/src/components/budget/hooks/receivableUpdate.types.ts
 *
 * Maps to existing REST partial: PATCH /companies/:companyId/transactions/:id
 * Body subset of CreateTransactionPayload from transactionService.
 */

export type ReceivableUiStatus = 'PENDING' | 'RECEIVED';

export interface ReceivableUpdatePayload {
  readonly value?: number;
  readonly reconciled?: boolean;
}

export interface ReceivableUpdateRequest {
  readonly id: string;
  readonly data: ReceivableUpdatePayload;
}

/** Query keys invalidated after a successful receivable update (via usePayableMutation) */
export const RECEIVABLE_INVALIDATION_KEYS = ['budget', 'transactions'] as const;

export function isReceivableStatusToggleable(_receivableId: string): boolean {
  return true;
}

export function isReceivableValueEditable(_receivableId: string): boolean {
  return true;
}

export function receivableStatusToReconciled(status: ReceivableUiStatus): boolean {
  return status === 'RECEIVED';
}

export function reconciledToReceivableStatus(reconciled: boolean): ReceivableUiStatus {
  return reconciled ? 'RECEIVED' : 'PENDING';
}
