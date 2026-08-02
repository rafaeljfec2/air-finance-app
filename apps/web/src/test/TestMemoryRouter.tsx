import type { ReactNode } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

export function TestMemoryRouter({
  children,
  ...props
}: Readonly<{ children: ReactNode } & Omit<MemoryRouterProps, 'children'>>) {
  return <MemoryRouter {...props}>{children}</MemoryRouter>;
}
