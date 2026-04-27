import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimitAsync, tooManyRequests, getClientIP } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email(),
});

// POST /api/auth/forgot-password
// Accepts an email, generates a reset token, sends the email.
// Always returns 200 even when the email doesn't exist — prevents user enumeration.
export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per IP per 15 minutes
  const ip = getClientIP(request);
  const rl = await checkRateLimitAsync(`forgot-password:${ip}`, 3, 15 * 60 * 1000);
  if (!rl.success) {
    return tooManyRequests(rl.retryAfterSeconds!);
  }

  try {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const email = validation.data.email.toLowerCase().trim();

    // Look up user — but don't leak whether the email exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      // Invalidate any existing unused tokens for this email
      await prisma.passwordResetToken.updateMany({
        where: { email, used: false },
        data: { used: true },
      });

      // Generate a cryptographically secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: { email, token, expires },
      });

      // Fire and forget — don't let email errors block the response
      sendPasswordResetEmail(email, user.name ?? email, token).catch((err) => {
        console.error('[forgot-password] Failed to send reset email:', err.message);
      });
    }

    // Always return the same response to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error: any) {
    console.error('[forgot-password] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
