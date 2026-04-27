import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimitAsync, getClientIP, tooManyRequests } from './rate-limit';

export async function applyRateLimit(
  request: NextRequest,
  prefix: string,
  limit: number,
  windowMs: number
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const rl = await checkRateLimitAsync(`${prefix}:${ip}`, limit, windowMs);
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    );
  }
  return null;
}
