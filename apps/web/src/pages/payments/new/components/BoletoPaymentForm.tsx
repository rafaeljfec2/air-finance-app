import React, { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';

interface BoletoPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
}

export function BoletoPaymentForm({ onSubmit, onBack }: BoletoPaymentFormProps) {
  const [barCode, setBarCode] = useState('');
  const [amount, setAmount] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      barCode,
      amount: amount ? Number.parseFloat(amount) : undefined,
      scheduledDate: scheduledDate || undefined,
      description: description || undefined,
    });
  };

  const isValid = barCode.trim().length >= 40;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento Boleto</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pagamento por codigo de barras. Suporta agendamento.
        </p>
      </div>

      <div className="space-y-3">
        <FormField label="Codigo de barras">
          <Input
            value={barCode}
            onChange={(e) => setBarCode(e.target.value)}
            placeholder="Digite ou cole o codigo de barras"
            required
          />
        </FormField>

        <FormField label="Valor (R$) - opcional se o codigo contem valor">
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
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
