import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth';

const getTokenFromStorage = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      return null;
    }

    const parsed = JSON.parse(authStorage);
    return parsed.state?.token ?? null;
  } catch (error) {
    console.error('[useOpeniItemEvents] Error reading token from storage:', error);
    return null;
  }
};

const getTokenFromApi = async (): Promise<string | null> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl.endsWith('/v1') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/v1`;
    const response = await fetch(`${baseUrl}/auth/sse-token`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.token ?? null;
    }
    return null;
  } catch (error) {
    console.error('[useOpeniItemEvents] Error fetching SSE token from API:', error);
    return null;
  }
};

const getTokenFromAuthStorage = (): string | null => {
  try {
    const authStorageRaw = localStorage.getItem('auth-storage');
    if (!authStorageRaw) {
      return null;
    }
    const authStorageParsed = JSON.parse(authStorageRaw);
    return authStorageParsed?.state?.token ?? null;
  } catch {
    return null;
  }
};

const retrieveToken = async (currentState: ReturnType<typeof useAuthStore.getState>): Promise<string | null> => {
  let tokenToUse = currentState.token ?? getTokenFromStorage();

  if (!tokenToUse && currentState.user && currentState.isAuthenticated) {
    tokenToUse = getTokenFromAuthStorage();
  }

  if (!tokenToUse && currentState.user && currentState.isAuthenticated) {
    console.log('[useOpeniItemEvents] No token found, attempting to fetch SSE token from API (cookies may be in use)...');
    try {
      const apiToken = await getTokenFromApi();
      if (apiToken) {
        tokenToUse = apiToken;
        console.log('[useOpeniItemEvents] SSE token obtained from API');
      }
    } catch (error) {
      console.error('[useOpeniItemEvents] Error fetching SSE token:', error);
    }
  }

  return tokenToUse;
};

export interface OpeniItemEvent {
  event: string;
  itemId: string;
  status?: string;
  auth?: {
    authUrl: string;
    expiresAt: string;
  };
  warnings?: string[];
  timestamp: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'closed';

interface UseOpeniItemEventsOptions {
  companyId: string;
  itemId: string | null;
  enabled?: boolean;
  onEvent?: (event: OpeniItemEvent) => void;
  onError?: (error: Error) => void;
}

interface UseOpeniItemEventsReturn {
  lastEvent: OpeniItemEvent | null;
  connectionStatus: ConnectionStatus;
  error: Error | null;
  reconnect: () => Promise<void>;
  disconnect: () => void;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 2000;
const RETRY_INTERVAL_MS = 1000;
const RETRY_TIMEOUT_MS = 10000;

export const useOpeniItemEvents = ({
  companyId,
  itemId,
  enabled = true,
  onEvent,
  onError,
}: UseOpeniItemEventsOptions): UseOpeniItemEventsReturn => {
  const token = useAuthStore(state => state.token);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  console.log('[useOpeniItemEvents] Hook initialized', {
    itemId,
    enabled,
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated,
    tokenLength: token?.length ?? 0,
    usingCookies: !token && !!user,
  });

  const [lastEvent, setLastEvent] = useState<OpeniItemEvent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAttemptedConnectionRef = useRef(false);
  const currentItemIdRef = useRef<string | null>(null);
  const isConnectingRef = useRef(false);
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectRef = useRef<(() => Promise<void>) | null>(null);

  const disconnect = useCallback((resetItemId = true) => {
    console.log('[useOpeniItemEvents] disconnect() called', {
      hasEventSource: !!eventSourceRef.current,
      currentItemId: currentItemIdRef.current,
      resetItemId,
    });

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionStatus('closed');
    reconnectAttemptsRef.current = 0;
    if (resetItemId) {
      currentItemIdRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  const buildSseUrl = useCallback(
    (tokenToUse: string): string => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const baseUrl = apiUrl.endsWith('/v1') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/v1`;
      return `${baseUrl}/companies/${companyId}/banking/openi/items/${itemId}/events?token=${encodeURIComponent(tokenToUse)}`;
    },
    [companyId, itemId],
  );

  const handleEventMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data.startsWith(':')) {
        return;
      }

      try {
        const event: OpeniItemEvent = JSON.parse(e.data);
        setLastEvent(event);
        onEvent?.(event);
      } catch (parseError) {
        console.error('Failed to parse SSE event:', parseError);
      }
    },
    [onEvent],
  );

  const handleEventError = useCallback(
    async (eventSource: EventSource) => {
      console.error('SSE connection error:', {
        readyState: eventSource.readyState,
        url: eventSource.url,
      });

      if (eventSource.readyState === EventSource.CLOSED) {
        if (!enabled || !itemId) {
          console.log('[useOpeniItemEvents] Connection closed: SSE disabled or itemId cleared, not reconnecting');
          disconnect();
          return;
        }

        const currentState = useAuthStore.getState();
        const currentToken = await retrieveToken(currentState);

        if (!currentToken) {
          const error = new Error('Authentication token lost during connection');
          setError(error);
          setConnectionStatus('error');
          console.warn('[useOpeniItemEvents] Connection closed: token no longer available');
          onError?.(error);
          disconnect();
          return;
        }

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setConnectionStatus('reconnecting');
          reconnectAttemptsRef.current += 1;

          const delay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1),
            30000,
          );

          console.log(`[useOpeniItemEvents] Scheduling reconnect attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

          reconnectTimeoutRef.current = setTimeout(async () => {
            if (enabled && itemId && connectRef.current) {
              await connectRef.current();
            } else {
              console.log('[useOpeniItemEvents] Skipping reconnect: SSE disabled or itemId cleared');
              disconnect();
            }
          }, delay);
        } else {
          const error = new Error('SSE connection failed after maximum reconnect attempts');
          setError(error);
          setConnectionStatus('error');
          console.error('[useOpeniItemEvents] Max reconnect attempts reached, stopping');
          onError?.(error);
          disconnect();
        }
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('[useOpeniItemEvents] SSE is still connecting, waiting...');
      }
    },
    [enabled, itemId, onError, disconnect],
  );

  const connect = useCallback(async () => {
    console.log('[useOpeniItemEvents] connect() called', {
      itemId,
      enabled,
      companyId,
      currentItemId: currentItemIdRef.current,
      isConnecting: isConnectingRef.current,
      hasEventSource: !!eventSourceRef.current,
    });

    if (!itemId || !enabled) {
      console.log('[useOpeniItemEvents] Skipping connection - missing itemId or disabled', {
        itemId,
        enabled,
      });
      return;
    }

    if (isConnectingRef.current) {
      console.log('[useOpeniItemEvents] Already connecting, skipping duplicate connection attempt');
      return;
    }

    if (currentItemIdRef.current === itemId && eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN) {
      console.log('[useOpeniItemEvents] Already connected to this itemId, skipping');
      return;
    }

    const currentState = useAuthStore.getState();
    const tokenToUse = await retrieveToken(currentState);

    if (!tokenToUse) {
      if (!hasAttemptedConnectionRef.current) {
        hasAttemptedConnectionRef.current = true;
        const err = new Error('No authentication token available');
        setError(err);
        setConnectionStatus('error');
        console.warn('[useOpeniItemEvents] Cannot connect: authentication token not available');
        console.warn('[useOpeniItemEvents] Token sources checked:', {
          zustandToken: currentState.token,
          storageToken: getTokenFromStorage(),
          hasUser: !!currentState.user,
          isAuthenticated: currentState.isAuthenticated,
        });
        onError?.(err);
      }
      return;
    }

    hasAttemptedConnectionRef.current = false;
    isConnectingRef.current = true;

    if (currentItemIdRef.current !== itemId && eventSourceRef.current) {
      console.log('[useOpeniItemEvents] ItemId changed, disconnecting previous connection', {
        oldItemId: currentItemIdRef.current,
        newItemId: itemId,
      });
      disconnect();
    }

    currentItemIdRef.current = itemId;
    setConnectionStatus('connecting');
    setError(null);

    const url = buildSseUrl(tokenToUse);

    console.log('[useOpeniItemEvents] Attempting SSE connection', {
      url: url.replace(tokenToUse, '***'),
      itemId,
      companyId,
      hasToken: !!tokenToUse,
      tokenLength: tokenToUse?.length ?? 0,
    });

    try {
      console.log('[useOpeniItemEvents] Creating EventSource', {
        url: url.replace(tokenToUse, '***'),
        hasToken: !!tokenToUse,
      });

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        isConnectingRef.current = false;
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        console.log(`[useOpeniItemEvents] SSE connected successfully for itemId: ${itemId}`, {
          hasToken: !!tokenToUse,
        });
      };

      eventSource.onmessage = handleEventMessage;

      eventSource.onerror = () => handleEventError(eventSource);
    } catch (err) {
      isConnectingRef.current = false;
      const error = err instanceof Error ? err : new Error('Failed to create SSE connection');
      setError(error);
      setConnectionStatus('error');
      onError?.(error);
    }
  }, [companyId, itemId, enabled, onError, disconnect, handleEventMessage, handleEventError, buildSseUrl]);

  connectRef.current = connect;

  const reconnect = useCallback(async () => {
    reconnectAttemptsRef.current = 0;
    if (connectRef.current) {
      await connectRef.current();
    }
  }, []);

  useEffect(() => {
    console.log('[useOpeniItemEvents] useEffect triggered', {
      itemId,
      enabled,
      currentItemId: currentItemIdRef.current,
      isConnecting: isConnectingRef.current,
      hasEventSource: !!eventSourceRef.current,
    });

    if (!itemId || !enabled) {
      console.log('[useOpeniItemEvents] Disconnecting - missing itemId or disabled', {
        itemId,
        enabled,
      });
      if (currentItemIdRef.current !== null) {
        disconnect();
      }
      hasAttemptedConnectionRef.current = false;
      return;
    }

    if (currentItemIdRef.current === itemId && eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN) {
      console.log('[useOpeniItemEvents] Already connected to this itemId, skipping useEffect connection');
      return;
    }

    const attemptConnection = async (): Promise<boolean> => {
      const currentState = useAuthStore.getState();
      const tokenToUse = await retrieveToken(currentState);

      if (!tokenToUse) {
        console.warn('[useOpeniItemEvents] Token not available, will retry...', {
          itemId,
          enabled,
          zustandToken: currentState.token,
          storageToken: getTokenFromStorage(),
          hasUser: !!currentState.user,
          isAuthenticated: currentState.isAuthenticated,
        });
        return false;
      }

      console.log('[useOpeniItemEvents] Conditions met, calling connect()', {
        itemId,
        enabled,
        hasToken: !!tokenToUse,
      });

      hasAttemptedConnectionRef.current = false;
      if (connectRef.current) {
        await connectRef.current();
      }
      return true;
    };

    (async () => {
      if (!(await attemptConnection())) {
        retryIntervalRef.current = setInterval(async () => {
          const currentState = useAuthStore.getState();
          const currentToken = await retrieveToken(currentState);

          console.log('[useOpeniItemEvents] Retrying connection - checking token availability', {
            zustandToken: currentState.token,
            storageToken: getTokenFromStorage(),
            hasUser: !!currentState.user,
            isAuthenticated: currentState.isAuthenticated,
            hasToken: !!currentToken,
          });

          if (currentToken && connectRef.current) {
            if (await attemptConnection()) {
              if (retryIntervalRef.current) {
                clearInterval(retryIntervalRef.current);
                retryIntervalRef.current = null;
              }
            }
          }
        }, RETRY_INTERVAL_MS);

        retryTimeoutRef.current = setTimeout(() => {
          if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
          }
          if (!hasAttemptedConnectionRef.current) {
            const finalState = useAuthStore.getState();
            hasAttemptedConnectionRef.current = true;
            console.error('[useOpeniItemEvents] Token not available after retries', {
              finalZustandToken: finalState.token,
              finalStorageToken: getTokenFromStorage(),
              hasUser: !!finalState.user,
              isAuthenticated: finalState.isAuthenticated,
            });
            setConnectionStatus('error');
            setError(new Error('No authentication token available'));
          }
        }, RETRY_TIMEOUT_MS);
      }
    })();

    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      console.log('[useOpeniItemEvents] useEffect cleanup', {
        currentItemId: currentItemIdRef.current,
        itemId,
        enabled,
      });
      if (currentItemIdRef.current === itemId && (!itemId || !enabled)) {
        disconnect(false);
      }
      hasAttemptedConnectionRef.current = false;
    };
  }, [itemId, enabled, disconnect]);

  return {
    lastEvent,
    connectionStatus,
    error,
    reconnect,
    disconnect,
  };
};
