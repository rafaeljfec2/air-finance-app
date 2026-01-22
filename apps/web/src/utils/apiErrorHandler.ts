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
      raw?: unknown;
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

interface ClassValidatorError {
  property?: string;
  constraints?: Record<string, string>;
  value?: unknown;
}

interface ClassValidatorErrorResponse {
  error?: string;
  timestamp?: string;
  path?: string;
}

interface ZodIssue {
  path: (string | number)[];
  message: string;
  code: string;
}

interface ZodErrorLike {
  name?: string;
  issues?: ZodIssue[];
  errors?: ZodIssue[];
}

// ============================================================================
// Type Guards
// ============================================================================

function isZodError(error: unknown): error is ZodErrorLike {
  if (!error || typeof error !== 'object') {
    return false;
  }

  if ('name' in error && error.name === 'ZodError') {
    return (
      ('issues' in error && Array.isArray(error.issues)) ||
      ('errors' in error && Array.isArray(error.errors))
    );
  }

  return false;
}

function isClassValidatorError(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  if ('error' in data && (data as ClassValidatorErrorResponse).error === 'VALIDATION_ERROR') {
    return true;
  }

  if (Array.isArray(data)) {
    return data.some(
      (item) =>
        typeof item === 'object' && item !== null && ('property' in item || 'constraints' in item),
    );
  }

  return false;
}

function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as AxiosErrorResponse).response === 'object'
  );
}

function isFetchError(error: unknown): error is FetchErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    typeof (error as FetchErrorResponse).status === 'number'
  );
}

// ============================================================================
// Translation Functions
// ============================================================================

/**
 * Traduz mensagens de erro comuns do Zod para português
 */
function translateZodMessage(message: string, _code: string, field: string): string {
  const translations: Record<string, string> = {
    'Invalid email': 'Por favor, insira um email válido',
    Invalid: `O campo ${field} é inválido`,
    Required: `O campo ${field} é obrigatório`,
    'Expected string, received': `O campo ${field} deve ser um texto`,
    'String must contain at least': `O campo ${field} é muito curto`,
    'String must contain at most': `O campo ${field} é muito longo`,
    'Too small': `O campo ${field} é muito pequeno`,
    'Too big': `O campo ${field} é muito grande`,
  };

  if (translations[message]) {
    return translations[message];
  }

  if (message.includes('Invalid email') || message.includes('email')) {
    return 'Por favor, insira um email válido';
  }

  if (message.includes('Required') || message.includes('required')) {
    return `O campo ${field} é obrigatório`;
  }

  if (message.includes('at least')) {
    const match = /at least (\d+)/.exec(message);
    if (match?.[1]) {
      return `O campo ${field} deve ter pelo menos ${match[1]} caracteres`;
    }
  }

  return message;
}

/**
 * Traduz mensagens de erro do class-validator para português
 */
function translateClassValidatorMessage(constraintKey: string, property: string): string {
  const translations: Record<string, string> = {
    isEmail: 'Por favor, insira um email válido',
    isNotEmpty: `O campo ${property} é obrigatório`,
    isString: `O campo ${property} deve ser um texto`,
    minLength: `O campo ${property} é muito curto`,
    maxLength: `O campo ${property} é muito longo`,
  };

  return translations[constraintKey] ?? `Erro de validação no campo ${property}`;
}

// ============================================================================
// Error Detail Extraction
// ============================================================================

/**
 * Extrai e traduz mensagens de erro do Zod
 */
function extractZodErrorDetails(zodError: ZodErrorLike): string[] {
  const issues = zodError.issues ?? zodError.errors ?? [];
  return issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join('.') : 'campo';
    return translateZodMessage(issue.message, issue.code, field);
  });
}

/**
 * Mapeia issues do Zod para detalhes formatados
 */
function mapZodIssuesToDetails(
  issues: ZodIssue[],
): Array<{ field: string; message: string; code: string }> {
  return issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join('.') : 'campo';
    const translatedMessage = translateZodMessage(issue.message, issue.code, field);
    return {
      field,
      message: translatedMessage,
      code: issue.code,
    };
  });
}

/**
 * Parseia erros de validação do class-validator (formato antigo)
 */
