import { useCallback, useMemo, useEffect } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { ArrowLeft } from 'lucide-react';
import { ComboBox } from '@/components/ui/ComboBox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePaymentForm } from './hooks/usePaymentForm';
import { useParsePaymentDocument, usePaymentById } from '@/hooks/usePayments';
import { PaymentTypeSelector } from './components/PaymentTypeSelector';
import { DocumentUpload } from './components/DocumentUpload';
import { PixPaymentForm } from './components/PixPaymentForm';
import { TedPaymentForm } from './components/TedPaymentForm';
import { BoletoPaymentForm } from './components/BoletoPaymentForm';
import { DarfPaymentForm } from './components/DarfPaymentForm';
import { PaymentConfirmation } from './components/PaymentConfirmation';
import { PaymentResult } from './components/PaymentResult';
import type { PaymentType, Payment } from '@/services/paymentService';

interface RenderFormOptions {
  readonly type: string;
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
  readonly initialData?: Record<string, unknown>;
  readonly onSwitchToPix?: (pixPayload: string, amount: string) => void;
}

function renderForm({ type, onSubmit, onBack, initialData, onSwitchToPix }: RenderFormOptions) {
  switch (type) {
    case 'PIX':
      return <PixPaymentForm onSubmit={onSubmit} onBack={onBack} initialData={initialData} />;
    case 'TED':
      return <TedPaymentForm onSubmit={onSubmit} onBack={onBack} initialData={initialData} />;
    case 'BOLETO':
      return (
        <BoletoPaymentForm
          onSubmit={onSubmit}
          onBack={onBack}
          initialData={initialData}
          onSwitchToPix={onSwitchToPix}
        />
      );
    case 'DARF':
      return (
        <DarfPaymentForm
          onSubmit={onSubmit}
          onBack={onBack}
          initialData={initialData}
          onSwitchToPix={onSwitchToPix}
        />
      );
    default:
      return null;
  }
}

function mapPaymentToFormData(payment: Payment): Record<string, unknown> {
  const base = { amount: payment.amount, description: payment.description };

  switch (payment.type) {
    case 'PIX':
      return {
        ...base,
        pixKey: payment.beneficiary.pixKey ?? '',
        pixKeyType: 'EMAIL',
      };
    case 'TED':
      return {
        ...base,
        beneficiaryName: payment.beneficiary.name,
        beneficiaryDocument: payment.beneficiary.document,
        bankCode: payment.beneficiary.bankCode ?? '',
        agency: payment.beneficiary.agency ?? '',
        account: payment.beneficiary.account ?? '',
        accountType: payment.beneficiary.accountType ?? 'CORRENTE',
      };
    case 'BOLETO':
      return {
        ...base,
        barCode: payment.barCode ?? '',
      };
    case 'DARF':
      return {
        ...base,
        cnpjCpf: payment.beneficiary.document,
        companyName: payment.beneficiary.name,
      };
    default:
      return base;
  }
}

export function NewPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const retryPaymentId = searchParams.get('retry');
  const retryAccountId = searchParams.get('accountId');

  const {
    step,
    selectedType,
    interAccounts,
    selectedAccountId,
    setSelectedAccountId,
    formData,
    result,
    isSubmitting,
    selectType,
    fillFromDocument,
    goToConfirm,
    goBack,
    submit,
  } = usePaymentForm();

  const hasNoInterAccount = interAccounts.length === 0;
  const accountId = selectedAccountId || interAccounts[0]?.id || '';

  const retryQuery = usePaymentById(retryAccountId ?? accountId, retryPaymentId ?? '');

  useEffect(() => {
    if (!retryQuery.data) return;
    const payment = retryQuery.data;
    if (retryAccountId) {
      setSelectedAccountId(retryAccountId);
    }
    fillFromDocument(payment.type, mapPaymentToFormData(payment));
  }, [retryQuery.data, retryAccountId, setSelectedAccountId, fillFromDocument]);

  const parseMutation = useParsePaymentDocument(accountId);

  const handleParseFile = useCallback(
    async (file: File) => {
      const result = await parseMutation.mutateAsync(file);
      return result;
    },
    [parseMutation],
  );

  const handleDocumentParsed = useCallback(
    (parsed: { detectedType: string; confidence: number; fields: Record<string, unknown> }) => {
      fillFromDocument(parsed.detectedType as PaymentType, parsed.fields);
    },
    [fillFromDocument],
  );

  const handleSwitchToPix = useCallback(
    (pixPayload: string, amount: string) => {
      fillFromDocument('PIX', {
        pixKey: pixPayload,
        pixKeyType: 'PAYLOAD',
        amount,
        description: formData.description ?? '',
      });
    },
    [fillFromDocument, formData.description],
  );

  const accountOptions = useMemo(
    () => interAccounts.map((acc) => ({ value: acc.id, label: acc.name })),
    [interAccounts],
  );

  const handleBack = step === 'select-type' ? () => navigate('/payments') : goBack;
  const showAccountSelector = !hasNoInterAccount && interAccounts.length > 1 && step !== 'result';

  return (
    <ViewDefault>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Novo pagamento</h1>
        </div>

        {hasNoInterAccount && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Nenhuma conta com integracao Inter ativa. Configure a integracao bancaria primeiro.
            </p>
          </div>
        )}

        {showAccountSelector && (
          <ComboBox
            label="Conta de origem"
            options={accountOptions}
            value={selectedAccountId || interAccounts[0]?.id || null}
            onValueChange={(val) => setSelectedAccountId(val ?? '')}
            placeholder="Selecione a conta"
            showClearButton={false}
          />
        )}

        {!hasNoInterAccount && step === 'select-type' && (
          <>
            <DocumentUpload
              onParsed={handleDocumentParsed}
              onParseFile={handleParseFile}
              disabled={!accountId}
            />
            <PaymentTypeSelector onSelect={selectType} />
          </>
        )}

        {!hasNoInterAccount &&
          step === 'form' &&
          selectedType &&
          renderForm({
            type: selectedType,
            onSubmit: goToConfirm,
            onBack: goBack,
            initialData: formData,
            onSwitchToPix: handleSwitchToPix,
          })}

        {!hasNoInterAccount && step === 'confirm' && selectedType && (
          <PaymentConfirmation
            type={selectedType}
            data={formData}
            onConfirm={submit}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        )}

        {!hasNoInterAccount && step === 'result' && result && (
          <PaymentResult
            success={result.success}
            transactionId={result.transactionId}
            errorMessage={result.errorMessage}
            onNewPayment={goBack}
          />
        )}
      </div>
    </ViewDefault>
  );
}
