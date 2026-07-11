import { useResponsiveBreakpoint } from '@/hooks/useResponsiveBreakpoint';

import { CreditCardsV2PageDesktop } from './desktop';
import { CreditCardsV2PageMobile } from './mobile';

export function CreditCardsV2Page() {
  const { isDesktop } = useResponsiveBreakpoint();

  if (isDesktop) {
    return <CreditCardsV2PageDesktop />;
  }

  return <CreditCardsV2PageMobile />;
}
