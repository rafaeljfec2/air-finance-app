export interface ApiError {
  status: number;
  error: string;
  message: string;
  details?: unknown[];
  timestamp?: string;
  path?: string;
  raw?: unknown; // original error for debugging
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      status?: number;
      error?: string;
      message?: string;
      details?: unknown[];
      timestamp?: string;
      path?: string;
    };
    status?: number;
  };
}

interface FetchErrorResponse {
  status?: number;
  error?: string;
  message?: string;
  details?: unknown[];
  timestamp?: string;
  path?: string;
}

export function parseApiError(error: AxiosErrorResponse | FetchErrorResponse | unknown): ApiError {
  // Handle axios error response
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorResponse;
    const data = axiosError.response?.data;
    const status = axiosError.response?.status;

    if (data) {
      return {
        status: data.status || status || 500,
        error: data.error || 'API_ERROR',
        message: data.message || 'Erro desconhecido na API',
        details: data.details || [],
        timestamp: data.timestamp,
        path: data.path,
        raw: error,
      };
    }
  }

  // Handle fetch error response
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    const fetchError = error as FetchErrorResponse;
    return {
      status: fetchError.status || 500,
      error: fetchError.error || 'API_ERROR',
      message: fetchError.message || 'Erro desconhecido',
      details: fetchError.details || [],
      timestamp: fetchError.timestamp,
      path: fetchError.path,
      raw: error,
    };
  }

  // Handle generic error
  return {
    status: 500,
    error: 'UNKNOWN_ERROR',
    message: 'Erro desconhecido',
    details: [],
    raw: error,
  };
}

// Helper function to get user-friendly error message
export function getUserFriendlyMessage(error: ApiError): string {
  const { status, message } = error;

  // Handle common HTTP status codes with friendly messages
  switch (status) {
    case 400:
      return 'Dados inválidos. Por favor, verifique as informações e tente novamente.';
    case 401:
      return 'Sessão expirada. Por favor, faça login novamente.';
    case 403:
      return 'Você não tem permissão para realizar esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return message || 'Conflito detectado. Por favor, verifique os dados e tente novamente.';
    case 422:
      return 'Dados inválidos. Por favor, verifique as informações e tente novamente.';
    case 429:
      return 'Muitas requisições. Por favor, aguarde um momento e tente novamente.';
    case 500:
      return 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
    case 503:
      return 'Serviço indisponível. Por favor, tente novamente mais tarde.';
    default:
      return message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
  }
}

// Helper function to log error details (for development/debugging)
export function logApiError(error: ApiError): void {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('API Error:', {
      status: error.status,
      error: error.error,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      path: error.path,
      raw: error.raw,
    });
  }
}
