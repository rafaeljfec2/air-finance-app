import { ComboBoxOption } from '@/components/ui/ComboBox';
import { getBanks, type Bank } from '@/services/bankService';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';

export function useBanks() {
  const {
    data: banks,
    isLoading,
    error,
  } = useQuery<Bank[]>({
    queryKey: ['banks'],
    queryFn: getBanks,
    staleTime: 1000 * 60 * 60, // Cache por 1 hora
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      console.error('Erro ao carregar bancos:', error);
    }
  }, [error]);

  const bankOptions: ComboBoxOption<string>[] = useMemo(() => {
    if (!banks || banks.length === 0) return [];
    
    // Filtrar apenas bancos ativos
    const activeBanks = banks.filter((bank) => bank.active !== false);
    
    return activeBanks.map((bank) => ({
      value: bank.code,
      label: `${bank.code} - ${bank.shortName || bank.name}`, // Fallback para name se shortName não existir
    }));
  }, [banks]);

  const getBankByCode = (code: string): Bank | undefined => {
    return banks?.find(bank => bank.code === code);
  };

  const hasBankingIntegration = (code: string | null | undefined): boolean => {
    if (!code) return false;
    const bank = getBankByCode(code);
    if (!bank) return false;
    
    // Verifica o campo integration
    if (bank.integration?.active && bank.integration?.type && bank.integration.type !== 'none') {
      return true;
    }
    
    return false;
  };

  return {
    banks: banks || [],
    bankOptions,
    isLoading,
    error,
    getBankByCode,
    hasBankingIntegration,
  };
}
