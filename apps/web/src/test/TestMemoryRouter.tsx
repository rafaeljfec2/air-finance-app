import type { ReactNode } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

import { testRouterFuture } from './testRouterFuture';

export function TestMemoryRouter({
  children,
  ...props
}: Readonly<{ children: ReactNode } & Omit<MemoryRouterProps, 'future' | 'children'>>) {
  return (
    <MemoryRouter future={testRouterFuture} {...props}>
      {children}
    </MemoryRouter>
  );
}
