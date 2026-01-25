import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { OpeniConnector, OpeniItem } from '@/services/openiService';
import type { ModalStep } from './handlers/openiStatusHandlers';

interface UseOpenFinanceModalStateParams {
  open: boolean;
  companyId: string;
  openiTenantId?: string;
  companyDocument?: string;
  existingItems: OpeniItem[] | undefined;
  isLoadingExistingItems: boolean;
  isFetchingExistingItems: boolean;
}

export const useOpenFinanceModalState = ({
  open,
  companyId,
  openiTenantId,
  companyDocument,
  existingItems,
  isLoadingExistingItems,
  isFetchingExistingItems,
}: UseOpenFinanceModalStateParams) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<ModalStep>('cpf-input');
  const [cpfCnpj, setCpfCnpj] = useState(companyDocument ?? '');
  const [selectedConnector, setSelectedConnector] = useState<OpeniConnector | null>(null);
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasJustOpened, setHasJustOpened] = useState(false);

  useEffect(() => {
    if (open && companyId && openiTenantId) {
      setHasJustOpened(true);
      setIsInitializing(true);
      queryClient.invalidateQueries({ queryKey: ['openi-items', companyId] });
    } else if (!open) {
      setHasJustOpened(false);
      setIsInitializing(false);
    }
  }, [open, companyId, openiTenantId, queryClient]);

  const shouldShowLoading = useMemo(() => {
    if (!open) return false;
    const hasOpeniTenant = openiTenantId && openiTenantId.trim() !== '';
    if (!hasOpeniTenant) return false;
    const isQueryLoading = isLoadingExistingItems || isFetchingExistingItems;
    return isQueryLoading || (hasJustOpened && existingItems === undefined);
  }, [open, openiTenantId, isLoadingExistingItems, isFetchingExistingItems, hasJustOpened, existingItems]);

  const determineStep = useMemo(() => {
    if (!open) return 'cpf-input';
    const hasOpeniTenant = openiTenantId && openiTenantId.trim() !== '';
    if (!hasOpeniTenant) return 'cpf-input';
    if (shouldShowLoading) return 'cpf-input';
    if (Array.isArray(existingItems) && existingItems.length > 0) return 'existing-connections';
    return 'cpf-input';
  }, [open, openiTenantId, shouldShowLoading, existingItems]);

  useEffect(() => {
    if (open) {
      setIsInitializing(shouldShowLoading);
      setStep(determineStep);
      
      if (!shouldShowLoading) {
        setHasJustOpened(false);
      }
      
      if (companyDocument) {
        setCpfCnpj(companyDocument);
      }
      setSelectedConnector(null);
      setCreatedAccountId(null);
      setCreatedItemId(null);
    } else {
      setIsInitializing(false);
      setHasJustOpened(false);
      setStep('cpf-input');
      setCpfCnpj(companyDocument ?? '');
      setSelectedConnector(null);
      setCreatedAccountId(null);
      setCreatedItemId(null);
    }
  }, [open, companyDocument, shouldShowLoading, determineStep]);

  return {
    step,
    setStep,
    cpfCnpj,
    setCpfCnpj,
    selectedConnector,
    setSelectedConnector,
    createdAccountId,
    setCreatedAccountId,
    createdItemId,
    setCreatedItemId,
    isInitializing,
  };
};
