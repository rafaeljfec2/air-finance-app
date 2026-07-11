import { RequireGod } from '@/components/auth/RequireGod';

import { CreditCardBillsPage } from './index';

export function CreditCardBillsGodGate() {
  return (
    <RequireGod redirectTo="/credit-cards-v2">
      <CreditCardBillsPage />
    </RequireGod>
  );
}
