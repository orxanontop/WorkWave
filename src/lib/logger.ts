import { randomUUID } from 'crypto';
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
  base: isProduction
    ? {
        env: process.env.NODE_ENV,
        service: 'workwave',
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// ---------------------------------------------------------------------------
// Request ID header key — API routes read this from incoming requests
// ---------------------------------------------------------------------------
export const REQUEST_ID_HEADER = 'x-request-id';

export function generateRequestId(): string {
  return randomUUID();
}

export function withRequestContext(reqId: string, method: string, path: string): pino.Logger {
  return logger.child({ reqId, method, path });
}

export function withUserContext(parent: pino.Logger, userId?: string): pino.Logger {
  return parent.child({ userId: userId || 'anonymous' });
}

// ---------------------------------------------------------------------------
// Server-side request logger — use at the top of route handlers before
// any other logic so the reqId propagates through the entire request
// ---------------------------------------------------------------------------
export interface RequestContext {
  reqId: string;
  method: string;
  path: string;
  userId?: string;
}

export function createRequestLogger(ctx: RequestContext) {
  const base = withRequestContext(ctx.reqId, ctx.method, ctx.path);
  return ctx.userId ? withUserContext(base, ctx.userId) : base;
}
