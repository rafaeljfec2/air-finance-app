import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getConnectors,
  createItem,
  getItemStatus,
  resyncItem,
  type OpeniConnector,
  type OpeniItemResponse,
  type CreateOpeniItemParams,
} from '@/services/openiService';

interface UseOpeniIntegrationProps {
  companyId: string;
  accountId?: string;
  onSuccess?: () => void;
}

export function useOpeniIntegration({ companyId, accountId, onSuccess }: UseOpeniIntegrationProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<OpeniConnector | null>(null);
  const [itemParameters, setItemParameters] = useState<Record<string, string>>({});

  const {
    data: connectors,
    isLoading: isLoadingConnectors,
    error: connectorsError,
  } = useQuery<OpeniConnector[]>({
    queryKey: ['openi-connectors', companyId, searchQuery],
    queryFn: () => getConnectors(companyId, searchQuery),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });

  const createItemMutation = useMutation({
    mutationFn: (params: CreateOpeniItemParams) => {
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      return createItem(companyId, accountId, params);
    },
    onSuccess: (data) => {
      toast.success('Conexão criada com sucesso!');
      if (data.status === 'WAITING_USER_INPUT' && data.auth?.authUrl) {
        window.open(data.auth.authUrl, '_blank');
        toast.info('Redirecionando para autenticação...');
      }
      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      queryClient.invalidateQueries({ queryKey: ['openi-item-status', companyId, accountId] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Erro ao criar conexão Openi';
      toast.error(errorMessage);
    },
  });

  const getItemStatusQuery = useQuery<OpeniItemResponse>({
    queryKey: ['openi-item-status', companyId, accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      const account = await queryClient.fetchQuery({
        queryKey: ['accounts', companyId],
      });
      const accountData = (
        account as { data?: Array<{ id: string; openiItemId?: string }> }
      )?.data?.find((acc) => acc.id === accountId);
      if (!accountData?.openiItemId) {
        throw new Error('Account does not have Openi item ID');
      }
      return getItemStatus(companyId, accountId, accountData.openiItemId);
    },
    enabled: !!companyId && !!accountId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'PENDING' || data?.status === 'WAITING_USER_INPUT') {
        return 5000;
      }
      return false;
    },
  });

  const resyncItemMutation = useMutation({
    mutationFn: (itemId: string) => {
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      return resyncItem(companyId, accountId, itemId);
    },
    onSuccess: () => {
      toast.success('Ressincronização iniciada');
      queryClient.invalidateQueries({ queryKey: ['openi-item-status', companyId, accountId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Erro ao ressincronizar item';
      toast.error(errorMessage);
    },
  });

  const handleSearchConnectors = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelectConnector = useCallback((connector: OpeniConnector) => {
    setSelectedConnector(connector);
    setItemParameters({});
  }, []);

  const handleParameterChange = useCallback((field: string, value: string) => {
    setItemParameters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleCreateItem = useCallback(async () => {
    if (!selectedConnector) {
      toast.error('Selecione um conector');
      return;
    }

    const requiredFields = selectedConnector.rules.filter((rule) => rule.required);
    const missingFields = requiredFields.filter(
      (rule) => !itemParameters[rule.field] || itemParameters[rule.field].trim() === '',
    );

    if (missingFields.length > 0) {
      toast.error(
        `Preencha os campos obrigatórios: ${missingFields.map((r) => r.label).join(', ')}`,
      );
      return;
    }

    createItemMutation.mutate({
      connectorId: selectedConnector.id,
      parameters: itemParameters,
    });
  }, [selectedConnector, itemParameters, createItemMutation]);

  const handleResyncItem = useCallback(
    (itemId: string) => {
      resyncItemMutation.mutate(itemId);
    },
    [resyncItemMutation],
  );

  const handleOpenAuthUrl = useCallback((authUrl: string) => {
    window.open(authUrl, '_blank');
  }, []);

  return {
    connectors: connectors ?? [],
    isLoadingConnectors,
    connectorsError,
    selectedConnector,
    itemParameters,
    itemStatus: getItemStatusQuery.data,
    isLoadingItemStatus: getItemStatusQuery.isLoading,
    isCreatingItem: createItemMutation.isPending,
    isResyncingItem: resyncItemMutation.isPending,
    handleSearchConnectors,
    handleSelectConnector,
    handleParameterChange,
    handleCreateItem,
    handleResyncItem,
    handleOpenAuthUrl,
    setSelectedConnector,
  };
}
