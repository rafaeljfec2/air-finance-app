import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { InsightsPageHeader } from './components/InsightsPageHeader';
import { CreditCardInsightsSection } from './components/CreditCardInsightsSection';
import { AskAirFinanceFab } from './components/AskAirFinanceFab';

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
