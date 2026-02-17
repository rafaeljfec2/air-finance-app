import React, { useState, useEffect, useMemo } from 'react';
import { QrCode, Zap } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { ComboBox } from '@/components/ui/ComboBox';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

interface DarfPaymentFormProps {
  readonly onSubmit: (data: Record<string, unknown>) => void;
  readonly onBack: () => void;
  readonly initialData?: Record<string, unknown>;
  readonly onSwitchToPix?: (pixPayload: string, amount: string) => void;
}

const REVENUE_CODE_OPTIONS = [
  { value: '0220', label: '0220 - IRPJ' },
  { value: '0561', label: '0561 - IRRF Trabalho Assalariado' },
  { value: '0588', label: '0588 - IRRF Trabalho sem Vinculo' },
  { value: '1099', label: '1099 - GPS - Contrib. Individual' },
  { value: '1120', label: '1120 - GPS - Empresa' },
  { value: '1138', label: '1138 - GPS - Com. Prod. Rural PJ' },
  { value: '1162', label: '1162 - GPS - Contrib. Facultativo' },
  { value: '1708', label: '1708 - IRRF' },
  { value: '2100', label: '2100 - GPS - Empresa em Geral' },
  { value: '2172', label: '2172 - COFINS' },
  { value: '2372', label: '2372 - CSLL' },
  { value: '4600', label: '4600 - Simples Nacional' },
  { value: '5952', label: '5952 - PIS' },
];

export function DarfPaymentForm({
  onSubmit,
  onBack,
  initialData,
  onSwitchToPix,
}: DarfPaymentFormProps) {
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
  const [pixPayload, setPixPayload] = useState('');

  useEffect(() => {
    if (!initialData) return;
    const str = (key: string): string => {
      const val = initialData[key];
      return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
    };
    const v = (key: string) => str(key) || undefined;
    const toCurrency = (key: string): string => {
      const raw = initialData[key];
      const num = typeof raw === 'number' ? raw : Number.parseFloat(str(key));
      return !Number.isNaN(num) && num > 0
        ? formatCurrencyInput(String(Math.round(num * 100)))
        : '';
    };

    if (v('cnpjCpf')) setCnpjCpf(str('cnpjCpf'));
    if (v('revenueCode')) setRevenueCode(str('revenueCode'));
    if (v('dueDate')) setDueDate(str('dueDate'));
    if (v('description')) setDescription(str('description'));
    if (v('companyName')) setCompanyName(str('companyName'));
    if (v('assessmentPeriod')) setAssessmentPeriod(str('assessmentPeriod'));
    if (v('principalAmount')) setPrincipalAmount(toCurrency('principalAmount'));
    if (v('reference')) setReference(str('reference'));
    if (v('companyPhone')) setCompanyPhone(str('companyPhone'));
    if (v('fineAmount')) setFineAmount(toCurrency('fineAmount'));
    if (v('interestAmount')) setInterestAmount(toCurrency('interestAmount'));
    if (v('pixPayload')) setPixPayload(str('pixPayload'));
  }, [initialData]);

  const numericPrincipal = principalAmount ? parseCurrency(principalAmount) : 0;
  const numericFine = fineAmount ? parseCurrency(fineAmount) : 0;
  const numericInterest = interestAmount ? parseCurrency(interestAmount) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cnpjCpf,
      revenueCode,
      dueDate,
      description,
      companyName,
      assessmentPeriod,
      principalAmount: numericPrincipal,
      reference,
      companyPhone: companyPhone || undefined,
      fineAmount: numericFine > 0 ? numericFine : undefined,
      interestAmount: numericInterest > 0 ? numericInterest : undefined,
    });
  };

  const revenueCodeOptions = useMemo(() => {
    if (revenueCode && !REVENUE_CODE_OPTIONS.some((c) => c.value === revenueCode)) {
      return [
        { value: revenueCode, label: `${revenueCode} - Codigo personalizado` },
        ...REVENUE_CODE_OPTIONS,
      ];
    }
    return REVENUE_CODE_OPTIONS;
  }, [revenueCode]);

  const isValid =
    cnpjCpf.trim() !== '' &&
    revenueCode.length === 4 &&
    dueDate !== '' &&
    description.trim() !== '' &&
    companyName.trim() !== '' &&
    assessmentPeriod !== '' &&
    numericPrincipal > 0 &&
    reference.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento DARF</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Documento de Arrecadacao de Receitas Federais
        </p>
      </div>

      {pixPayload && onSwitchToPix && (
        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Esta guia aceita pagamento via PIX
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              Pagamento instantaneo, sem custo e disponivel 24h
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSwitchToPix(pixPayload, principalAmount)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Pagar via PIX
          </button>
        </div>
      )}

      <div className="space-y-3">
        <FormField label="CPF/CNPJ do contribuinte">
          <Input
            value={cnpjCpf}
            onChange={(e) => setCnpjCpf(e.target.value)}
            placeholder="12345678000199"
            required
          />
        </FormField>

        <ComboBox
          label="Codigo de receita"
          options={revenueCodeOptions}
          value={revenueCode || null}
          onValueChange={(val) => setRevenueCode(val ?? '')}
          placeholder="Selecione o codigo"
          searchable
          searchPlaceholder="Buscar codigo..."
          showClearButton={false}
        />

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
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(formatCurrencyInput(e.target.value))}
              placeholder="R$ 0,00"
              inputMode="numeric"
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
              value={fineAmount}
              onChange={(e) => setFineAmount(formatCurrencyInput(e.target.value))}
              placeholder="R$ 0,00"
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Juros (R$)">
            <Input
              value={interestAmount}
              onChange={(e) => setInterestAmount(formatCurrencyInput(e.target.value))}
              placeholder="R$ 0,00"
              inputMode="numeric"
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
