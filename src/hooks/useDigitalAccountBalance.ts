import { useQuery } from '@tanstack/react-query';
import { getDigitalAccountBalance } from '../services/digitalAccountService';

export const useDigitalAccountBalance = (id: string) => {
  return useQuery<number>({
    queryKey: ['digital-account-balance', id],
    queryFn: () => getDigitalAccountBalance(id),
    enabled: !!id,
  });
};
