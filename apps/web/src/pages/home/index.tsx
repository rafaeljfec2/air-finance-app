import { DecisionDashboardFeature } from '@/features/decision-dashboard';
import { ViewDefault } from '@/layouts/ViewDefault';

/**
 * Product Home — hosts the Decision Dashboard feature only.
 * Experience logic lives in `features/decision-dashboard` (Domain → Mapper → UI).
 */
export function HomePage() {
  return (
    <ViewDefault>
      <div className="container mx-auto w-full max-w-3xl px-2 pb-3 pt-0 sm:px-6">
        <DecisionDashboardFeature />
      </div>
    </ViewDefault>
  );
}
