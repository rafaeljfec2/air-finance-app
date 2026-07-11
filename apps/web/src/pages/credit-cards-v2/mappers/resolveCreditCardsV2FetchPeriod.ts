import {
  getStatementPeriodRange,
  type StatementPeriodPreset,
  type StatementPeriodRange,
} from './getStatementPeriodRange';
import { getStatementPeriodRangeForBill } from './getStatementPeriodRangeForBill';
import type { OpenFinanceBillView } from './mapOpeniBillsToView';

export function resolveCreditCardsV2FetchPeriod(params: {
  readonly selectedBill: OpenFinanceBillView | null;
  readonly preset: StatementPeriodPreset;
  readonly windowOffset: number;
  readonly now?: Date;
}): StatementPeriodRange {
  if (params.selectedBill) {
    return getStatementPeriodRangeForBill(params.selectedBill.dueDate);
  }
  return getStatementPeriodRange(params.preset, params.now ?? new Date(), params.windowOffset);
}
