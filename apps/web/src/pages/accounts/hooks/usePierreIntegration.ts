import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  connectPierre,
  importPierreAccounts,
  getPierreAccounts,
  type PierreAccount,
} from '@/services/bankingIntegrationService';

interface UsePierreIntegrationProps {
  companyId: string;
  pierreFinanceTenantId?: string;
  onSuccess?: () => void;
  open?: boolean;
}

export function usePierreIntegration({
  companyId,
  pierreFinanceTenantId,
  onSuccess,
  open = false,
}: UsePierreIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<PierreAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      open &&
      pierreFinanceTenantId &&
      pierreFinanceTenantId.trim() !== '' &&
      accounts.length === 0 &&
      !isLoadingAccounts
    ) {
      setTenantId(pierreFinanceTenantId);
      setIsLoadingAccounts(true);

      getPierreAccounts(companyId)
        .then((response) => {
          if (response.success && response.data) {
            setAccounts(response.data);

            if (response.data.length === 0) {
              toast.warning('Nenhuma conta encontrada no Pierre Finance');
            }
          } else {
            setError('Erro ao carregar contas do Pierre Finance');
            toast.error('Erro ao carregar contas do Pierre Finance');
          }
        })
        .catch((err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          const errorMessage =
            error.response?.data?.message || 'Erro ao carregar contas do Pierre Finance';
          setError(errorMessage);
          toast.error(errorMessage);
          console.error('Error loading Pierre accounts:', err);
        })
        .finally(() => {
          setIsLoadingAccounts(false);
        });
    }
  }, [open, pierreFinanceTenantId, companyId, isLoadingAccounts, accounts.length]);

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    setApiKey('');
    setSelectedAccountIds([]);
    setError(null);

    // Se já tem tenant configurado, carregar contas automaticamente
    if (pierreFinanceTenantId) {
      setTenantId(pierreFinanceTenantId);
      setIsLoadingAccounts(true);

      try {
        const response = await getPierreAccounts(companyId);

        if (response.success) {
          setAccounts(response.data);

          if (response.data.length === 0) {
            toast.warning('Nenhuma conta encontrada no Pierre Finance');
          }
        } else {
          setError('Erro ao carregar contas do Pierre Finance');
          toast.error('Erro ao carregar contas do Pierre Finance');
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        const errorMessage =
          error.response?.data?.message || 'Erro ao carregar contas do Pierre Finance';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error loading Pierre accounts:', err);
      } finally {
        setIsLoadingAccounts(false);
      }
    } else {
      setTenantId(null);
      setAccounts([]);
    }
  }, [companyId, pierreFinanceTenantId]);

  const handleClose = useCallback(() => {
    if (!isConnecting && !isImporting) {
      setIsOpen(false);
      setApiKey('');
      setTenantId(null);
      setAccounts([]);
      setSelectedAccountIds([]);
      setError(null);
    }
  }, [isConnecting, isImporting]);

  const handleConnect = useCallback(async () => {
    if (!apiKey?.startsWith('sk-')) {
      setError('API Key inválida. Deve começar com "sk-"');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const response = await connectPierre(apiKey, companyId);

      if (response.success) {
        setTenantId(response.data.tenantId);
        setAccounts(response.data.accounts);

        if (response.data.accounts.length === 0) {
          toast.warning('Nenhuma conta encontrada no Pierre Finance');
        } else {
          toast.success(`${response.data.accounts.length} conta(s) encontrada(s)`);
        }

        // Reload company to get updated pierreFinanceTenantId
        // This ensures the modal will show accounts directly next time
        onSuccess?.();
      } else {
        setError('Erro ao conectar com Pierre Finance');
        toast.error('Erro ao conectar com Pierre Finance');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || 'Erro ao conectar com Pierre Finance';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error connecting to Pierre:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [apiKey, companyId, onSuccess]);

  const handleToggleAccount = useCallback((accountId: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(accountId)) {
        return prev.filter((id) => id !== accountId);
      }
      return [...prev, accountId];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedAccountIds.length === accounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(accounts.map((acc) => acc.id));
    }
  }, [accounts, selectedAccountIds.length]);

  const handleImport = useCallback(async () => {
    if (selectedAccountIds.length === 0) {
      toast.error('Selecione pelo menos uma conta para importar');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const response = await importPierreAccounts(companyId, selectedAccountIds);

      if (response.success) {
        toast.success(`${response.data.imported} conta(s) importada(s) com sucesso!`);
        setIsOpen(false);
        onSuccess?.();
      } else {
        setError('Erro ao importar contas');
        toast.error('Erro ao importar contas');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Erro ao importar contas';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error importing accounts:', err);
    } finally {
      setIsImporting(false);
    }
  }, [companyId, selectedAccountIds, onSuccess]);

  return {
    isOpen,
    apiKey,
    isConnecting,
    isImporting,
    isLoadingAccounts,
    tenantId,
    accounts,
    selectedAccountIds,
    error,
    setApiKey,
    handleOpen,
    handleClose,
    handleConnect,
    handleToggleAccount,
    handleSelectAll,
    handleImport,
  };
}
