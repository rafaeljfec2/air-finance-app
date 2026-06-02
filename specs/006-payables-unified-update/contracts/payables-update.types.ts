/**
 * Cross-boundary types for payables inline update (frontend internal).
 * Feature: 006-payables-unified-update
 *
 * Canonical implementation: apps/web/src/components/budget/hooks/payableUpdate.types.ts
 *
 * Maps to existing REST partial: PATCH /companies/:companyId/transactions/:id
 * Body subset of CreateTransactionPayload from transactionService.
 */

export type PayableUiStatus = 'PENDING' | 'PAID';

export interface PayableUpdatePayload {
  readonly value?: number;
  readonly reconciled?: boolean;
}

export interface PayableUpdateRequest {
  readonly id: string;
  readonly data: PayableUpdatePayload;
}

export interface PayableMutationResult {
  readonly success: true;
}

export interface PayableMutationError {
  readonly success: false;
  readonly message: string;
}

export type PayableMutationResponse = PayableMutationResult | PayableMutationError;

/** Query keys invalidated after a successful payable update */
export const PAYABLE_INVALIDATION_KEYS = ['budget', 'transactions'] as const;

/** Credit card bill rows use synthetic ids; status toggle is disabled */
export const CREDIT_CARD_PAYABLE_ID_PREFIX = 'card-' as const;

export function isPayableStatusToggleable(payableId: string): boolean {
  return !payableId.startsWith(CREDIT_CARD_PAYABLE_ID_PREFIX);
}

export function payableStatusToReconciled(status: PayableUiStatus): boolean {
  return status === 'PAID';
}

export function reconciledToPayableStatus(reconciled: boolean): PayableUiStatus {
  return reconciled ? 'PAID' : 'PENDING';
}
