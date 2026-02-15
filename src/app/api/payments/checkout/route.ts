import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

const createCheckoutSchema = z.object({
  courseId: z.string().cuid(),
  studentId: z.string().cuid(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// POST /api/payments/checkout - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validation = createCheckoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

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

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: {
        user: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        studentId: data.studentId,
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = data.successUrl || `${baseUrl}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = data.cancelUrl || `${baseUrl}/courses/${course.id}`;

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
        studentId: data.studentId,
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
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
