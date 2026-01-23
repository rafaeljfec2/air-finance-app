import type { ExtractResponse } from '@/services/types/extract.types';

export const isValidExtractData = (extractsData: {
  data?: ExtractResponse[];
} | null | undefined): boolean => {
  return (
    extractsData?.data !== undefined &&
    Array.isArray(extractsData.data) &&
    extractsData.data.length > 0
  );
};

export const canProcessExtracts = (
  cardId: string,
  accountId: string | undefined,
  extractsData: { data?: ExtractResponse[] } | null | undefined,
): boolean => {
  if (!cardId || !accountId) {
    return false;
  }
  return isValidExtractData(extractsData);
};
