import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { requireAnyRole } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const createCheckoutSchema = z.object({
  courseId: z.string().cuid(),
  // studentId is accepted but only trusted when caller is ADMIN
  studentId: z.string().cuid().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// POST /api/payments/checkout - Create Stripe checkout session
// STUDENT: always pays for themselves — studentId from body is ignored
// ADMIN: can create checkout for any student by providing studentId
// TEACHER: forbidden
export async function POST(request: NextRequest) {
  try {
    const user = await requireAnyRole([UserRole.STUDENT, UserRole.ADMIN]);

    const body = await request.json();
    const validation = createCheckoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Payment processing is not configured' },
        { status: 503 }
      );
    }

    const data = validation.data;

    // ── Resolve and verify student identity ───────────────────────────────────
    let student: { id: string; user: { email: string; name: string | null } } | null = null;

    if (user.role === UserRole.STUDENT) {
      // Always derive from session — never trust body for STUDENT
      student = await prisma.student.findUnique({
        where: { userId: user.id },
        include: { user: { select: { email: true, name: true } } },
      });
      if (!student) {
        return NextResponse.json(
          { success: false, error: 'Student profile not found' },
          { status: 404 }
        );
      }
      // Reject if body explicitly provides a different studentId
      if (data.studentId && data.studentId !== student.id) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: cannot initiate payment on behalf of another student' },
          { status: 403 }
        );
      }
    } else {
      // ADMIN: requires explicit studentId in body
      if (!data.studentId) {
        return NextResponse.json(
          { success: false, error: 'studentId is required for admin checkout' },
          { status: 400 }
        );
      }
      student = await prisma.student.findUnique({
        where: { id: data.studentId },
        include: { user: { select: { email: true, name: true } } },
      });
      if (!student) {
        return NextResponse.json(
          { success: false, error: 'Student not found' },
          { status: 404 }
        );
      }
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    if (!course.isActive) {
      return NextResponse.json(
        { success: false, error: 'Course is not available' },
        { status: 400 }
      );
    }

    // Create payment record — use resolved student.id (never raw body value)
    const payment = await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: course.price,
        currency: 'EUR',
        status: 'PENDING',
        description: `Payment for ${course.name} course`,
        metadata: {
          courseId: course.id,
          courseName: course.name,
        },
      },
    });

    // Create Stripe Checkout Session
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    // Validate custom URLs against our own origin to prevent open redirect
    const validateUrl = (url: string | undefined, fallback: string): string => {
      if (!url) return fallback;
      try {
        const parsed = new URL(url);
        const base = new URL(baseUrl);
        if (parsed.origin !== base.origin) return fallback;
        return url;
      } catch {
        return fallback;
      }
    };

    const successUrl = validateUrl(
      data.successUrl,
      `${baseUrl}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`
    );
    const cancelUrl = validateUrl(data.cancelUrl, `${baseUrl}/courses/${course.id}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: student.user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.name,
              description: course.description,
              images: course.image ? [course.image] : undefined,
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        paymentId: payment.id,
        studentId: student.id,
        courseId: data.courseId,
        userId: user.id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Update payment with Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        paymentId: payment.id,
      },
      message: 'Checkout session created successfully',
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    const status = error.message?.includes('Unauthorized') ? 401
                 : error.message?.includes('One of') ? 403
                 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status }
    );
  }
}
