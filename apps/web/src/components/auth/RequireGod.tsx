import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { getCurrentUser } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';

export function RequireGod({
  children,
  redirectTo = '/',
}: {
  readonly children?: React.ReactNode;
  readonly redirectTo?: string;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isGod, setIsGod] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (user?.role === 'god') {
        setIsGod(true);
        setIsChecking(false);
        return;
      }

      try {
        if (isAuthenticated) {
          const freshUser = await getCurrentUser();
          setIsGod(freshUser.role === 'god');
        } else {
          setIsGod(false);
        }
      } catch (e) {
        console.error('Error checking god role:', e);
        setIsGod(false);
      } finally {
        setIsChecking(false);
      }
    };

    void checkRole();
  }, [user, isAuthenticated]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (!isGod) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
