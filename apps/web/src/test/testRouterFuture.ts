/** Opt into React Router v7 behaviors to avoid future-flag warnings in tests. */
export const testRouterFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;
