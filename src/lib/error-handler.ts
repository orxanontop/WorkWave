import { Prisma } from '@prisma/client';
import { logger } from './logger';
import { apiError } from './api';

// ---------------------------------------------------------------------------
// Centralised error handler — catches Prisma and generic errors in API routes
// and returns a consistent response shape with structured logging
// ---------------------------------------------------------------------------

export function handlePrismaError(err: Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case 'P2025':
      return apiError('Record not found', 404, 'NOT_FOUND');
    case 'P2002':
      const target = (err.meta?.target as string[]) || ['record'];
      return apiError(
        `A record with this ${target.join(', ')} already exists`,
        409,
        'CONFLICT'
      );
    case 'P2003':
      return apiError('Reference to a non-existent record', 400, 'INVALID_REFERENCE');
    case 'P2014':
      return apiError('The provided ID is invalid', 400, 'INVALID_ID');
    default:
      logger.error({ err, code: err.code }, 'Prisma database error');
      return apiError('Database operation failed', 500, 'DATABASE_ERROR');
  }
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  errorMessage = 'Internal server error'
): Promise<Response> {
  try {
    const result = await handler();
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return handleError(err, errorMessage);
  }
}

export function handleError(err: unknown, fallbackMsg = 'Internal server error'): Response {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error({ err, message: err.message }, 'Prisma validation error');
    return apiError('Invalid data provided', 400, 'VALIDATION_ERROR');
  }

  logger.error({ err }, fallbackMsg);
  return apiError(fallbackMsg, 500, 'INTERNAL_ERROR');
}
