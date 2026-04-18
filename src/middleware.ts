import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// ── CSRF origin validation ────────────────────────────────────────────────────
// Applies to all state-mutating API requests (POST / PATCH / DELETE / PUT).
// Exempt routes: Stripe webhook (no Origin header), NextAuth (handles internally).
//
// Logic:
//   - If the request has no Origin header it came from server-to-server or curl → allow.
//   - If Origin is present it must match the request's Host header → reject mismatches.
//
// This prevents cross-site form submissions that would carry the user's session cookie.
const CSRF_EXEMPT_PREFIXES = [
  '/api/payments/webhook', // Stripe sends no Origin
  '/api/auth/',            // NextAuth manages its own CSRF token
];

function isCsrfSafe(request: NextRequest): boolean {
  const method = request.method;
  if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) return true;

  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/api/')) return true;
  if (CSRF_EXEMPT_PREFIXES.some((p) => pathname.startsWith(p))) return true;

  const origin = request.headers.get('origin');
  if (!origin) return true; // No Origin = server-to-server or CLI → allow

  const host = request.headers.get('host') ?? '';
  try {
    return new URL(origin).host === host;
  } catch {
    return false; // Malformed Origin → reject
  }
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── CSRF check for mutating API routes ────────────────────────────────────
  if (pathname.startsWith('/api/') && !isCsrfSafe(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: invalid request origin' },
      { status: 403 }
    );
  }

  // API routes need no further middleware processing
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // ── Locale-less platform path redirect ────────────────────────────────────
  const platformPaths = ['/admin', '/dashboard', '/teacher'];
  if (platformPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.redirect(new URL(`/de${pathname}`, request.url));
  }

  // ── i18n middleware for all public/platform page routes ───────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // API routes — for CSRF check
    '/api/:path*',
    // Page routes — for i18n + platform redirects
    '/',
    '/(de|ar|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
