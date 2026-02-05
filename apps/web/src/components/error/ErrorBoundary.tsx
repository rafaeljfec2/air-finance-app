import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from './ErrorPage';

interface Props {
  children: ReactNode;
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
  globalThis.window.onerror = (message, source, lineno, colno, error) => {
    console.error('[window.onerror]', {
      message,
      source,
      lineno,
      colno,
      error: error?.message,
      stack: error?.stack,
      href: globalThis.window.location.href,
    });
    return false;
  };
  globalThis.window.addEventListener('unhandledrejection', (event) => {
    console.error('[unhandledrejection]', {
      reason: event.reason,
      href: globalThis.window.location.href,
    });
  });
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logErrorPayload(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} code={500} />;
    }

    return this.props.children;
  }
}
