import { useState, useCallback, useMemo } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import {
  useCreatePixPayment,
  useCreateTedPayment,
  useCreateBoletoPayment,
  useCreateDarfPayment,
} from '@/hooks/usePayments';
import type { PaymentType } from '@/services/paymentService';

type PaymentStep = 'select-type' | 'form' | 'confirm' | 'result';

interface PaymentResult {
  readonly success: boolean;
  readonly transactionId?: string;
  readonly errorMessage?: string;
}

export function usePaymentForm() {
  const { accounts } = useAccounts();
  const [step, setStep] = useState<PaymentStep>('select-type');
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<PaymentResult | null>(null);

  const interAccounts = useMemo(
    () =>
      (accounts ?? []).filter(
        (a) =>
          a.integration?.enabled &&
          (a.bankDetails?.bankCode === '077' || a.bankDetails?.bankCode === 'INTER'),
      ),
    [accounts],
  );

  const accountId = selectedAccountId || interAccounts[0]?.id || '';

  const pixMutation = useCreatePixPayment(accountId);
  const tedMutation = useCreateTedPayment(accountId);
  const boletoMutation = useCreateBoletoPayment(accountId);
  const darfMutation = useCreateDarfPayment(accountId);

  const isSubmitting =
    pixMutation.isPending ||
    tedMutation.isPending ||
    boletoMutation.isPending ||
    darfMutation.isPending;

  const selectType = useCallback((type: PaymentType) => {
    setSelectedType(type);
    setFormData({});
    setResult(null);
    setStep('form');
  }, []);

  const goToConfirm = useCallback((data: Record<string, unknown>) => {
    setFormData(data);
    setStep('confirm');
  }, []);

  const goBack = useCallback(() => {
    if (step === 'form') {
      setStep('select-type');
      setSelectedType(null);
    } else if (step === 'confirm') {
      setStep('form');
    } else if (step === 'result') {
      setStep('select-type');
      setSelectedType(null);
      setFormData({});
      setResult(null);
    }
  }, [step]);

  const submit = useCallback(async () => {
    if (!selectedType || !accountId) return;

    try {
      let payment: { transactionId: string };

      switch (selectedType) {
        case 'PIX':
          payment = await pixMutation.mutateAsync({
            type: 'PIX',
            amount: formData.amount as number,
            pixKey: formData.pixKey as string,
            pixKeyType: formData.pixKeyType as string,
            description: formData.description as string | undefined,
          });
          break;
        case 'TED':
          payment = await tedMutation.mutateAsync({
            type: 'TED',
            amount: formData.amount as number,
            beneficiaryName: formData.beneficiaryName as string,
            beneficiaryDocument: formData.beneficiaryDocument as string,
            bankCode: formData.bankCode as string,
            agency: formData.agency as string,
            account: formData.account as string,
            accountType: formData.accountType as 'CORRENTE' | 'POUPANCA',
            description: formData.description as string | undefined,
          });
          break;
        case 'BOLETO':
          payment = await boletoMutation.mutateAsync({
            barCode: formData.barCode as string,
            amount: formData.amount as number | undefined,
            scheduledDate: formData.scheduledDate as string | undefined,
            description: formData.description as string | undefined,
          });
          break;
        case 'DARF':
          payment = await darfMutation.mutateAsync({
            cnpjCpf: formData.cnpjCpf as string,
            revenueCode: formData.revenueCode as string,
            dueDate: formData.dueDate as string,
            description: formData.description as string,
            companyName: formData.companyName as string,
            assessmentPeriod: formData.assessmentPeriod as string,
            principalAmount: formData.principalAmount as number,
            reference: formData.reference as string,
            companyPhone: formData.companyPhone as string | undefined,
            fineAmount: formData.fineAmount as number | undefined,
            interestAmount: formData.interestAmount as number | undefined,
          });
          break;
      }

      setResult({ success: true, transactionId: payment.transactionId });
      setStep('result');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar pagamento';
      setResult({ success: false, errorMessage: message });
      setStep('result');
    }
  }, [selectedType, accountId, formData, pixMutation, tedMutation, boletoMutation, darfMutation]);

  return {
    step,
    selectedType,
    selectedAccountId,
    setSelectedAccountId,
    interAccounts,
    formData,
    result,
    isSubmitting,
    selectType,
    goToConfirm,
    goBack,
    submit,
  };
}
