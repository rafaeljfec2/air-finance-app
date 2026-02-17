import React, { useState, useEffect } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { ComboBox } from '@/components/ui/ComboBox';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

interface TedPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
  readonly initialData?: Record<string, unknown>;
}

const ACCOUNT_TYPE_OPTIONS = [
  { value: 'CORRENTE', label: 'Corrente' },
  { value: 'POUPANCA', label: 'Poupanca' },
];

export function TedPaymentForm({ onSubmit, onBack, initialData }: TedPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryDocument, setBeneficiaryDocument] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [agency, setAgency] = useState('');
  const [account, setAccount] = useState('');
  const [accountType, setAccountType] = useState('CORRENTE');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!initialData) return;
    const str = (key: string): string => {
      const val = initialData[key];
      return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
    };
    const v = (key: string) => str(key) || undefined;
    if (v('amount')) {
      const raw = initialData.amount;
      const num = typeof raw === 'number' ? raw : Number.parseFloat(str('amount'));
      if (!Number.isNaN(num) && num > 0)
        setAmount(formatCurrencyInput(String(Math.round(num * 100))));
    }
    if (v('beneficiaryName')) setBeneficiaryName(str('beneficiaryName'));
    if (v('beneficiaryDocument')) setBeneficiaryDocument(str('beneficiaryDocument'));
    if (v('bankCode')) setBankCode(str('bankCode'));
    if (v('agency')) setAgency(str('agency'));
    if (v('account')) setAccount(str('account'));
    if (v('accountType')) setAccountType(str('accountType'));
    if (v('description')) setDescription(str('description'));
  }, [initialData]);

  const numericAmount = amount ? parseCurrency(amount) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: numericAmount,
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
    numericAmount > 0 &&
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
            value={amount}
            onChange={(e) => setAmount(formatCurrencyInput(e.target.value))}
            placeholder="R$ 0,00"
            inputMode="numeric"
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
          <ComboBox
            label="Tipo de conta"
            options={ACCOUNT_TYPE_OPTIONS}
            value={accountType}
            onValueChange={(val) => setAccountType(val ?? 'CORRENTE')}
            placeholder="Selecione"
            showClearButton={false}
          />
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
