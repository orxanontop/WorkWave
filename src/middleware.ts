import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { generateRequestId, REQUEST_ID_HEADER, logger } from '@/lib/logger';

// ---------------------------------------------------------------------------
// Locale detection from Accept-Language header
// ---------------------------------------------------------------------------
const SUPPORTED_LOCALES = ['en', 'az', 'ru'] as const;
const DEFAULT_LOCALE = 'en';

function detectLocale(req: NextRequest): typeof SUPPORTED_LOCALES[number] {
  const acceptLang = req.headers.get('accept-language');
  if (!acceptLang) return DEFAULT_LOCALE;

  const langs = acceptLang
    .split(',')
    .map((l) => l.trim().toLowerCase().slice(0, 2))
    .filter(Boolean);

  for (const lang of langs) {
    if (SUPPORTED_LOCALES.includes(lang as any)) {
      return lang as any;
    }
  }
  return DEFAULT_LOCALE;
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = (
  process.env.CORS_ALLOWED_ORIGINS ||
  'http://localhost:3000,http://localhost:3001'
).split(',');

function setCorsHeaders(res: NextResponse, origin: string) {
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Max-Age', '86400');
}

function isAllowedOrigin(origin: string) {
  return ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*');
}

// ---------------------------------------------------------------------------
// Rate Limit headers (read from Redis in API routes, just passthrough headers here for client visibility)
// ---------------------------------------------------------------------------
function setRateLimitHeaders(res: NextResponse, remaining: number, resetAt: number) {
  res.headers.set('X-RateLimit-Remaining', String(remaining));
  res.headers.set('X-RateLimit-Reset', String(resetAt));
}

// ---------------------------------------------------------------------------
// Route Protection
// ---------------------------------------------------------------------------
const PROTECTED_ROUTES = [
  { prefix: '/dashboard' },
  { prefix: '/admin' },
];

async function checkAuth(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;

  for (const route of PROTECTED_ROUTES) {
    if (!pathname.startsWith(route.prefix)) continue;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin routes require ADMIN role
    if (route.prefix === '/admin' && (token as any).role !== 'ADMIN') {
      const res = NextResponse.json(
        { error: 'Forbidden: admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
      return res;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Middleware entry point
// ---------------------------------------------------------------------------
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const origin = req.headers.get('origin') || '';
  const locale = detectLocale(req);

  // Generate or propagate request ID
  let reqId = req.headers.get(REQUEST_ID_HEADER) || generateRequestId();

  // Log incoming request
  const isApiRoute = url.pathname.startsWith('/api/');
  if (isApiRoute) {
    logger.info(
      { reqId, method: req.method, path: url.pathname, locale },
      'Incoming request'
    );
  }

  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    if (isAllowedOrigin(origin)) {
      const res = new NextResponse(null, { status: 204 });
      setCorsHeaders(res, origin);
      res.headers.set(REQUEST_ID_HEADER, reqId);
      return res;
    }
    return new NextResponse(null, { status: 403 });
  }

  // Check route protection (auth required)
  const authResult = await checkAuth(req);
  if (authResult) {
    authResult.headers.set(REQUEST_ID_HEADER, reqId);
    return authResult;
  }

  // Pass through to route handler
  const res = NextResponse.next();

  // Attach request ID for downstream handlers
  res.headers.set(REQUEST_ID_HEADER, reqId);

  // Attach locale header
  res.headers.set('X-Locale', locale);

  // Set CORS origin headers (if origin present)
  if (origin && isAllowedOrigin(origin)) {
    setCorsHeaders(res, origin);
  }

  // Content-Security-Policy (via headers function in route handlers for API,
  // but we set it here for pages too)
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );

  return res;
}

// ---------------------------------------------------------------------------
// Matcher config — avoid _next static files, images, and favicon
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth/session).*)',
    '/api/:path*',
  ],
};
