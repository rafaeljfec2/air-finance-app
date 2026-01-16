import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from './ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error);
    console.error('Detalhes do erro:', errorInfo);
    console.error('Stack trace:', error.stack);
    
    // Log adicional para ajudar no debug
    if (error.message) {
      console.error('Mensagem do erro:', error.message);
    }
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} code={500} />;
    }

    return this.props.children;
  }
}
