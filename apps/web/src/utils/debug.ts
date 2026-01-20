import { env } from './env';

/**
 * Debug utility for frontend development
 * Provides structured logging with different levels and context
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface DebugOptions {
  level?: LogLevel;
  context?: string;
  data?: unknown;
  timestamp?: boolean;
}

/**
 * Check if debug is enabled based on environment variables
 */
function isDebugEnabled(): boolean {
  return env.VITE_DEBUG === true || env.VITE_APP_ENV === 'development';
}

/**
 * Get current log level from environment
 */
function getLogLevel(): LogLevel {
  return env.VITE_LOG_LEVEL ?? 'info';
}

/**
 * Check if a log level should be displayed
 */
function shouldLog(level: LogLevel): boolean {
  if (!isDebugEnabled()) {
    return false;
  }

  const currentLevel = getLogLevel();
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const currentIndex = levels.indexOf(currentLevel);
  const messageIndex = levels.indexOf(level);

  return messageIndex >= currentIndex;
}

/**
 * Format timestamp for logs
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format log message with context
 */
function formatMessage(
  level: LogLevel,
  message: string,
  context?: string,
): string {
  const parts: string[] = [];

  // Level emoji
  const emoji = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
  }[level];

  parts.push(emoji);

  // Context
  if (context) {
    parts.push(`[${context}]`);
  }

  // Message
  parts.push(message);

  return parts.join(' ');
}

/**
 * Debug logger with structured output
 */
export const debug = {
  /**
   * Log debug message
   */
  log: (message: string, options?: DebugOptions): void => {
    if (!shouldLog('debug')) return;

    const { context, data, timestamp = true } = options ?? {};
    const formattedMessage = formatMessage('debug', message, context);
    const logData: unknown[] = [formattedMessage];

    if (timestamp) {
      logData.push(`[${getTimestamp()}]`);
    }

    if (data !== undefined) {
      logData.push(data);
    }

    console.log(...logData);
  },

  /**
   * Log info message
   */
  info: (message: string, options?: DebugOptions): void => {
    if (!shouldLog('info')) return;

    const { context, data, timestamp = true } = options ?? {};
    const formattedMessage = formatMessage('info', message, context);
    const logData: unknown[] = [formattedMessage];

    if (timestamp) {
      logData.push(`[${getTimestamp()}]`);
    }

    if (data !== undefined) {
      logData.push(data);
    }

    console.info(...logData);
  },

  /**
   * Log warning message
   */
  warn: (message: string, options?: DebugOptions): void => {
    if (!shouldLog('warn')) return;

    const { context, data, timestamp = true } = options ?? {};
    const formattedMessage = formatMessage('warn', message, context);
    const logData: unknown[] = [formattedMessage];

    if (timestamp) {
      logData.push(`[${getTimestamp()}]`);
    }

    if (data !== undefined) {
      logData.push(data);
    }

    console.warn(...logData);
  },

  /**
   * Log error message
   */
  error: (message: string, options?: DebugOptions & { error?: Error }): void => {
    if (!shouldLog('error')) return;

    const { context, data, error: err, timestamp = true } = options ?? {};
    const formattedMessage = formatMessage('error', message, context);
    const logData: unknown[] = [formattedMessage];

    if (timestamp) {
      logData.push(`[${getTimestamp()}]`);
    }

    if (data !== undefined) {
      logData.push(data);
    }

    if (err) {
      logData.push(err);
    }

    console.error(...logData);
  },

  /**
   * Group related logs
   */
  group: (label: string, callback: () => void): void => {
    if (!isDebugEnabled()) {
      callback();
      return;
    }

    console.group(label);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Group collapsed related logs
   */
  groupCollapsed: (label: string, callback: () => void): void => {
    if (!isDebugEnabled()) {
      callback();
      return;
    }

    console.groupCollapsed(label);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Log table data
   */
  table: (data: unknown): void => {
    if (!isDebugEnabled()) return;
    console.table(data);
  },

  /**
   * Log time measurement
   */
  time: (label: string): void => {
    if (!isDebugEnabled()) return;
    console.time(label);
  },

  /**
   * End time measurement
   */
  timeEnd: (label: string): void => {
    if (!isDebugEnabled()) return;
    console.timeEnd(label);
  },
};

/**
 * Create a debugger with a specific context
 */
export function createDebugger(context: string) {
  return {
    log: (message: string, data?: unknown) => debug.log(message, { context, data }),
    info: (message: string, data?: unknown) => debug.info(message, { context, data }),
    warn: (message: string, data?: unknown) => debug.warn(message, { context, data }),
    error: (message: string, data?: unknown, error?: Error) =>
      debug.error(message, { context, data, error }),
    group: (label: string, callback: () => void) => debug.group(`${context}: ${label}`, callback),
    groupCollapsed: (label: string, callback: () => void) =>
      debug.groupCollapsed(`${context}: ${label}`, callback),
    time: (label: string) => debug.time(`${context}: ${label}`),
    timeEnd: (label: string) => debug.timeEnd(`${context}: ${label}`),
  };
}
