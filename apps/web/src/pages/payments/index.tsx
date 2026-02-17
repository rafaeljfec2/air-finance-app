import React, { useState, useMemo } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useAccounts } from '@/hooks/useAccounts';
import { usePayments, useCancelPayment } from '@/hooks/usePayments';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/toast';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Plus,
  Loader2,
  QrCode,
  Landmark,
  Barcode,
  FileText,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Payment, PaymentType, PaymentStatus } from '@/services/paymentService';

type PaymentTypeConfig = {
  readonly label: string;
  readonly icon: React.ElementType;
  readonly color: string;
  readonly bg: string;
};

const PAYMENT_TYPE_MAP: Record<PaymentType, PaymentTypeConfig> = {
  PIX: {
    label: 'PIX',
    icon: QrCode,
    color: 'text-green-700',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  TED: {
    label: 'TED',
    icon: Landmark,
    color: 'text-blue-700',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  BOLETO: {
    label: 'Boleto',
    icon: Barcode,
    color: 'text-orange-700',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  DARF: {
    label: 'DARF',
    icon: FileText,
    color: 'text-purple-700',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

type StatusConfig = {
  readonly label: string;
  readonly className: string;
};

const STATUS_MAP: Record<PaymentStatus, StatusConfig> = {
  PROCESSANDO: {
    label: 'Processando',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  CONCLUIDO: {
    label: 'Concluído',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  FALHOU: {
    label: 'Falhou',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  },
};

function PaymentTypeBadge({ type }: { readonly type: PaymentType }) {
  const config = PAYMENT_TYPE_MAP[type];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function PaymentStatusBadge({ status }: { readonly status: PaymentStatus }) {
  const config = STATUS_MAP[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
}

function EmptyState({
  hasNoInterAccount,
  onNavigate,
}: {
  readonly hasNoInterAccount: boolean;
  readonly onNavigate: () => void;
}) {
  return (
    <div className="text-center py-20">
      <Landmark size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum pagamento realizado ainda.</p>
      {!hasNoInterAccount && (
        <button
          onClick={onNavigate}
          className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Realizar primeiro pagamento
        </button>
      )}
    </div>
  );
}

function PaymentsList({
  payments,
  isFetching,
  onCancelTarget,
}: {
  readonly payments: Payment[];
  readonly isFetching: boolean;
  readonly onCancelTarget: (payment: Payment) => void;
}) {
  return (
    <div className="space-y-2">
      {isFetching && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Loader2 className="animate-spin" size={12} />
          Atualizando...
        </div>
      )}
      {payments.map((payment) => (
        <div
          key={payment._id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <PaymentTypeBadge type={payment.type} />
              <PaymentStatusBadge status={payment.status} />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {payment.description ?? `Pagamento ${payment.type}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(payment.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(payment.amount)}
            </span>
            {payment.status === 'PROCESSANDO' && (
              <button
                onClick={() => onCancelTarget(payment)}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
              >
                <XCircle size={14} />
                Cancelar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentsContent({
  isLoading,
  payments,
  isFetching,
  hasNoInterAccount,
  onNavigate,
  onCancelTarget,
}: {
  readonly isLoading: boolean;
  readonly payments: Payment[] | undefined;
  readonly isFetching: boolean;
  readonly hasNoInterAccount: boolean;
  readonly onNavigate: () => void;
  readonly onCancelTarget: (payment: Payment) => void;
}) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!payments?.length) {
    return <EmptyState hasNoInterAccount={hasNoInterAccount} onNavigate={onNavigate} />;
  }

  return (
    <PaymentsList payments={payments} isFetching={isFetching} onCancelTarget={onCancelTarget} />
  );
}

export function PaymentsPage() {
  const navigate = useNavigate();
  const { accounts } = useAccounts();
  const [cancelTarget, setCancelTarget] = useState<Payment | null>(null);

  const interAccounts = useMemo(
    () =>
      (accounts ?? []).filter(
        (a) =>
          a.integration?.enabled &&
          (a.bankDetails?.bankCode === '077' || a.bankDetails?.bankCode === 'INTER'),
      ),
    [accounts],
  );

  const selectedAccountId = interAccounts[0]?.id ?? '';

  const { payments, isLoading, isFetching } = usePayments(selectedAccountId);
  const cancelMutation = useCancelPayment(selectedAccountId);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelMutation.mutateAsync(cancelTarget._id);
      toast.success('Pagamento cancelado com sucesso');
      setCancelTarget(null);
    } catch {
      toast.error('Erro ao cancelar pagamento');
    }
  };

  const hasNoInterAccount = interAccounts.length === 0;
  const navigateToNew = () => navigate('/payments/new');

  return (
    <ViewDefault>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pagamentos</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pagamentos via Banco Inter</p>
            </div>
          </div>
          <button
            onClick={navigateToNew}
            disabled={hasNoInterAccount}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo pagamento</span>
          </button>
        </div>

        {hasNoInterAccount && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Nenhuma conta com integração Inter ativa encontrada. Configure a integração bancária
              em uma conta corrente para realizar pagamentos.
            </p>
          </div>
        )}

        <PaymentsContent
          isLoading={isLoading}
          payments={payments}
          isFetching={isFetching}
          hasNoInterAccount={hasNoInterAccount}
          onNavigate={navigateToNew}
          onCancelTarget={setCancelTarget}
        />

        <ConfirmModal
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancel}
          title="Cancelar pagamento"
          description={`Deseja cancelar o pagamento de ${cancelTarget ? formatCurrency(cancelTarget.amount) : ''}?`}
          confirmText="Cancelar pagamento"
          cancelText="Voltar"
          variant="danger"
          isLoading={cancelMutation.isPending}
        />
      </div>
    </ViewDefault>
  );
}
