import React, { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';

interface TedPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
}

export function TedPaymentForm({ onSubmit, onBack }: TedPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryDocument, setBeneficiaryDocument] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [agency, setAgency] = useState('');
  const [account, setAccount] = useState('');
  const [accountType, setAccountType] = useState('CORRENTE');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: Number.parseFloat(amount),
      beneficiaryName,
      beneficiaryDocument,
      bankCode,
      agency,
      account,
      accountType,
      description: description || undefined,
    });
  };

  const isValid =
    Number.parseFloat(amount) > 0 &&
    beneficiaryName.trim() !== '' &&
    beneficiaryDocument.trim() !== '' &&
    bankCode.trim() !== '' &&
    agency.trim() !== '' &&
    account.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transferencia TED</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Transferencia bancaria (processamento em ate 1 dia util)
        </p>
      </div>

      <div className="space-y-3">
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

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Dados do destinatario
          </p>
        </div>

        <FormField label="Nome completo">
          <Input
            value={beneficiaryName}
            onChange={(e) => setBeneficiaryName(e.target.value)}
            placeholder="Nome do destinatario"
            required
          />
        </FormField>

        <FormField label="CPF/CNPJ">
          <Input
            value={beneficiaryDocument}
            onChange={(e) => setBeneficiaryDocument(e.target.value)}
            placeholder="000.000.000-00"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Banco">
            <Input
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              placeholder="Ex: 237"
              required
            />
          </FormField>
          <FormField label="Agencia">
            <Input
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="0001"
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Conta">
            <Input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="12345-6"
              required
            />
          </FormField>
          <FormField label="Tipo de conta">
            <select
              id="ted-account-type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="flex min-h-[44px] w-full rounded-md border border-input dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2.5 text-sm text-text dark:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="CORRENTE">Corrente</option>
              <option value="POUPANCA">Poupanca</option>
            </select>
          </FormField>
        </div>

        <FormField label="Descricao (opcional)">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Pagamento consultoria"
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
