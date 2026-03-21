import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

import { toast } from '@/components/ui/toast';
import {
  listApiTokens,
  createApiToken,
  revokeApiToken,
  type ApiTokenResponse,
  type ApiTokenCreatedResponse,
  type CreateApiTokenPayload,
} from '@/services/apiTokenService';

const API_TOKENS_QUERY_KEY = ['api-tokens'] as const;

interface UseProfileApiTokensReturn {
  readonly tokens: ApiTokenResponse[];
  readonly isLoading: boolean;
  readonly isCreating: boolean;
  readonly revokingTokenId: string | null;
  readonly isCreateModalOpen: boolean;
  readonly createdToken: ApiTokenCreatedResponse | null;
  readonly openCreateModal: () => void;
  readonly closeCreateModal: () => void;
  readonly handleCreate: (payload: CreateApiTokenPayload) => Promise<void>;
  readonly handleRevoke: (tokenId: string) => Promise<void>;
  readonly clearCreatedToken: () => void;
}

export function useProfileApiTokens(): UseProfileApiTokensReturn {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdToken, setCreatedToken] = useState<ApiTokenCreatedResponse | null>(null);
  const [revokingTokenId, setRevokingTokenId] = useState<string | null>(null);

  const { data: tokens = [], isLoading } = useQuery<ApiTokenResponse[]>({
    queryKey: API_TOKENS_QUERY_KEY,
    queryFn: listApiTokens,
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createApiToken,
    onSuccess: (data) => {
      setCreatedToken(data);
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: API_TOKENS_QUERY_KEY });
      toast({
        title: 'Token criado',
        description: 'Copie o token agora. Ele não será exibido novamente.',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o token. Tente novamente.',
        type: 'error',
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeApiToken,
    onSuccess: () => {
      setRevokingTokenId(null);
      queryClient.invalidateQueries({ queryKey: API_TOKENS_QUERY_KEY });
      toast({
        title: 'Token revogado',
        description: 'O token foi revogado com sucesso.',
        type: 'success',
      });
    },
    onError: () => {
      setRevokingTokenId(null);
      toast({
        title: 'Erro',
        description: 'Não foi possível revogar o token.',
        type: 'error',
      });
    },
  });

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const clearCreatedToken = useCallback(() => setCreatedToken(null), []);

  const handleCreate = useCallback(
    async (payload: CreateApiTokenPayload) => {
      await createMutation.mutateAsync(payload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createMutation.mutateAsync],
  );

  const handleRevoke = useCallback(
    async (tokenId: string) => {
      setRevokingTokenId(tokenId);
      await revokeMutation.mutateAsync(tokenId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [revokeMutation.mutateAsync],
  );

  return {
    tokens,
    isLoading,
    isCreating: createMutation.isPending,
    revokingTokenId,
    isCreateModalOpen,
    createdToken,
    openCreateModal,
    closeCreateModal,
    handleCreate,
    handleRevoke,
    clearCreatedToken,
  };
}
