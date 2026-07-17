import { useQueries } from '@tanstack/react-query';

import { getCreditCardTransactions } from '@/services/openiService';
import { formatDateToLocalISO } from '@/utils/date';

import {
  buildHistoryFetchSlices,
  dedupeTransactionsById,
} from '../mappers/buildHistoryFetchSlices';
import { getCurrentCycleRange } from '../mappers/getCurrentCycleRange';
import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';
import {
  type OpenBillProjection,
  projectInstallmentsForOpenBill,
} from '../mappers/projectInstallmentsForOpenBill';
import { toOpeniIsoDateTimeRange } from '../mappers/toOpeniIsoDateTimeRange';

export interface UseAllCardsOpenBillsResult {
  readonly openBillByCardId: ReadonlyMap<string, OpenBillProjection>;
  readonly isLoading: boolean;
}

const HISTORY_MONTHS = 4;
const SLICE_MONTHS = 4;

/**
 * Projects the open bill for each card: cycle PENDING net + installment parcels
 * not yet posted. Active installment series post a parcel every cycle, so a
 * short lookback is enough to find the latest parcel of every series while
 * staying under the integration rate limit (10 req/min).
 */
export function useAllCardsOpenBills(
  companyId: string,
  cards: ReadonlyArray<OpenFinanceCreditCard>,
  referenceDate: Date,
): UseAllCardsOpenBillsResult {
  const referenceIso = formatDateToLocalISO(referenceDate);

  return useQueries({
    queries: cards.map((card) => {
      const cycle = getCurrentCycleRange(card.closingDay, referenceDate);
      return {
        queryKey: [
          'openi-credit-card-open-bill-projected',
          companyId,
          card.id,
          card.openiCardId,
          cycle?.startDate ?? null,
          referenceIso,
        ],
        queryFn: async (): Promise<OpenBillProjection | null> => {
          if (!cycle || !card.closingDay) {
            return null;
          }

          const slices = buildHistoryFetchSlices(referenceDate, HISTORY_MONTHS, SLICE_MONTHS);
          const payloads = await Promise.all(
            slices.map((slice) =>
              getCreditCardTransactions(
                companyId,
                card.itemId,
                card.openiCardId,
                card.id,
                toOpeniIsoDateTimeRange(slice.startDate, slice.endDate),
              ),
            ),
          );

          const transactions = dedupeTransactionsById(
            payloads.flatMap((payload) => payload.transactions),
          );

          return projectInstallmentsForOpenBill(transactions, cycle, card.closingDay);
        },
        enabled: Boolean(companyId && card.itemId && card.openiCardId && cycle && card.closingDay),
        staleTime: 60 * 1000,
      };
    }),
    combine: (results) => {
      const openBillByCardId = new Map<string, OpenBillProjection>();
      results.forEach((result, index) => {
        const card = cards[index];
        if (card && result.data) {
          openBillByCardId.set(card.id, result.data);
        }
      });
      return {
        openBillByCardId,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
