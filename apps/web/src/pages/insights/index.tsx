import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { InsightsPageHeader } from './components/InsightsPageHeader';
import { CreditCardInsightsSection } from './components/CreditCardInsightsSection';

export function InsightsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  return (
    <ViewDefault>
      <div className="max-w-3xl mx-auto">
        <InsightsPageHeader />
        <CreditCardInsightsSection companyId={companyId} />
      </div>
    </ViewDefault>
  );
}
