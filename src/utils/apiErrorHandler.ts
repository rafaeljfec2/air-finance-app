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
      raw?: unknown; // Para erros aninhados como ZodError
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

function isZodError(error: unknown): error is {
  name: string;
  issues: Array<{ path: (string | number)[]; message: string; code: string }>;
  errors?: Array<{ path: (string | number)[]; message: string; code: string }>;
} {
  if (!error || typeof error !== 'object') {
    return false;
  }

  // Verifica se é um ZodError direto
  if ('name' in error && error.name === 'ZodError') {
    if ('issues' in error && Array.isArray(error.issues)) {
      return true;
    }
    // Algumas versões do Zod usam 'errors' ao invés de 'issues'
    if ('errors' in error && Array.isArray(error.errors)) {
      return true;
    }
  }

  return false;
}

function extractZodErrorDetails(zodError: {
  issues?: Array<{ path: (string | number)[]; message: string; code: string }>;
  errors?: Array<{ path: (string | number)[]; message: string; code: string }>;
}): string[] {
  const issues = zodError.issues ?? zodError.errors ?? [];
  return issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join('.') : 'campo';
    return `${field}: ${issue.message}`;
  });
}

export function parseApiError(error: AxiosErrorResponse | FetchErrorResponse | unknown): ApiError {
  // Handle axios error response
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorResponse;
    const data = axiosError.response?.data;
    const status = axiosError.response?.status;

    if (data) {
      // Check if the error data contains a ZodError
      if (isZodError(data)) {
        const zodMessages = extractZodErrorDetails(data);
        const issues = data.issues ?? data.errors ?? [];
        return {
          status: status || 400,
          error: 'VALIDATION_ERROR',
          message: zodMessages.join('; '),
          details: issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
          timestamp: data.timestamp,
          path: data.path,
          raw: error,
        };
      }

      // Check if raw contains ZodError
      const dataWithRaw = data as typeof data & { raw?: unknown };
      if (dataWithRaw.raw && isZodError(dataWithRaw.raw)) {
        const zodMessages = extractZodErrorDetails(dataWithRaw.raw);
        const issues = dataWithRaw.raw.issues ?? dataWithRaw.raw.errors ?? [];
        return {
          status: status || 400,
          error: 'VALIDATION_ERROR',
          message: zodMessages.join('; '),
          details: issues.map(
            (issue: { path: (string | number)[]; message: string; code: string }) => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            }),
          ),
          timestamp: data.timestamp,
          path: data.path,
          raw: error,
        };
      }

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

    // Check if it's a ZodError
    if (isZodError(fetchError)) {
      const zodMessages = extractZodErrorDetails(fetchError);
      const issues = fetchError.issues ?? fetchError.errors ?? [];
      return {
        status: fetchError.status || 400,
        error: 'VALIDATION_ERROR',
        message: zodMessages.join('; '),
        details: issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
        timestamp: fetchError.timestamp,
        path: fetchError.path,
        raw: error,
      };
    }

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

  // Check if it's a direct ZodError (pode vir de validação no frontend)
  if (isZodError(error)) {
    const zodMessages = extractZodErrorDetails(error);
    const issues = error.issues ?? error.errors ?? [];
    return {
      status: 400,
      error: 'VALIDATION_ERROR',
      message: zodMessages.join('; '),
      details: issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
      raw: error,
    };
  }

  // Check if error has a ZodError nested (pode estar em response.data.raw ou similar)
  if (error && typeof error === 'object') {
    // Verifica se há um ZodError aninhado em qualquer propriedade
    const errorObj = error as Record<string, unknown>;
    for (const key in errorObj) {
      // eslint-disable-next-line no-prototype-builtins
      if (errorObj.hasOwnProperty(key)) {
        const value = errorObj[key];
        if (isZodError(value)) {
          const zodMessages = extractZodErrorDetails(value);
          const issues = value.issues ?? value.errors ?? [];
          return {
            status: 400,
            error: 'VALIDATION_ERROR',
            message: zodMessages.join('; '),
            details: issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            })),
            raw: error,
          };
        }
      }
    }
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
  const { status, message, error: errorType, details } = error;

  // Se for erro de validação (Zod), retorna a mensagem específica
  if (errorType === 'VALIDATION_ERROR' && message) {
    return message;
  }

  // Se houver detalhes de validação, formata as mensagens
  if (details && Array.isArray(details) && details.length > 0) {
    const validationMessages = details
      .filter(
        (detail): detail is { field?: string; message?: string } =>
          typeof detail === 'object' && detail !== null && 'message' in detail,
      )
      .map((detail) => {
        const field = detail.field ? `${detail.field}: ` : '';
        return `${field}${detail.message ?? 'Erro de validação'}`;
      });

    if (validationMessages.length > 0) {
      return validationMessages.join('; ');
    }
  }

  // Handle common HTTP status codes with friendly messages
  switch (status) {
    case 400:
      return message || 'Dados inválidos. Por favor, verifique as informações e tente novamente.';
    case 401:
      return 'Sessão expirada. Por favor, faça login novamente.';
    case 403:
      return 'Você não tem permissão para realizar esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return message || 'Conflito detectado. Por favor, verifique os dados e tente novamente.';
    case 422:
      return message || 'Dados inválidos. Por favor, verifique as informações e tente novamente.';
    case 429:
      return 'Muitas requisições. Por favor, aguarde um momento e tente novamente.';
    case 500:
      return message || 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
    case 503:
      return 'Serviço indisponível. Por favor, tente novamente mais tarde.';
    default:
      return message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
  }
}

// Helper function to log error details (for development/debugging)
export function logApiError(error: ApiError): void {
  if (process.env.NODE_ENV !== 'production') {
     
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
