import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ZodSchema, ZodError } from 'zod';

// Rate limiting with in-memory store (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  ip: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Auth helpers
export async function getAuthUser(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token;
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  }
  return { error: null, user };
}

export async function requireRole(req: NextRequest, roles: string[]) {
  const { error, user } = await requireAuth(req);
  if (error) return { error, user: null };

  if (!roles.includes(user!.role as string)) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      user: null,
    };
  }
  return { error: null, user };
}

// Validation helper
export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: NextRequest): Promise<{ data: T | null; error: NextResponse | null }> => {
    try {
      const body = await req.json();
      const data = schema.parse(body);
      return { data, error: null };
    } catch (err) {
      if (err instanceof ZodError) {
        return {
          data: null,
          error: NextResponse.json(
            { error: 'Validation failed', details: err.errors },
            { status: 400 }
          ),
        };
      }
      return {
        data: null,
        error: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }),
      };
    }
  };
}

// Pagination helper
export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// API response helpers
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// Slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Date helpers
export function isExpired(date: Date | null | undefined): boolean {
  if (!date) return true;
  return new Date(date) < new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
