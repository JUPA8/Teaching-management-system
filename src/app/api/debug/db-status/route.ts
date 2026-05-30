export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * GET /api/debug/db-status
 *
 * Development-only route that shows DB connection info WITHOUT exposing credentials.
 * Returns 404 in production so it cannot be called on the live site.
 *
 * Safe to commit — reveals only host and database name, never password/token.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const url = process.env.DATABASE_URL ?? '';
  const isSet = url.length > 0;

  let host = 'unknown';
  let database = 'unknown';
  let sslmode = 'unknown';
  let isNeon = false;
  let isLocal = false;

  if (isSet) {
    try {
      // Parse postgresql://user:pass@host:port/dbname?params
      const match = url.match(
        /postgresql:\/\/[^:]+:[^@]+@([^/:]+)(?::\d+)?\/([^?]+)(?:\?(.*))?/
      );
      if (match) {
        host = match[1];
        database = match[2];
        const params = new URLSearchParams(match[3] ?? '');
        sslmode = params.get('sslmode') ?? 'not set';
        isNeon = host.includes('neon.tech');
        isLocal = host === 'localhost' || host === '127.0.0.1';
      }
    } catch {
      host = 'parse error';
    }
  }

  // Optionally try a live ping via Prisma
  let dbReachable: boolean | null = null;
  let dbError: string | null = null;
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    dbReachable = true;
  } catch (e: unknown) {
    dbReachable = false;
    dbError = e instanceof Error ? e.message.split('\n')[0] : String(e);
  }

  return NextResponse.json({
    env: process.env.NODE_ENV,
    database_url_set: isSet,
    host,
    database,
    sslmode,
    is_neon: isNeon,
    is_local: isLocal,
    db_reachable: dbReachable,
    db_error: dbError,
    nextauth_url: process.env.NEXTAUTH_URL ?? 'not set',
    app_env: process.env.NEXT_PUBLIC_APP_ENV ?? 'not set',
  });
}
