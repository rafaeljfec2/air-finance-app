import { type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ArrowLeft } from 'lucide-react';

interface PageCpfInputProps {
  readonly cpfCnpj: string;
  readonly onCpfCnpjChange: (value: string) => void;
  readonly onSearchConnectors: () => void;
  readonly validateCpfCnpj: (value: string) => boolean;
  readonly onBack?: () => void;
  readonly showBackButton?: boolean;
}

function formatCpfCnpj(value: string): string {
  const cleaned = value.replaceAll(/\D/g, '');
  
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  return cleaned
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function PageCpfInput({
  cpfCnpj,
  onCpfCnpjChange,
  onSearchConnectors,
  validateCpfCnpj,
  onBack,
  showBackButton = false,
}: PageCpfInputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, '');
    onCpfCnpjChange(value);
  };

  const isButtonDisabled = !validateCpfCnpj(cpfCnpj);

  return (
    <div className="space-y-6">
      {showBackButton && onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-text dark:hover:text-text-dark -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          Conectar nova conta
        </h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400 max-w-md mx-auto">
          Digite seu CPF ou CNPJ para buscar os bancos disponíveis para conexão via Open Finance.
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cpfCnpj" className="text-sm font-medium text-text dark:text-text-dark">
            CPF ou CNPJ
          </Label>
          <Input
            id="cpfCnpj"
            type="text"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            value={formatCpfCnpj(cpfCnpj)}
            onChange={handleInputChange}
            maxLength={18}
            className="h-12 text-center text-lg"
          />
          <p className="text-xs text-muted-foreground dark:text-gray-400 text-center">
            {cpfCnpj.length <= 11 ? `${cpfCnpj.length}/11 dígitos` : `${cpfCnpj.length}/14 dígitos`}
          </p>
        </div>

        <Button
          onClick={onSearchConnectors}
          disabled={isButtonDisabled}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar bancos disponíveis
        </Button>
      </div>
    </div>
  );
}
