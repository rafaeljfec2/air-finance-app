import { type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2 } from 'lucide-react';
import { formatCpfCnpj } from './OpenFinanceConnectModal.utils';
import { BUTTON_FULL_WIDTH, BUTTON_HEIGHT } from './OpenFinanceConnectModal.constants';

interface CpfInputStepProps {
  readonly cpfCnpj: string;
  readonly onCpfCnpjChange: (value: string) => void;
  readonly onSearchConnectors: () => void;
  readonly validateCpfCnpj: (value: string) => boolean;
}

export function CpfInputStep({
  cpfCnpj,
  onCpfCnpjChange,
  onSearchConnectors,
  validateCpfCnpj,
}: Readonly<CpfInputStepProps>) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, '');
    onCpfCnpjChange(value);
  };

  const isButtonDisabled = !validateCpfCnpj(cpfCnpj);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cpfCnpj" className="text-sm font-medium text-text dark:text-text-dark">
          CPF/CNPJ *
        </Label>
        <Input
          id="cpfCnpj"
          type="text"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={formatCpfCnpj(cpfCnpj)}
          onChange={handleInputChange}
          maxLength={18}
          className="h-10"
        />
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Digite seu CPF (11 dígitos) ou CNPJ (14 dígitos)
        </p>
      </div>

      <Button
        onClick={onSearchConnectors}
        disabled={isButtonDisabled}
        className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} bg-purple-600 hover:bg-purple-700 text-white font-medium`}
      >
        <Link2 className="h-4 w-4 mr-2" />
        Buscar Bancos
      </Button>
    </div>
  );
}
