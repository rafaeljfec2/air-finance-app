import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useHeaderNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldShowBackButton = useCallback(() => {
    return (
      location.pathname !== '/home' &&
      location.pathname !== '/' &&
      location.pathname !== '/login'
    );
  }, [location.pathname]);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const navigateTo = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  return {
    shouldShowBackButton: shouldShowBackButton(),
    goBack,
    navigateTo,
  };
}
