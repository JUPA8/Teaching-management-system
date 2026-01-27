import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

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
