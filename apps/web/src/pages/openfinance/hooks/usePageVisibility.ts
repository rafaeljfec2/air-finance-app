import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageVisibility(): boolean {
  const location = useLocation();
  const isOnOpenFinancePage = location.pathname === '/openfinance';

  const [isTabVisible, setIsTabVisible] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.visibilityState === 'visible';
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsTabVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isTabVisible && isOnOpenFinancePage;
}
