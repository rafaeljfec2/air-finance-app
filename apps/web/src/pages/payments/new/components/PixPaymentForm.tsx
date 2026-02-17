import React, { useState, useEffect } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { ComboBox } from '@/components/ui/ComboBox';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

interface PixPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
  readonly initialData?: Record<string, unknown>;
}

const PIX_KEY_TYPE_OPTIONS = [
  { value: 'EMAIL', label: 'E-mail' },
  { value: 'CPF', label: 'CPF' },
  { value: 'CNPJ', label: 'CNPJ' },
  { value: 'PHONE', label: 'Telefone' },
  { value: 'RANDOM', label: 'Chave aleatoria' },
  { value: 'PAYLOAD', label: 'QR Code / Copia e Cola' },
];

export function PixPaymentForm({ onSubmit, onBack, initialData }: PixPaymentFormProps) {
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('EMAIL');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!initialData) return;
    const str = (key: string): string => {
      const val = initialData[key];
      return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
    };
    const v = (key: string) => str(key) || undefined;
    if (v('pixKey')) setPixKey(str('pixKey'));
    if (v('pixKeyType')) setPixKeyType(str('pixKeyType'));
    if (v('amount')) {
      const raw = initialData.amount;
      const num = typeof raw === 'number' ? raw : Number.parseFloat(str('amount'));
      if (!Number.isNaN(num) && num > 0)
        setAmount(formatCurrencyInput(String(Math.round(num * 100))));
    }
    if (v('description')) setDescription(str('description'));
  }, [initialData]);

  const numericAmount = amount ? parseCurrency(amount) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pixKey,
      pixKeyType,
      amount: numericAmount,
      description: description || undefined,
    });
  };

  const isValid = pixKey.trim() !== '' && numericAmount > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento PIX</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Transferencia instantanea via chave PIX
        </p>
      </div>

      <div className="space-y-3">
        <ComboBox
          label="Tipo da chave"
          options={PIX_KEY_TYPE_OPTIONS}
          value={pixKeyType}
          onValueChange={(val) => setPixKeyType(val ?? 'EMAIL')}
          placeholder="Selecione o tipo"
          showClearButton={false}
        />

        <FormField label={pixKeyType === 'PAYLOAD' ? 'Payload PIX (copia e cola)' : 'Chave PIX'}>
          <Input
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder={pixKeyType === 'PAYLOAD' ? 'Payload do QR Code' : 'Digite a chave PIX'}
            required
          />
        </FormField>

        <FormField label="Valor (R$)">
          <Input
            value={amount}
            onChange={(e) => setAmount(formatCurrencyInput(e.target.value))}
            placeholder="R$ 0,00"
            inputMode="numeric"
            required
          />
        </FormField>

        <FormField label="Descricao (opcional)">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Pagamento NF 12345"
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
