/**
 * Structured Logger Utility
 * 
 * Provides consistent, structured JSON logging with:
 * - Log levels (debug, info, warn, error)
 * - Correlation IDs for request tracing
 * - Automatic context enrichment
 * - Safe serialization (no circular refs, sensitive data filtering)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    correlationId?: string;
    userId?: string;
    action?: string;
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
    service: string;
    environment: string;
}

// Sensitive field names to filter from logs
const SENSITIVE_FIELDS = new Set([
    'password',
    'token',
    'secret',
    'apikey',
    'api_key',
    'authorization',
    'cookie',
    'session',
    'credit_card',
    'ssn',
]);

/**
 * Recursively sanitize an object to remove sensitive data
 */
function sanitize(obj: unknown, depth = 0): unknown {
    if (depth > 10) return '[MAX_DEPTH]';

    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item, depth + 1));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_FIELDS.has(lowerKey)) {
            sanitized[key] = '[REDACTED]';
        } else {
            sanitized[key] = sanitize(value, depth + 1);
        }
    }
    return sanitized;
}

/**
 * Format error for structured logging
 */
function formatError(error: unknown): { name: string; message: string; stack?: string } | undefined {
    if (!error) return undefined;

    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        };
    }

    return {
        name: 'UnknownError',
        message: String(error),
    };
}

/**
 * Generate a short correlation ID for request tracing
 */
export function generateCorrelationId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create a logger instance with optional default context
 */
export function createLogger(defaultContext?: LogContext) {
    const service = 'career-black-box';
    const environment = process.env.NODE_ENV || 'development';
    const isProduction = environment === 'production';

    function log(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            service,
            environment,
        };

        // Merge default context with call-specific context
        const fullContext = { ...defaultContext, ...context };
        if (Object.keys(fullContext).length > 0) {
            entry.context = sanitize(fullContext) as LogContext;
        }

        // Add error if present
        if (error) {
            entry.error = formatError(error);
        }

        // Output as JSON in production, pretty print in development
        const output = isProduction
            ? JSON.stringify(entry)
            : JSON.stringify(entry, null, 2);

        switch (level) {
            case 'debug':
                if (!isProduction) console.debug(output);
                break;
            case 'info':
                console.log(output);
                break;
            case 'warn':
                console.warn(output);
                break;
            case 'error':
                console.error(output);
                break;
        }
    }

    return {
        debug: (message: string, context?: LogContext) => log('debug', message, context),
        info: (message: string, context?: LogContext) => log('info', message, context),
        warn: (message: string, context?: LogContext) => log('warn', message, context),
        error: (message: string, context?: LogContext, error?: unknown) => log('error', message, context, error),

        /**
         * Create a child logger with additional default context
         */
        child: (childContext: LogContext) => createLogger({ ...defaultContext, ...childContext }),
    };
}

// Default logger instance
export const logger = createLogger();

// Type exports
export type Logger = ReturnType<typeof createLogger>;
