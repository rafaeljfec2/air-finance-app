export type ReceivableUiStatus = 'PENDING' | 'RECEIVED';

export interface ReceivableUpdatePayload {
  readonly value?: number;
  readonly reconciled?: boolean;
}

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
