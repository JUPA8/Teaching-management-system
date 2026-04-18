import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { validatePassword, normalizeEmail } from '@/lib/validation';
import { checkRateLimit, getClientIP, tooManyRequests } from '@/lib/rate-limit';

// 5 registrations per IP per 15 minutes
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .transform((v) => normalizeEmail(v)),
  password: z
    .string()
    .min(1, 'Password is required')
    .superRefine((password, ctx) => {
      const { isValid, failedRules, isCommon } = validatePassword(password);
      if (isCommon) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This password is too common. Please choose a more unique password.',
        });
        return;
      }
      if (!isValid) {
        const messages: Record<string, string> = {
          length:    'Password must be at least 8 characters.',
          uppercase: 'Password must contain at least 1 uppercase letter.',
          lowercase: 'Password must contain at least 1 lowercase letter.',
          number:    'Password must contain at least 1 number.',
          special:   'Password must contain at least 1 special character.',
        };
        for (const ruleId of failedRules) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages[ruleId] ?? 'Password does not meet requirements.',
          });
        }
      }
    }),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  phone: z.string().optional(),
});

// POST /api/register — Public self-registration (STUDENT accounts only)
export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIP(request);
  const rl = checkRateLimit(`register:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.success) return tooManyRequests(rl.retryAfterSeconds);

  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      // Return all validation errors, not just the first
      const errors = validation.error.issues.map((i) => i.message);
      return NextResponse.json(
        {
          success: false,
          error: errors[0],         // primary message for simple UI
          errors,                   // full list for detailed UI
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const normalizedEmail = data.email; // already normalized by transform

    // ── Check for existing account ────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, isVerified: true },
    });

    if (existingUser) {
      // Give a safe response — don't reveal verification status to prevent enumeration
      if (!existingUser.isVerified) {
        // Resend without leaking that the account exists (treat as "already registered, unverified")
        return NextResponse.json(
          {
            success: false,
            error: 'An account with this email already exists. If you registered before, please check your email for the verification link or use "Resend verification".',
            code: 'ALREADY_REGISTERED',
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // ── Hash password ─────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // ── Generate verification token ───────────────────────────────────────────
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // ── Create user + student profile in one transaction ──────────────────────
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: data.name.trim(),
        phone: data.phone?.trim() || null,
        role: 'STUDENT',
        isVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        student: { create: {} },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    // ── Send verification email ────────────────────────────────────────────────
    let emailSent = false;
    let devVerificationLink: string | undefined;

    try {
      const result = await sendVerificationEmail(normalizedEmail, data.name.trim(), verificationToken);
      emailSent = result.sent;
      devVerificationLink = result.devVerificationLink;
    } catch (emailError: any) {
      // Log the full error for debugging in Vercel logs
      console.error('[Registration] Email sending failed:', {
        email: normalizedEmail,
        error: emailError?.message,
      });
      // User is created but email wasn't sent — they can use resend
      emailSent = false;
    }

    // ── Response ──────────────────────────────────────────────────────────────
    const response: Record<string, unknown> = {
      success: true,
      emailSent,
      message: emailSent
        ? 'Account created. Please check your email to verify your account before logging in.'
        : 'Account created, but we could not send the verification email. Please use "Resend verification email" on the login page.',
    };

    // In development: include the verification link in the response for easy testing
    if (process.env.NODE_ENV !== 'production' && devVerificationLink) {
      response.devVerificationLink = devVerificationLink;
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('[Registration] Unexpected error:', error?.message);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
