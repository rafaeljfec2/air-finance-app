import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/utils/formatters';

interface TransactionDetailsFieldsProps {
  date: string;
  amount: number;
  installmentCount: number;
  repeatMonthly: boolean;
  errors: Record<string, string>;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInstallmentCountChange: (value: string) => void;
  onRepeatMonthlyChange: (checked: boolean) => void;
}

export function TransactionDetailsFields({
  date,
  amount,
  installmentCount,
  repeatMonthly,
  errors,
  onDateChange,
  onAmountChange,
  onInstallmentCountChange,
  onRepeatMonthlyChange,
}: Readonly<TransactionDetailsFieldsProps>) {
  return (
    <div className="p-4 sm:p-6 bg-background dark:bg-background-dark">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Data */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Data de pagamento
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={onDateChange}
            min="1970-01-01"
            max="2100-12-31"
            required
            className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full"
          />
          {errors.date && (
            <span className="text-xs text-red-500 mt-1 block">{errors.date}</span>
          )}
        </div>

        {/* Valor */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Valor
          </label>
          <Input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            value={formatCurrency(amount)}
            onChange={onAmountChange}
            placeholder="R$ 0,00"
            required
            className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors w-full"
            autoComplete="off"
          />
          {errors.amount && (
            <span className="text-xs text-red-500 mt-1 block">{errors.amount}</span>
          )}
        </div>

        {/* Parcelas */}
        <div>
          <label
            htmlFor="installmentCount"
            className="block text-sm font-medium text-text dark:text-text-dark mb-1 whitespace-nowrap"
          >
            Quantidade de parcelas
          </label>
          <Select value={String(installmentCount)} onValueChange={onInstallmentCountChange}>
            <SelectTrigger className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark p-0 hover:bg-background dark:hover:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
              <div className="px-3 py-2">{installmentCount}x</div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-lg">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <SelectItem
                  key={num}
                  value={String(num)}
                  className="hover:bg-background dark:hover:bg-background-dark focus:bg-primary-50 dark:focus:bg-primary-900/20 focus:text-primary-600 dark:focus:text-primary-300"
                >
                  {num}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Repetir mensalmente */}
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center gap-2">
            <Switch
              checked={repeatMonthly}
              onCheckedChange={onRepeatMonthlyChange}
              id="repeat-monthly"
            />
            <label
              htmlFor="repeat-monthly"
              className="text-sm text-text dark:text-text-dark select-none cursor-pointer whitespace-nowrap"
            >
              Repetir todo mês
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

