import { formatCurrency } from '@/utils/format';
import { formatDocument } from '@/utils/formatDocument';
import { Loader2 } from 'lucide-react';
import type { PaymentType } from '@/services/paymentService';

interface PaymentConfirmationProps {
  readonly type: PaymentType;
  readonly data: Record<string, unknown>;
  readonly onConfirm: () => void;
  readonly onBack: () => void;
  readonly isSubmitting: boolean;
}

interface ConfirmRowData {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}

const TYPE_LABELS: Record<PaymentType, string> = {
  PIX: 'Pagamento PIX',
  TED: 'Transferencia TED',
  BOLETO: 'Pagamento Boleto',
  DARF: 'Pagamento DARF',
};

function ConfirmRow({
  label,
  value,
  mono,
}: {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
      <span
        className={`text-sm font-medium text-gray-900 dark:text-white text-right ml-4 max-w-[60%] break-all ${mono ? 'font-mono tracking-wider text-xs leading-relaxed' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

function toStr(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function toNum(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function formatDateBR(value: string): string {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return value;
}

function formatBarCode(digits: string): string {
  if (digits.length === 47) {
    return `${digits.slice(0, 5)}.${digits.slice(5, 10)} ${digits.slice(10, 15)}.${digits.slice(15, 21)} ${digits.slice(21, 26)}.${digits.slice(26, 32)} ${digits.slice(32, 33)} ${digits.slice(33)}`;
  }
  if (digits.length === 48) {
    return `${digits.slice(0, 12)} ${digits.slice(12, 24)} ${digits.slice(24, 36)} ${digits.slice(36)}`;
  }
  if (digits.length === 44) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 15)} ${digits.slice(15, 25)} ${digits.slice(25, 34)} ${digits.slice(34)}`;
  }
  return digits;
}

const PIX_KEY_TYPE_LABELS: Record<string, string> = {
  EMAIL: 'E-mail',
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  PHONE: 'Telefone',
  RANDOM: 'Chave aleatoria',
  PAYLOAD: 'QR Code / Copia e Cola',
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CORRENTE: 'Corrente',
  POUPANCA: 'Poupanca',
  CHECKING: 'Corrente',
  SAVINGS: 'Poupanca',
};

function resolveAmount(data: Record<string, unknown>): number {
  if (typeof data.amount === 'number') return data.amount;
  if (typeof data.principalAmount === 'number') {
    return toNum(data.principalAmount) + toNum(data.fineAmount) + toNum(data.interestAmount);
  }
  return 0;
}

function buildPixRows(data: Record<string, unknown>): ConfirmRowData[] {
  const keyType = toStr(data.pixKeyType);
  return [
    { label: 'Chave PIX', value: toStr(data.pixKey) },
    { label: 'Tipo da chave', value: PIX_KEY_TYPE_LABELS[keyType] ?? keyType },
  ];
}

function buildTedRows(data: Record<string, unknown>): ConfirmRowData[] {
  const accType = toStr(data.accountType);
  return [
    { label: 'Destinatario', value: toStr(data.beneficiaryName) },
    { label: 'CPF/CNPJ', value: formatDocument(toStr(data.beneficiaryDocument)) },
    { label: 'Banco', value: toStr(data.bankCode) },
    { label: 'Agencia', value: toStr(data.agency) },
    {
      label: 'Conta',
      value: `${toStr(data.account)} (${ACCOUNT_TYPE_LABELS[accType] ?? accType})`,
    },
  ];
}

function buildBoletoRows(data: Record<string, unknown>): ConfirmRowData[] {
  const rows: ConfirmRowData[] = [
    { label: 'Codigo de barras', value: formatBarCode(toStr(data.barCode)), mono: true },
  ];
  if (data.scheduledDate) {
    rows.push({ label: 'Agendamento', value: formatDateBR(toStr(data.scheduledDate)) });
  }
  return rows;
}

function buildDarfRows(data: Record<string, unknown>): ConfirmRowData[] {
  const rows: ConfirmRowData[] = [
    { label: 'CPF/CNPJ', value: formatDocument(toStr(data.cnpjCpf)) },
    { label: 'Codigo receita', value: toStr(data.revenueCode) },
    { label: 'Empresa', value: toStr(data.companyName) },
    { label: 'Vencimento', value: formatDateBR(toStr(data.dueDate)) },
    { label: 'Periodo de apuracao', value: formatDateBR(toStr(data.assessmentPeriod)) },
    { label: 'Valor principal', value: formatCurrency(toNum(data.principalAmount)) },
  ];
  if (data.fineAmount) {
    rows.push({ label: 'Multa', value: formatCurrency(toNum(data.fineAmount)) });
  }
  if (data.interestAmount) {
    rows.push({ label: 'Juros', value: formatCurrency(toNum(data.interestAmount)) });
  }
  return rows;
}

function buildTypeRows(type: PaymentType, data: Record<string, unknown>): ConfirmRowData[] {
  switch (type) {
    case 'PIX':
      return buildPixRows(data);
    case 'TED':
      return buildTedRows(data);
    case 'BOLETO':
      return buildBoletoRows(data);
    case 'DARF':
      return buildDarfRows(data);
  }
}

function buildRows(type: PaymentType, data: Record<string, unknown>): ConfirmRowData[] {
  const rows: ConfirmRowData[] = [];

  const amount = resolveAmount(data);
  if (amount > 0) {
    rows.push({ label: 'Valor', value: formatCurrency(amount) });
  }

  rows.push(...buildTypeRows(type, data));

  if (data.description) {
    rows.push({ label: 'Descricao', value: toStr(data.description) });
  }

  return rows;
}

export function PaymentConfirmation({
  type,
  data,
  onConfirm,
  onBack,
  isSubmitting,
}: PaymentConfirmationProps) {
  const rows = buildRows(type, data);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmar pagamento</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Revise os dados antes de confirmar
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
          {TYPE_LABELS[type]}
        </p>
        {rows.map((row) => (
          <ConfirmRow key={row.label} label={row.label} value={row.value} mono={row.mono} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Processando...' : 'Confirmar pagamento'}
        </button>
      </div>
    </div>
  );
}
