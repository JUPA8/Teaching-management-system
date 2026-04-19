import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, tooManyRequests, getClientIP } from '@/lib/rate-limit';

const schema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
});

// POST /api/auth/reset-password
// Validates token, updates password, marks token as used.
export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIP(request);
  const rl = checkRateLimit(`reset-password:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.success) {
    return tooManyRequests(rl.retryAfterSeconds!);
  }

  try {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message ?? 'Validation failed' },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Look up the token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    if (resetToken.used) {
      return NextResponse.json(
        { success: false, error: 'This reset link has already been used. Please request a new one.' },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the user still exists
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Account not found.' },
        { status: 404 }
      );
    }

    // Hash new password and update user, atomically mark token used
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
      }),
      // Invalidate all other outstanding tokens for this email
      prisma.passwordResetToken.updateMany({
        where: { email: resetToken.email, used: false },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset. You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('[reset-password] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
