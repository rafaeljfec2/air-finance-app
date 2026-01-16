import { useEffect } from 'react';

export function usePageScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.style.overflow = 'auto';
    bodyElement.style.overflow = 'auto';

    return () => {
      htmlElement.style.overflow = '';
      bodyElement.style.overflow = '';
    };
  }, [enabled]);
}
