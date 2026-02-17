import React, { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';

interface DarfPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
}

const REVENUE_CODES = [
  { value: '0220', label: '0220 - IRPJ' },
  { value: '2372', label: '2372 - CSLL' },
  { value: '5952', label: '5952 - PIS' },
  { value: '2172', label: '2172 - COFINS' },
  { value: '1708', label: '1708 - IRRF' },
  { value: '0561', label: '0561 - IRRF Trabalho Assalariado' },
  { value: '0588', label: '0588 - IRRF Trabalho sem Vinculo' },
  { value: '4600', label: '4600 - Simples Nacional' },
];

export function DarfPaymentForm({ onSubmit, onBack }: DarfPaymentFormProps) {
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [revenueCode, setRevenueCode] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [assessmentPeriod, setAssessmentPeriod] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [reference, setReference] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cnpjCpf,
      revenueCode,
      dueDate,
      description,
      companyName,
      assessmentPeriod,
      principalAmount: Number.parseFloat(principalAmount),
      reference,
      companyPhone: companyPhone || undefined,
      fineAmount: fineAmount ? Number.parseFloat(fineAmount) : undefined,
      interestAmount: interestAmount ? Number.parseFloat(interestAmount) : undefined,
    });
  };

  const isValid =
    cnpjCpf.trim() !== '' &&
    revenueCode.length === 4 &&
    dueDate !== '' &&
    description.trim() !== '' &&
    companyName.trim() !== '' &&
    assessmentPeriod !== '' &&
    Number.parseFloat(principalAmount) > 0 &&
    reference.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento DARF</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Documento de Arrecadacao de Receitas Federais
        </p>
      </div>

      <div className="space-y-3">
        <FormField label="CPF/CNPJ do contribuinte">
          <Input
            value={cnpjCpf}
            onChange={(e) => setCnpjCpf(e.target.value)}
            placeholder="12345678000199"
            required
          />
        </FormField>

        <FormField label="Codigo de receita">
          <select
            id="darf-revenue-code"
            value={revenueCode}
            onChange={(e) => setRevenueCode(e.target.value)}
            className="flex min-h-[44px] w-full rounded-md border border-input dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2.5 text-sm text-text dark:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Selecione o codigo</option>
            {REVENUE_CODES.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Nome da empresa/contribuinte">
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Empresa Exemplo LTDA"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Data de vencimento">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Periodo de apuracao">
            <Input
              type="date"
              value={assessmentPeriod}
              onChange={(e) => setAssessmentPeriod(e.target.value)}
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Valor principal (R$)">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </FormField>
          <FormField label="Referencia">
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value.replaceAll(/\D/g, ''))}
              placeholder="12345"
              required
            />
          </FormField>
        </div>

        <FormField label="Descricao">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: DARF IRPJ 1 trimestre 2026"
            required
          />
        </FormField>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Campos opcionais
          </p>
        </div>

        <FormField label="Telefone da empresa">
          <Input
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
            placeholder="11999998888"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Multa (R$)">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
              placeholder="0,00"
            />
          </FormField>
          <FormField label="Juros (R$)">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={interestAmount}
              onChange={(e) => setInterestAmount(e.target.value)}
              placeholder="0,00"
            />
          </FormField>
        </div>
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
