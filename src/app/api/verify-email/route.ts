import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, tooManyRequests } from '@/lib/rate-limit';

// GET /api/verify-email?token=...
export async function GET(request: NextRequest) {
  // Rate limit: 20 attempts per IP per 15 minutes (tokens are single-use so this is generous)
  const ip = getClientIP(request);
  const rl = checkRateLimit(`verify-email:${ip}`, 20, 15 * 60 * 1000);
  if (!rl.success) return tooManyRequests(rl.retryAfterSeconds);

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_token`);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
      select: {
        id: true,
        isVerified: true,
        emailVerificationExpires: true,
      },
    });

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid_token`);
    }

    if (user.isVerified) {
      // Already verified — just send to login
      return NextResponse.redirect(`${baseUrl}/login?verified=1`);
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.redirect(`${baseUrl}/login?error=token_expired`);
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return NextResponse.redirect(`${baseUrl}/login?verified=1`);
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
