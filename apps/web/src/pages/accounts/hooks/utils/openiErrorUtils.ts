export interface ErrorResponse {
  status?: number;
  error?: string;
  message?: string | { message?: string; itemId?: string };
  itemId?: string;
  details?: Array<{
    id: string;
    connectorId?: string;
    status: string;
    auth?: {
      authUrl: string;
      expiresAt: string;
    };
    warnings: string[];
    updatedAt: string;
    createdAt: string;
  }>;
  timestamp?: string;
  path?: string;
  response?: {
    status?: number;
    data?: ErrorResponse & { statusCode?: number };
  };
  raw?: {
    status?: number;
    response?: {
      status?: number;
    };
  };
}

export const getErrorStatus = (error: unknown): number | undefined => {
  const err = error as ErrorResponse;
  return (
    err.response?.status ??
    err.status ??
    err.raw?.status ??
    err.raw?.response?.status ??
    err.response?.data?.statusCode
  );
};

export const getErrorData = (error: unknown): ErrorResponse => {
  const err = error as ErrorResponse;
  return err.response?.data ?? err;
};

export const extractItemIdFromError = (errorData: ErrorResponse, errorMessage: string): string | undefined => {
  if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
    const firstDetail = errorData.details[0];
    if (firstDetail && typeof firstDetail === 'object' && 'id' in firstDetail) {
      return firstDetail.id;
    }
  }

  if (typeof errorData.message === 'object' && errorData.message !== null && 'itemId' in errorData.message) {
    return errorData.message.itemId;
  }

  if (errorData.itemId) {
    return errorData.itemId;
  }

  const itemIdRegex = /Item ID:\s*([a-f0-9-]+)/i;
  const itemIdMatch = itemIdRegex.exec(errorMessage);
  if (itemIdMatch?.[1]) {
    return itemIdMatch[1];
  }

  if (typeof errorData === 'object' && errorData !== null) {
    const errorDataString = JSON.stringify(errorData);
    const itemIdMatchFromString = itemIdRegex.exec(errorDataString);
    if (itemIdMatchFromString?.[1]) {
      return itemIdMatchFromString[1];
    }
  }

  return undefined;
};

export const extractErrorMessage = (errorData: ErrorResponse): string => {
  if (typeof errorData?.message === 'string') {
    return errorData.message;
  }
  if (typeof errorData?.message === 'object' && errorData.message !== null) {
    if (errorData.message.message) {
      return errorData.message.message;
    }
    return JSON.stringify(errorData.message);
  }
  return 'Erro ao criar conexão Openi';
};

export const hasConflictMessage = (errorMessage: string): boolean => {
  return (
    errorMessage.includes('Já existe um item ativo') ||
    errorMessage.includes('Item ID:') ||
    errorMessage.includes('already exists')
  );
};
