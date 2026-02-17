import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentResultProps {
  readonly success: boolean;
  readonly transactionId?: string;
  readonly errorMessage?: string;
  readonly onNewPayment: () => void;
}

function ResultActions({
  onNewPayment,
  onViewPayments,
}: {
  readonly onNewPayment: () => void;
  readonly onViewPayments: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
      <button
        onClick={onNewPayment}
        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Novo pagamento
      </button>
      <button
        onClick={onViewPayments}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Ver pagamentos
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export function PaymentResult({
  success,
  transactionId,
  errorMessage,
  onNewPayment,
}: PaymentResultProps) {
  const navigate = useNavigate();
  const handleViewPayments = () => navigate('/payments');

  if (success) {
    return (
      <div className="flex flex-col items-center text-center py-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento enviado</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Seu pagamento foi enviado para processamento
          </p>
        </div>
        {transactionId && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">ID da transacao</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white">{transactionId}</p>
          </div>
        )}
        <ResultActions onNewPayment={onNewPayment} onViewPayments={handleViewPayments} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <XCircle size={32} className="text-red-600" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Erro no pagamento</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {errorMessage ?? 'Ocorreu um erro ao processar o pagamento'}
        </p>
      </div>
      <ResultActions onNewPayment={onNewPayment} onViewPayments={handleViewPayments} />
    </div>
  );
}
