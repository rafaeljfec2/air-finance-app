import { useQuery } from '@tanstack/react-query';
import { getDigitalAccountById, DigitalAccount } from '../services/digitalAccountService';

export const useDigitalAccount = (id: string) => {
  return useQuery<DigitalAccount>({
    queryKey: ['digital-account', id],
    queryFn: () => getDigitalAccountById(id),
    enabled: !!id,
  });
};
