import { DecisionDashboardFeature } from '@/features/decision-dashboard';
import { ViewDefault } from '@/layouts/ViewDefault';

/**
 * Product Home — hosts the Decision Dashboard feature only.
 * Experience logic lives in `features/decision-dashboard` (Domain → Mapper → UI).
 */
export function HomePage() {
  return (
    <ViewDefault>
      <div className="mx-auto w-full max-w-3xl px-1 py-2 sm:px-2 sm:py-4 md:py-6">
        <DecisionDashboardFeature />
      </div>
    </ViewDefault>
  );
}
