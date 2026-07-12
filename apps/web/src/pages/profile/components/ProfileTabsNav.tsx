import { CreditCard, Code2, Palette, User } from 'lucide-react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ProfileTab } from '../utils/resolveProfileTab';

const TAB_ITEMS: ReadonlyArray<{
  readonly value: ProfileTab;
  readonly label: string;
  readonly description: string;
  readonly icon: typeof User;
}> = [
  { value: 'personal', label: 'Conta', description: 'Perfil e dados', icon: User },
  { value: 'preferences', label: 'Preferências', description: 'Tema e avisos', icon: Palette },
  { value: 'subscription', label: 'Assinatura', description: 'Plano e cobrança', icon: CreditCard },
  { value: 'developer', label: 'Desenvolvedor', description: 'IA e API', icon: Code2 },
];

export function ProfileTabsNav() {
  return (
    <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
      {TAB_ITEMS.map(({ value, label, description, icon: Icon }) => (
        <TabsTrigger
          key={value}
          value={value}
          aria-label={`${label}: ${description}`}
          className="min-h-[52px] flex-col items-start gap-0.5 px-3 py-2 data-[state=active]:shadow-sm sm:min-h-[60px]"
        >
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </span>
          <span className="hidden text-left text-[11px] font-normal text-muted-foreground sm:block">
            {description}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
