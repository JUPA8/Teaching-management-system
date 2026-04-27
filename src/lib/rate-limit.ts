/**
 * Rate limiter with Upstash Redis support.
 *
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses Upstash
 * distributed rate limiting (works correctly across Vercel function instances).
 * Otherwise, falls back to the in-memory sliding-window implementation.
 *
 * To enable Upstash:
 *   npm install @upstash/ratelimit @upstash/redis
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=...
 */

// ── In-memory fallback ────────────────────────────────────────────────────────

interface Entry { count: number; resetAt: number }
const store = new Map<string, Entry>();

function cleanup(): void {
  if (store.size < 2000) return;
  const now = Date.now();
  store.forEach((entry, key) => { if (entry.resetAt < now) store.delete(key); });
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

function checkRateLimitInMemory(key: string, limit: number, windowMs: number): RateLimitResult {
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
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt, retryAfterSeconds: 0 };
}

// ── Upstash Redis rate limiter (loaded lazily) ────────────────────────────────

let upstashRatelimit: any = null;
let upstashRedis: any = null;

async function loadUpstash() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return false;
  }
  if (upstashRatelimit) return true;
  try {
    const [{ Ratelimit }, { Redis }] = await Promise.all([
      import('@upstash/ratelimit'),
      import('@upstash/redis'),
    ]);
    upstashRedis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashRatelimit = Ratelimit;
    return true;
  } catch {
    return false;
  }
}

// Cache of Ratelimit instances per config
const upstashLimiters = new Map<string, any>();

async function checkRateLimitUpstash(key: string, limit: number, windowMs: number): Promise<RateLimitResult | null> {
  const loaded = await loadUpstash();
  if (!loaded) return null;
  try {
    const cacheKey = `${limit}:${windowMs}`;
    if (!upstashLimiters.has(cacheKey)) {
      upstashLimiters.set(cacheKey, new upstashRatelimit({
        redis: upstashRedis,
        limiter: upstashRatelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
        prefix: 'rl',
      }));
    }
    const limiter = upstashLimiters.get(cacheKey)!;
    const result = await limiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
      retryAfterSeconds: result.success ? 0 : Math.ceil((result.reset - Date.now()) / 1000),
    };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function checkRateLimitAsync(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const upstash = await checkRateLimitUpstash(key, limit, windowMs);
  if (upstash !== null) return upstash;
  return checkRateLimitInMemory(key, limit, windowMs);
}

/** Synchronous wrapper — uses in-memory only. Kept for backwards compatibility. */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  return checkRateLimitInMemory(key, limit, windowMs);
}

export function getClientIP(request: Request): string {
  return (
    (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function tooManyRequests(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfterSeconds) },
    }
  );
}
