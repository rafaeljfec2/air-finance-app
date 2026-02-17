import React, { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';

interface PixPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
}

export function PixPaymentForm({ onSubmit, onBack }: PixPaymentFormProps) {
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('EMAIL');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pixKey,
      pixKeyType,
      amount: Number.parseFloat(amount),
      description: description || undefined,
    });
  };

  const isValid = pixKey.trim() !== '' && Number.parseFloat(amount) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento PIX</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Transferencia instantanea via chave PIX
        </p>
      </div>

      <div className="space-y-3">
        <FormField label="Tipo da chave">
          <select
            id="pix-key-type"
            value={pixKeyType}
            onChange={(e) => setPixKeyType(e.target.value)}
            className="flex min-h-[44px] w-full rounded-md border border-input dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2.5 text-sm text-text dark:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="EMAIL">E-mail</option>
            <option value="CPF">CPF</option>
            <option value="CNPJ">CNPJ</option>
            <option value="PHONE">Telefone</option>
            <option value="RANDOM">Chave aleatoria</option>
          </select>
        </FormField>

        <FormField label="Chave PIX">
          <Input
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Digite a chave PIX"
            required
          />
        </FormField>

        <FormField label="Valor (R$)">
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
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
