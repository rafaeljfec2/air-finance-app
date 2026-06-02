export type PayableUiStatus = 'PENDING' | 'PAID';

export interface PayableUpdatePayload {
  readonly value?: number;
  readonly reconciled?: boolean;
}

export const CREDIT_CARD_PAYABLE_ID_PREFIX = 'card-' as const;

export function isPayableTransactionEditable(payableId: string): boolean {
  return !payableId.startsWith(CREDIT_CARD_PAYABLE_ID_PREFIX);
}

export function isPayableStatusToggleable(payableId: string): boolean {
  return isPayableTransactionEditable(payableId);
}

export function isPayableValueEditable(payableId: string): boolean {
  return isPayableTransactionEditable(payableId);
}
