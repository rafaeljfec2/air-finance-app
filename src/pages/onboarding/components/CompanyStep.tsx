import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCNPJ, formatCPF, validateCNPJ, validateCPF } from '@/utils/formatDocument';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CompanyFormData, CompanySchema } from '../schemas';

interface CompanyStepProps {
  onNext: (data: CompanyFormData) => void;
  onBack: () => void;
  loading: boolean;
}

export function CompanyStep({ onNext, onBack, loading }: Readonly<CompanyStepProps>) {
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      documentType: 'cnpj',
    },
  });

  const [documentValid, setDocumentValid] = useState<boolean | null>(null);
  const documentType = companyForm.watch('documentType');

  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={companyForm.handleSubmit(onNext)}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text-dark text-xl sm:text-2xl">Crie sua Empresa</CardTitle>
          <CardDescription className="text-text-dark/70 text-sm sm:text-base">
            A empresa é a base para organizar suas finanças. Você poderá adicionar outras depois.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-text-dark">
              Nome da Empresa
            </Label>
            <Input
              id="companyName"
              placeholder="Ex: Minha Loja Ltda, Empresa XYZ..."
              className="bg-card-dark border-border-dark text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
              aria-label="Nome da Empresa"
              {...companyForm.register('name')}
            />
            {companyForm.formState.errors.name && (
              <p className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" />
                {String(companyForm.formState.errors.name.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentType" className="text-text-dark">
              Tipo de Documento
            </Label>
            <Select
              value={documentType}
              onValueChange={(value) => {
                companyForm.setValue('documentType', value as 'cnpj' | 'cpf');
                companyForm.setValue('document', ''); // Clear document when type changes
                setDocumentValid(null); // Reset validation
              }}
            >
              <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                <SelectItem
                  value="cnpj"
                  className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                >
                  CNPJ
                </SelectItem>
                <SelectItem
                  value="cpf"
                  className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                >
                  CPF
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document" className="text-text-dark">
              {documentType === 'cnpj' ? 'CNPJ' : 'CPF'}
              <span className="text-xs text-text-dark/50 ml-1 font-normal">
                (Opcional, mas recomendado)
              </span>
            </Label>
            <div className="relative">
              <Input
                id="document"
                placeholder={
                  documentType === 'cnpj' ? 'Ex: 12.345.678/0001-90' : 'Ex: 123.456.789-00'
                }
                className={`bg-card-dark border-border-dark text-text-dark pr-10 ${
                  documentValid === true
                    ? 'border-green-400 ring-2 ring-green-400/20'
                    : documentValid === false
                      ? 'border-red-400 ring-2 ring-red-400/20'
                      : ''
                }`}
                {...companyForm.register('document')}
                onChange={(e) => {
                  const value = e.target.value;
                  const formatted = documentType === 'cnpj' ? formatCNPJ(value) : formatCPF(value);
                  companyForm.setValue('document', formatted, { shouldValidate: true });

                  // Real-time validation
                  const digits = formatted.replace(/\D/g, '');
                  if (documentType === 'cnpj' && digits.length === 14) {
                    setDocumentValid(validateCNPJ(formatted));
                  } else if (documentType === 'cpf' && digits.length === 11) {
                    setDocumentValid(validateCPF(formatted));
                  } else if (digits.length > 0) {
                    setDocumentValid(false);
                  } else {
                    setDocumentValid(null);
                  }
                }}
                onBlur={() => {
                  const doc = companyForm.watch('document');
                  if (doc) {
                    const digits = doc.replace(/\D/g, '');
                    if (documentType === 'cnpj' && digits.length === 14) {
                      setDocumentValid(validateCNPJ(doc));
                    } else if (documentType === 'cpf' && digits.length === 11) {
                      setDocumentValid(validateCPF(doc));
                    }
                  }
                }}
                value={companyForm.watch('document') ?? ''}
              />
              {documentValid === true && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400 pointer-events-none" />
              )}
              {documentValid === false && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400 pointer-events-none" />
              )}
            </div>
            {companyForm.formState.errors.document && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {String(companyForm.formState.errors.document.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-text-dark">
              Tipo
            </Label>
            <Select
              onValueChange={(v) => companyForm.setValue('type', v as 'matriz' | 'filial')}
              defaultValue="matriz"
            >
              <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                <SelectItem
                  value="matriz"
                  className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                >
                  Matriz
                </SelectItem>
                <SelectItem
                  value="filial"
                  className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                >
                  Filial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            variant="ghost"
            type="button"
            onClick={onBack}
            className="text-text-dark hover:bg-border-dark w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 w-full sm:w-auto order-1 sm:order-2"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuar
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </motion.div>
  );
}
