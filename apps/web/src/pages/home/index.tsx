import { DecisionDashboardFeature } from '@/features/decision-dashboard';
import { ViewDefault } from '@/layouts/ViewDefault';

/**
 * Product Home — hosts the Decision Dashboard feature only.
 * Experience logic lives in `features/decision-dashboard` (Domain → Mapper → UI).
 */
export function HomePage() {
  return (
    <ViewDefault immersiveDesktop>
      <div className="container mx-auto w-full max-w-7xl px-3 pb-4 pt-0">
        <DecisionDashboardFeature />
      </div>
    </ViewDefault>
  );
}
