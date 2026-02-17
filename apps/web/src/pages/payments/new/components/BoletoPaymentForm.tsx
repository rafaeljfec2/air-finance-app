import React, { useState, useEffect } from 'react';
import { QrCode, Zap } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

interface BoletoPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
  readonly initialData?: Record<string, unknown>;
  readonly onSwitchToPix?: (pixPayload: string, amount: string) => void;
}

export function BoletoPaymentForm({
  onSubmit,
  onBack,
  initialData,
  onSwitchToPix,
}: BoletoPaymentFormProps) {
  const [barCode, setBarCode] = useState('');
  const [amount, setAmount] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState('');
  const [pixPayload, setPixPayload] = useState('');

  useEffect(() => {
    if (!initialData) return;
    const str = (key: string): string => {
      const val = initialData[key];
      return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
    };
    const v = (key: string) => str(key) || undefined;
    if (v('barCode')) setBarCode(str('barCode'));
    if (v('amount')) {
      const raw = initialData.amount;
      const num = typeof raw === 'number' ? raw : Number.parseFloat(str('amount'));
      if (!Number.isNaN(num) && num > 0)
        setAmount(formatCurrencyInput(String(Math.round(num * 100))));
    }
    if (v('scheduledDate')) setScheduledDate(str('scheduledDate'));
    if (v('dueDate')) setScheduledDate(str('dueDate'));
    if (v('description')) setDescription(str('description'));
    if (v('pixPayload')) setPixPayload(str('pixPayload'));
  }, [initialData]);

  const numericAmount = amount ? parseCurrency(amount) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      barCode: barCode.replaceAll(/[\s.]/g, ''),
      amount: numericAmount > 0 ? numericAmount : undefined,
      scheduledDate: scheduledDate || undefined,
      description: description || undefined,
    });
  };

  const cleanBarCode = barCode.replaceAll(/[\s.]/g, '');
  const isValid =
    cleanBarCode.length === 44 || cleanBarCode.length === 47 || cleanBarCode.length === 48;

  const formatBarCodeDisplay = (digits: string): string => {
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
  };

  const handleBarCodeChange = (value: string) => {
    const digits = value.replaceAll(/[^\d]/g, '');
    setBarCode(digits);
  };

  const getBarCodeStatus = () => {
    if (cleanBarCode.length === 0) return null;
    if (isValid) return { color: 'text-emerald-500', text: `${cleanBarCode.length} digitos` };
    return {
      color: 'text-amber-500',
      text: `${cleanBarCode.length} digitos — esperado 44, 47 ou 48`,
    };
  };

  const barCodeStatus = getBarCodeStatus();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento Boleto</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pagamento por codigo de barras. Suporta agendamento.
        </p>
      </div>

      {pixPayload && onSwitchToPix && (
        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Este boleto aceita pagamento via PIX
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              Pagamento instantaneo, sem custo e disponivel 24h
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSwitchToPix(pixPayload, amount)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Pagar via PIX
          </button>
        </div>
      )}

      <div className="space-y-3">
        <FormField label="Codigo de barras">
          <Input
            value={barCode}
            onChange={(e) => handleBarCodeChange(e.target.value)}
            placeholder="Digite ou cole o codigo de barras"
            required
          />
          {cleanBarCode.length > 0 && (
            <div className="mt-1.5 space-y-1">
              {isValid && (
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded px-2.5 py-1.5 break-all leading-relaxed tracking-wider">
                  {formatBarCodeDisplay(cleanBarCode)}
                </p>
              )}
              {barCodeStatus && (
                <p className={`text-[10px] ${barCodeStatus.color}`}>{barCodeStatus.text}</p>
              )}
            </div>
          )}
        </FormField>

        <FormField label="Valor (R$) - opcional se o codigo contem valor">
          <Input
            value={amount}
            onChange={(e) => setAmount(formatCurrencyInput(e.target.value))}
            placeholder="R$ 0,00"
            inputMode="numeric"
          />
        </FormField>

        <FormField label="Data de agendamento (opcional)">
          <Input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </FormField>

        <FormField label="Descricao (opcional)">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Conta de energia"
          />
        </FormField>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          Revisar pagamento
        </button>
      </div>
    </form>
  );
}