function parseClassValidatorErrors(
  validationErrors: unknown,
): Array<{ field: string; message: string; code: string }> {
  if (!Array.isArray(validationErrors)) {
    return [];
  }

  const details: Array<{ field: string; message: string; code: string }> = [];

  for (const error of validationErrors) {
    if (typeof error === 'object' && error !== null) {
      const validatorError = error as ClassValidatorError;
      const property = validatorError.property ?? 'campo';
      const constraints = validatorError.constraints ?? {};
      const constraintKeys = Object.keys(constraints);

      if (constraintKeys.length > 0) {
        const constraintKey = constraintKeys[0];
        const translatedMessage = translateClassValidatorMessage(constraintKey, property);

        details.push({
          field: property,
          message: translatedMessage,
          code: constraintKey,
        });
      }
    }
  }

  return details;
}

// ============================================================================
// ApiError Creation Helpers
// ============================================================================

/**
 * Cria um ApiError a partir de um ZodError
 */
function createApiErrorFromZod(
  zodError: ZodErrorLike,
  status = 400,
  metadata?: { timestamp?: string; path?: string },
): ApiError {
  const issues = zodError.issues ?? zodError.errors ?? [];
  const zodMessages = extractZodErrorDetails(zodError);
  const details = mapZodIssuesToDetails(issues);

  return {
    status,
    error: 'VALIDATION_ERROR',
    message: zodMessages.join('; '),
    details,
    timestamp: metadata?.timestamp,
    path: metadata?.path,
    raw: zodError,
  };
}

/**
 * Cria um ApiError a partir de erros do class-validator
 */
function createApiErrorFromClassValidator(
  validationErrors: unknown,
  status = 400,
  metadata?: { timestamp?: string; path?: string },
): ApiError {
  const details = parseClassValidatorErrors(validationErrors);
  const messages = details.map((d) => d.message);

  return {
    status,
    error: 'VALIDATION_ERROR',
    message: messages.length > 0 ? messages.join('; ') : 'Erro de validação',
    details,
    timestamp: metadata?.timestamp,
    path: metadata?.path,
    raw: validationErrors,
  };
}

/**
 * Cria um ApiError genérico a partir de dados da resposta
 */
function createApiErrorFromResponse(
  data: {
    status?: number;
    error?: string;
    message?: string;
    details?: unknown[];
    timestamp?: string;
    path?: string;
  },
  defaultStatus = 500,
): ApiError {
  return {
    status: data.status ?? defaultStatus,
    error: data.error ?? 'API_ERROR',
    message: data.message ?? 'Erro desconhecido na API',
    details: data.details ?? [],
    timestamp: data.timestamp,
    path: data.path,
  };
}

// ============================================================================
// Error Parsing Functions
// ============================================================================

/**
 * Processa erros de resposta Axios
 */
function parseAxiosError(error: AxiosErrorResponse): ApiError | null {
  const data = error.response?.data;
  const status = error.response?.status;

  if (!data) {
    return null;
  }

  // ZodError direto nos dados
  if (isZodError(data)) {
    return createApiErrorFromZod(data, status ?? 400, {
      timestamp: data.timestamp,
      path: data.path,
    });
  }

  // Class-validator error (formato antigo)
  if (isClassValidatorError(data) && Array.isArray(data)) {
    return createApiErrorFromClassValidator(data, status ?? 400, {
      timestamp: (data as ClassValidatorErrorResponse).timestamp,
      path: (data as ClassValidatorErrorResponse).path,
    });
  }

  // ZodError aninhado em raw
  const dataWithRaw = data as typeof data & { raw?: unknown };
  if (dataWithRaw.raw && isZodError(dataWithRaw.raw)) {
    return createApiErrorFromZod(dataWithRaw.raw, status ?? 400, {
      timestamp: data.timestamp,
      path: data.path,
    });
  }

  // Formato novo do backend (VALIDATION_ERROR)
  if (data.error === 'VALIDATION_ERROR' && Array.isArray(data.details)) {
    return {
      status: data.status ?? status ?? 400,
      error: 'VALIDATION_ERROR',
      message: data.message ?? 'Erro de validação',
      details: data.details,
      timestamp: data.timestamp,
      path: data.path,
      raw: error,
    };
  }

  // Erro genérico da API
  return {
    ...createApiErrorFromResponse(data, status ?? 500),
    raw: error,
  };
}

