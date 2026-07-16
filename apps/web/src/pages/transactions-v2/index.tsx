import { useResponsiveBreakpoint } from '@/hooks/useResponsiveBreakpoint';

import { TransactionsV2PageDesktop } from './desktop';
import { TransactionsV2PageMobile } from './mobile';

export function TransactionsV2Page() {
  const { isDesktop } = useResponsiveBreakpoint();

  if (isDesktop) {
    return <TransactionsV2PageDesktop />;
  }

  return <TransactionsV2PageMobile />;
}
