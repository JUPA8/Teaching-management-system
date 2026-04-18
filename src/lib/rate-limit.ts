/**
 * Simple sliding-window rate limiter backed by an in-memory Map.
 *
 * In Vercel serverless each warm function instance shares this Map within
 * its own process lifetime. State does NOT persist across cold starts or
 * across parallel Vercel instances. This provides meaningful protection
 * against simple brute-force attacks from a single source hitting the same
 * warm instance. For fully distributed rate limiting, replace the store with
 * Redis/Upstash and use the same interface.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

/** Prune expired keys when store grows large to prevent unbounded memory use */
function cleanup(): void {
  if (store.size < 2000) return;
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key);
  });
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check and increment the rate-limit counter for a given key.
 *
 * @param key      Unique string (e.g. IP address, or "ip:email")
 * @param limit    Max requests allowed per window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  cleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, remaining: 0, resetAt: entry.resetAt, retryAfterSeconds };
  }

  entry.count++;
  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Extract caller IP from Next.js request headers.
 * Vercel sets x-forwarded-for; fall back to x-real-ip, then 'unknown'.
 */
export function getClientIP(request: Request): string {
  return (
    (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Build a standard 429 JSON response */
export function tooManyRequests(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}
