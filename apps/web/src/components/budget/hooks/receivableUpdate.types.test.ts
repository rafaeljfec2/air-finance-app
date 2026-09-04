import { describe, expect, it } from 'vitest';

import {
  isReceivableStatusToggleable,
  isReceivableValueEditable,
  receivableStatusToReconciled,
  reconciledToReceivableStatus,
} from './receivableUpdate.types';

describe('receivableUpdate.types', () => {
  it('allows status toggle for any receivable id', () => {
    expect(isReceivableStatusToggleable('tx-1')).toBe(true);
    expect(isReceivableStatusToggleable('any-id')).toBe(true);
  });

  it('allows value edit for any receivable id', () => {
    expect(isReceivableValueEditable('tx-1')).toBe(true);
    expect(isReceivableValueEditable('any-id')).toBe(true);
  });

  it('maps RECEIVED status to reconciled true', () => {
    expect(receivableStatusToReconciled('RECEIVED')).toBe(true);
    expect(receivableStatusToReconciled('PENDING')).toBe(false);
  });

  it('maps reconciled boolean to receivable status', () => {
    expect(reconciledToReceivableStatus(true)).toBe('RECEIVED');
    expect(reconciledToReceivableStatus(false)).toBe('PENDING');
  });
});
