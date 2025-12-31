import { Spinner } from '@/components/ui/spinner';
import { getCurrentUser } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function RequireGod({ children }: { children?: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isGod, setIsGod] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      // If we have user in store, check it first for speed
      if (user?.role === 'god') {
        setIsGod(true);
        setIsChecking(false);
        return;
      }

      // If strict check is needed or user not fully loaded, fetch fresh
      try {
        if (isAuthenticated) {
            const freshUser = await getCurrentUser();
            setIsGod(freshUser.role === 'god');
        }
      } catch (e) {
        setIsGod(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkRole();
  }, [user, isAuthenticated]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (!isGod) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
