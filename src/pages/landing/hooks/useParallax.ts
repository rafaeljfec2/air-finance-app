import { useEffect, useState } from 'react';

interface UseParallaxOptions {
  speed?: number;
  offset?: number;
}

export function useParallax({ speed = 0.5, offset = 0 }: UseParallaxOptions = {}) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxY = offsetY * speed + offset;

  return { parallaxY, scrollY: offsetY };
}

