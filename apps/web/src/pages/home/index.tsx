import { DecisionDashboardFeature } from '@/features/decision-dashboard';
import { ViewDefault } from '@/layouts/ViewDefault';

/**
 * Product Home — hosts the Decision Dashboard feature only.
 * Fills the shell viewport without inventing a second scroll.
 */
export function HomePage() {
  return (
    <ViewDefault>
      <div className="box-border flex h-full min-h-0 flex-col overflow-hidden -m-4 p-3 sm:-m-6 sm:p-4 md:p-5">
        <DecisionDashboardFeature />
      </div>
    </ViewDefault>
  );
}
