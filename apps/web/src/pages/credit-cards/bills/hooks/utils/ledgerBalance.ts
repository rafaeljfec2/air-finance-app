import type { ExtractResponse } from '@/services/types/extract.types';
import type { BillPeriod } from './billCalculations';

const DAYS_TOLERANCE = 3;

const calculateDaysDifference = (date1: Date, date2: Date): number => {
  return Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
};

const isExtractInPeriod = (extract: ExtractResponse, billPeriod: BillPeriod): boolean => {
  const ledgerBalanceDate = extract.header?.ledgerBalanceDate;
  if (!ledgerBalanceDate) {
    return false;
  }
  
  const balanceDate = new Date(ledgerBalanceDate);
  const billEndDate = new Date(billPeriod.endDate);
  const daysDiff = calculateDaysDifference(balanceDate, billEndDate);
  
  return daysDiff <= DAYS_TOLERANCE;
};

const filterExtractsByPeriod = (
  extracts: ExtractResponse[],
  billPeriod: BillPeriod,
): ExtractResponse[] => {
  return extracts.filter((extract) => isExtractInPeriod(extract, billPeriod));
};

const filterExtractsWithLedgerBalance = (extracts: ExtractResponse[]): ExtractResponse[] => {
  return extracts.filter(
    (extract) =>
      extract.header?.ledgerBalance !== undefined && extract.header.ledgerBalance !== null,
  );
};

const getExtractDate = (extract: ExtractResponse): number => {
  if (extract.header?.ledgerBalanceDate) {
    return new Date(extract.header.ledgerBalanceDate).getTime();
  }
  if (extract.createdAt) {
    return new Date(extract.createdAt).getTime();
  }
  return 0;
};

const sortExtractsByDate = (extracts: ExtractResponse[]): ExtractResponse[] => {
  return [...extracts].sort((a, b) => {
    const dateA = getExtractDate(a);
    const dateB = getExtractDate(b);
    return dateB - dateA;
  });
};

export const getLedgerBalanceFromExtracts = (
  extracts: ExtractResponse[],
  billPeriod: BillPeriod,
): number => {
  if (extracts.length === 0) {
    return 0;
  }

  const extractsInPeriod = filterExtractsByPeriod(extracts, billPeriod);
  if (extractsInPeriod.length === 0) {
    return 0;
  }

  const extractsWithBalance = filterExtractsWithLedgerBalance(extractsInPeriod);
  if (extractsWithBalance.length === 0) {
    return 0;
  }

  const sortedExtracts = sortExtractsByDate(extractsWithBalance);
  const mostRecentExtract = sortedExtracts[0];
  const ledgerBalance = mostRecentExtract.header?.ledgerBalance ?? 0;

  return Math.abs(ledgerBalance);
};
