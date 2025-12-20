import { Input } from '@/components/ui/input';

interface DescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function DescriptionField({ value, onChange, error }: Readonly<DescriptionFieldProps>) {
  return (
    <div className="p-4 sm:p-6 bg-background dark:bg-background-dark">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-text dark:text-text-dark mb-1"
      >
        Descrição
      </label>
      <Input
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        placeholder="Ex: Supermercado, Salário, etc."
        required
        className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
      />
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}

