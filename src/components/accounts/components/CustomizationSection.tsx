import { FormField } from '@/components/ui/FormField';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import type { CreateAccount } from '@/services/accountService';
import { Palette } from 'lucide-react';
import { accountTypes } from '../constants';

interface CustomizationSectionProps {
  form: CreateAccount;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
}

export function CustomizationSection({
  form,
  onColorChange,
  onIconChange,
}: Readonly<CustomizationSectionProps>) {
  const iconOptions = Array.from(
    new Map(accountTypes.map((t) => [t.iconName, { value: t.iconName, icon: t.icon }])).values(),
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
          Personalização
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="Cor">
          <ColorPicker value={form.color} onChange={onColorChange} />
        </FormField>

        <FormField label="Ícone">
          <IconPicker value={form.icon} onChange={onIconChange} options={iconOptions} />
        </FormField>
      </div>
    </div>
  );
}
