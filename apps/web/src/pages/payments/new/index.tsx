import { ViewDefault } from '@/layouts/ViewDefault';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePaymentForm } from './hooks/usePaymentForm';
import { PaymentTypeSelector } from './components/PaymentTypeSelector';
import { PixPaymentForm } from './components/PixPaymentForm';
import { TedPaymentForm } from './components/TedPaymentForm';
import { BoletoPaymentForm } from './components/BoletoPaymentForm';
import { DarfPaymentForm } from './components/DarfPaymentForm';
import { PaymentConfirmation } from './components/PaymentConfirmation';
import { PaymentResult } from './components/PaymentResult';

function renderForm(
  type: string,
  onSubmit: (data: Record<string, unknown>) => void,
  onBack: () => void,
) {
  switch (type) {
    case 'PIX':
      return <PixPaymentForm onSubmit={onSubmit} onBack={onBack} />;
    case 'TED':
      return <TedPaymentForm onSubmit={onSubmit} onBack={onBack} />;
    case 'BOLETO':
      return <BoletoPaymentForm onSubmit={onSubmit} onBack={onBack} />;
    case 'DARF':
      return <DarfPaymentForm onSubmit={onSubmit} onBack={onBack} />;
    default:
      return null;
  }
}

export function NewPayment() {
  const navigate = useNavigate();
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
    goToConfirm,
    goBack,
    submit,
  } = usePaymentForm();

  const hasNoInterAccount = interAccounts.length === 0;
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
          <div>
            <label
              htmlFor="payment-account-selector"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Conta de origem
            </label>
            <select
              id="payment-account-selector"
              value={selectedAccountId || interAccounts[0]?.id}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {interAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!hasNoInterAccount && step === 'select-type' && (
          <PaymentTypeSelector onSelect={selectType} />
        )}

        {!hasNoInterAccount &&
          step === 'form' &&
          selectedType &&
          renderForm(selectedType, goToConfirm, goBack)}

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
