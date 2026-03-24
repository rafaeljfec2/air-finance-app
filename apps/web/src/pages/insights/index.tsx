import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';

import { AskAirFinanceFab } from './components/AskAirFinanceFab';
import { CreditCardInsightsSection } from './components/CreditCardInsightsSection';
import { InsightsPageHeader } from './components/InsightsPageHeader';

export function InsightsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  return (
    <ViewDefault>
      <div className="max-w-2xl mx-auto">
        <InsightsPageHeader />
        <CreditCardInsightsSection companyId={companyId} />
      </div>
      <AskAirFinanceFab />
    </ViewDefault>
  );
}