/**
 * Processa erros de resposta Fetch
 */
function parseFetchError(error: FetchErrorResponse): ApiError | null {
  if (isZodError(error)) {
    return createApiErrorFromZod(error, error.status ?? 400, {
      timestamp: error.timestamp,
      path: error.path,
    });
  }

  return {
    ...createApiErrorFromResponse(
      {
        status: error.status,
        error: error.error,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        path: error.path,
      },
      500,
    ),
    raw: error,
  };
}

/**
 * Busca por ZodError aninhado em um objeto
 */
function findNestedZodError(error: Record<string, unknown>): ZodErrorLike | null {
  for (const key in error) {
    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty(key)) {
      const value = error[key];
      if (isZodError(value)) {
        return value;
      }
    }
  }
  return null;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Parseia qualquer tipo de erro da API para um formato padronizado
 */
export function parseApiError(error: AxiosErrorResponse | FetchErrorResponse | unknown): ApiError {
  // Erro Axios
  if (isAxiosError(error)) {
    const parsed = parseAxiosError(error);
    if (parsed) {
      return parsed;
    }
  }

  // Erro Fetch
  if (isFetchError(error)) {
    const parsed = parseFetchError(error);
    if (parsed) {
      return parsed;
    }
  }

  // ZodError direto (validação no frontend)
  if (isZodError(error)) {
    return createApiErrorFromZod(error);
  }

  // ZodError aninhado
  if (error && typeof error === 'object') {
    const nestedZodError = findNestedZodError(error as Record<string, unknown>);
    if (nestedZodError) {
      return createApiErrorFromZod(nestedZodError);
    }
  }

  // Erro desconhecido
  return {
    status: 500,
    error: 'UNKNOWN_ERROR',
    message: 'Erro desconhecido',
    details: [],
    raw: error,
  };
}

/**
 * Extrai mensagem amigável para o usuário a partir de um ApiError
 */
export function getUserFriendlyMessage(error: ApiError): string {
  const { status, message, error: errorType, details } = error;

  // Erro de validação
  if (errorType === 'VALIDATION_ERROR') {
    if (details && Array.isArray(details) && details.length > 0) {
      const validationMessages = details
        .filter(
          (detail): detail is { field?: string; message?: string; code?: string } =>
            typeof detail === 'object' && detail !== null && 'message' in detail,
        )
        .map((detail) => {
          if (
            detail.message &&
            !detail.message.includes('must be') &&
            !detail.message.includes('should')
          ) {
            return detail.message;
          }

          const field = detail.field ? `${detail.field}: ` : '';
          return `${field}${detail.message ?? 'Erro de validação'}`;
        });

      if (validationMessages.length > 0) {
        return validationMessages.join('; ');
      }
    }

    if (message) {
      return message;
    }
  }

  // Detalhes de validação genéricos
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

  // Mensagens por status HTTP (prioriza mensagem do backend quando disponível)
  const statusMessages: Record<number, string> = {
    400: message || 'Dados inválidos. Por favor, verifique as informações e tente novamente.',
    401: message || 'Credenciais inválidas. Por favor, tente novamente.',
    403: message || 'Você não tem permissão para realizar esta ação.',
    404: message || 'Recurso não encontrado.',
    409: message || 'Conflito detectado. Por favor, verifique os dados e tente novamente.',
    422: message || 'Dados inválidos. Por favor, verifique as informações e tente novamente.',
    429: message || 'Muitas requisições. Por favor, aguarde um momento e tente novamente.',
    500: message || 'Erro interno do servidor. Por favor, tente novamente mais tarde.',
    503: message || 'Serviço indisponível. Por favor, tente novamente mais tarde.',
  };

  return (
    statusMessages[status] ?? message ?? 'Ocorreu um erro inesperado. Por favor, tente novamente.'
  );
}

/**
 * Registra detalhes do erro para debugging (apenas em desenvolvimento)
 */
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
