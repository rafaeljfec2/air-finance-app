import { Component, ErrorInfo, ReactNode } from 'react';

import {
  attemptChunkLoadRecovery,
  clearChunkReloadFlag,
  isChunkLoadError,
  stripChunkReloadQueryParam,
} from '@/utils/chunkLoadRecovery';

import { ErrorPage } from './ErrorPage';

interface Props {
  readonly children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function logErrorPayload(error: Error, errorInfo: ErrorInfo): void {
  const payload = {
    message: error.message,
    stack: error.stack ?? undefined,
    route: globalThis.window === undefined ? undefined : globalThis.window.location.pathname,
    href: globalThis.window === undefined ? undefined : globalThis.window.location.href,
    componentStack: errorInfo.componentStack ?? undefined,
  };
  console.error('[ErrorBoundary] Erro capturado:', payload);
  console.error('[ErrorBoundary] Stack trace:', error.stack);
}

export function registerGlobalErrorListeners(): void {
  if (globalThis.window === undefined) return;

  stripChunkReloadQueryParam();

  globalThis.window.addEventListener('error', (event) => {
    const recovered = attemptChunkLoadRecovery(event.error ?? event.message);
    if (recovered) {
      event.preventDefault();
    }
    console.error('[window.error]', {
      message: event.message,
      source: event.filename,
      error: event.error?.message,
      href: globalThis.window.location.href,
      chunkRecovered: recovered,
    });
  });

  globalThis.window.addEventListener('unhandledrejection', (event) => {
    const recovered = attemptChunkLoadRecovery(event.reason);
    console.error('[unhandledrejection]', {
      reason: event.reason,
      href: globalThis.window.location.href,
      chunkRecovered: recovered,
    });
    if (recovered) {
      event.preventDefault();
    }
  });

  // Vite fires this when a dynamically imported chunk 404s after a new deploy.
  globalThis.window.addEventListener('vite:preloadError', ((event: Event) => {
    const preloadEvent = event as Event & { payload?: unknown; preventDefault(): void };
    preloadEvent.preventDefault();
    const recovered = attemptChunkLoadRecovery(
      preloadEvent.payload ?? new Error('Failed to fetch dynamically imported module'),
    );
    console.error('[vite:preloadError]', {
      href: globalThis.window.location.href,
      chunkRecovered: recovered,
    });
  }) as EventListener);

  // Allow another recovery later in the same tab only after a healthy boot.
  globalThis.window.setTimeout(() => {
    clearChunkReloadFlag();
  }, 10_000);
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    if (isChunkLoadError(error)) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (attemptChunkLoadRecovery(error)) {
      return;
    }
    logErrorPayload(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} code={500} />;
    }

    return this.props.children;
  }
}
