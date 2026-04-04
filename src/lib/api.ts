import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ZodSchema, ZodError } from 'zod';
import { checkRateLimit } from './rate-limit';
import { logger } from './logger';

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export function apiResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    { success: true, data },
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

export function apiError(
  message: string,
  status: number = 400,
  code?: string,
  details?: unknown[]
) {
  const body: ApiErrorResponse = { success: false, error: message };
  if (code) body.code = code;
  if (details) body.details = details;
  return NextResponse.json(body, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function rateLimit(
  req: NextRequest,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const result = await checkRateLimit(ip, limit, Math.floor(windowMs / 1000));
  return {
    allowed: result.allowed,
    response: result.allowed
      ? undefined
      : apiError('Too many requests. Please try again later.', 429, 'RATE_LIMITED'),
  };
}

export async function getAuthUser(req: NextRequest) {
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return { error: apiError('Unauthorized', 401, 'UNAUTHORIZED'), user: null };
  }
  return { error: null, user };
}

export async function requireRole(req: NextRequest, roles: string[]) {
  const { error, user } = await requireAuth(req);
  if (error) return { error, user: null };
  if (!roles.includes((user as any).role)) {
    return {
      error: apiError('You do not have permission to perform this action', 403, 'FORBIDDEN'),
      user: null,
    };
  }
  return { error: null, user };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: NextRequest): Promise<{ data: T | null; error: NextResponse | null }> => {
    try {
      const body = await req.json();
      const data = schema.parse(body);
      return { data, error: null };
    } catch (err) {
      if (err instanceof ZodError) {
        return { data: null, error: apiError('Validation failed', 400, 'VALIDATION_ERROR', err.errors) };
      }
      logger.error({ err }, 'Failed to parse request body');
      return { data: null, error: apiError('Invalid request body', 400, 'INVALID_BODY') };
    }
  };
}

export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '20')));
  return { page, perPage, skip: (page - 1) * perPage };
}

export function paginationMeta(total: number, page: number, perPage: number) {
  return { page, perPage, total, totalPages: Math.ceil(total / perPage) };
}

export function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100);
}

export function isExpired(date: Date | null | undefined): boolean {
  if (!date) return true;
  return new Date(date) < new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
