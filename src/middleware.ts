import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect locale-less platform paths to default locale (de)
  const platformPaths = ['/admin', '/dashboard', '/teacher'];
  if (platformPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    const newPathname = `/de${pathname}`;
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // Run next-intl middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (/_next, /images, etc.)
  // - Favicon
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(de|ar|en)/:path*',
    // Enable redirects that add missing locales
    // (e.g. `/about` -> `/en/about`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
