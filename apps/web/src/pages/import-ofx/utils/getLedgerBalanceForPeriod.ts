import type { ExtractResponse } from '@/services/types/extract.types';

const DAYS_TOLERANCE = 3;

const calculateDaysDifference = (date1: Date, date2: Date): number => {
  return Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
};

interface GetLedgerBalanceParams {
  extracts: ExtractResponse[];
  endDate: string;
  accountId?: string;
}

interface LedgerBalanceResult {
  balance: number;
  date: string;
}

const filterExtractsByAccount = (
  extracts: ExtractResponse[],
  accountId?: string,
): ExtractResponse[] => {
  if (!accountId || accountId === 'all') {
    return extracts;
  }
  return extracts.filter((extract) => extract.accountId === accountId);
};

const filterExtractsWithLedgerBalance = (extracts: ExtractResponse[]): ExtractResponse[] => {
  return extracts.filter(
    (extract) =>
      extract.header?.ledgerBalance !== undefined &&
      extract.header.ledgerBalance !== null &&
      extract.header?.ledgerBalanceDate !== undefined &&
      extract.header.ledgerBalanceDate !== null,
  );
};

const findClosestExtractToEndDate = (
  extracts: ExtractResponse[],
  endDate: string,
): ExtractResponse | null => {
  if (extracts.length === 0) {
    return null;
  }

  const endDateObj = new Date(endDate);
  let closestExtract: ExtractResponse | null = null;
  let minDaysDifference = Infinity;

  for (const extract of extracts) {
    const ledgerBalanceDate = extract.header?.ledgerBalanceDate;
    if (!ledgerBalanceDate) {
      continue;
    }

    const balanceDate = new Date(ledgerBalanceDate);
    const daysDiff = calculateDaysDifference(balanceDate, endDateObj);

    if (daysDiff <= DAYS_TOLERANCE && daysDiff < minDaysDifference) {
      minDaysDifference = daysDiff;
      closestExtract = extract;
    }
  }

  return closestExtract;
};

export function getLedgerBalanceForPeriod({
  extracts,
  endDate,
  accountId,
}: GetLedgerBalanceParams): LedgerBalanceResult | null {
  if (extracts.length === 0) {
    return null;
  }

  const filteredByAccount = filterExtractsByAccount(extracts, accountId);
  const withBalance = filterExtractsWithLedgerBalance(filteredByAccount);

  if (withBalance.length === 0) {
    return null;
  }

  const closestExtract = findClosestExtractToEndDate(withBalance, endDate);

  if (!closestExtract?.header?.ledgerBalance || !closestExtract.header.ledgerBalanceDate) {
    return null;
  }

  return {
    balance: Math.abs(closestExtract.header.ledgerBalance),
    date: closestExtract.header.ledgerBalanceDate,
  };
}
