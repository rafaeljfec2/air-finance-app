import { useState, useEffect, useMemo } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface BreakpointConfig {
  readonly mobile: number;
  readonly tablet: number;
  readonly desktop: number;
}

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

function getBreakpoint(width: number, breakpoints: BreakpointConfig): Breakpoint {
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

function getInitialBreakpoint(breakpoints: BreakpointConfig): Breakpoint {
  if (globalThis.window === undefined) return 'mobile';
  return getBreakpoint(globalThis.window.innerWidth, breakpoints);
}

interface UseResponsiveBreakpointReturn {
  readonly breakpoint: Breakpoint;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
  readonly isTabletOrAbove: boolean;
  readonly isMobileOrTablet: boolean;
}

export function useResponsiveBreakpoint(
  customBreakpoints?: Partial<BreakpointConfig>,
): UseResponsiveBreakpointReturn {
  const breakpoints = useMemo(
    () => ({ ...DEFAULT_BREAKPOINTS, ...customBreakpoints }),
    [customBreakpoints],
  );

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => getInitialBreakpoint(breakpoints));

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(globalThis.window.innerWidth, breakpoints);
      setBreakpoint((current) => (current === newBreakpoint ? current : newBreakpoint));
    };

    handleResize();
    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isTabletOrAbove: breakpoint === 'tablet' || breakpoint === 'desktop',
    isMobileOrTablet: breakpoint === 'mobile' || breakpoint === 'tablet',
  };
}
