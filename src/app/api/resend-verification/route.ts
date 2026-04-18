import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIP, tooManyRequests } from '@/lib/rate-limit';

const RESEND_COOLDOWN_MINUTES = 5;

// 5 resend attempts per IP per 15 minutes (in addition to per-email cooldown)
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

// POST /api/resend-verification
export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIP(request);
  const rl = checkRateLimit(`resend-verification:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.success) return tooManyRequests(rl.retryAfterSeconds);

  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : null;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        role: true,
        emailVerificationExpires: true,
      },
    });

    // Always return success to prevent email enumeration
    if (!user || user.isVerified || user.role !== 'STUDENT') {
      return NextResponse.json({ success: true, emailSent: false });
    }

    // ── Cooldown check ────────────────────────────────────────────────────────
    // emailVerificationExpires is set to now + 24h at issue time.
    // If expires > (now + 24h - cooldown), the token was issued within the cooldown window.
    if (user.emailVerificationExpires) {
      const cooldownCutoff = new Date(
        Date.now() + 24 * 60 * 60 * 1000 - RESEND_COOLDOWN_MINUTES * 60 * 1000
      );
      if (user.emailVerificationExpires > cooldownCutoff) {
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${RESEND_COOLDOWN_MINUTES} minutes before requesting another verification email.`,
            code: 'COOLDOWN',
          },
          { status: 429 }
        );
      }
    }

    // ── Issue a fresh token ───────────────────────────────────────────────────
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // ── Send ──────────────────────────────────────────────────────────────────
    let emailSent = false;
    let devVerificationLink: string | undefined;

    try {
      const result = await sendVerificationEmail(
        user.email,
        user.name || user.email,
        verificationToken
      );
      emailSent = result.sent;
      devVerificationLink = result.devVerificationLink;
    } catch (emailError: any) {
      console.error('[ResendVerification] Email sending failed:', {
        email: user.email,
        error: emailError?.message,
      });
    }

    const response: Record<string, unknown> = {
      success: true,
      emailSent,
      message: emailSent
        ? 'Verification email sent. Please check your inbox.'
        : 'Could not send email. Please ensure SMTP is configured or contact support.',
    };

    if (process.env.NODE_ENV !== 'production' && devVerificationLink) {
      response.devVerificationLink = devVerificationLink;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[ResendVerification] Unexpected error:', error?.message);
    return NextResponse.json(
      { success: false, error: 'Failed to resend verification email.' },
      { status: 500 }
    );
  }
}
