import React, { useCallback, useEffect, useState } from 'react';
import { useMaintenanceStore } from '@/stores/maintenance';
import { MaintenanceScreen } from './MaintenanceScreen';
import { env } from '@/utils/env';

interface MaintenanceProviderProps {
  readonly children: React.ReactNode;
}

export function MaintenanceProvider({ children }: MaintenanceProviderProps) {
  const { isInMaintenance, scheduledEnd, resetErrors } = useMaintenanceStore();
  const [isRetrying, setIsRetrying] = useState(false);

  // Check for forced maintenance mode via environment variable
  const forcedMaintenance = env.VITE_MAINTENANCE_MODE === 'true';
  const forcedScheduledEnd = env.VITE_MAINTENANCE_END ?? null;

  const showMaintenance = forcedMaintenance || isInMaintenance;
  const displayScheduledEnd = forcedScheduledEnd ?? scheduledEnd;

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);

    try {
      // Try to reach the API health endpoint
      const response = await fetch(`${env.VITE_API_URL}/health`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (response.ok) {
        resetErrors();
      }
    } catch {
      // Still in maintenance
    } finally {
      setIsRetrying(false);
    }
  }, [resetErrors]);

  // Auto-retry every 30 seconds when in maintenance
  useEffect(() => {
    if (!showMaintenance || forcedMaintenance) return;

    const interval = setInterval(() => {
      handleRetry();
    }, 30000);

    return () => clearInterval(interval);
  }, [showMaintenance, forcedMaintenance, handleRetry]);

  if (showMaintenance) {
    return (
      <MaintenanceScreen
        onRetry={forcedMaintenance ? undefined : handleRetry}
        isRetrying={isRetrying}
        scheduledEnd={displayScheduledEnd ?? undefined}
      />
    );
  }

  return <>{children}</>;
}
