import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// POST /api/payments/webhook - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const paymentId = session.metadata?.paymentId;
  const studentId = session.metadata?.studentId;
  const courseId = session.metadata?.courseId;

  if (!paymentId) {
    console.error('No paymentId in checkout session metadata');
    return;
  }

  try {
    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent as string,
      },
    });

    // Enroll student in course if not already enrolled
    if (studentId && courseId) {
      await prisma.courseEnrollment.upsert({
        where: {
          courseId_studentId: {
            courseId,
            studentId,
          },
        },
        create: {
          courseId,
          studentId,
          isActive: true,
        },
        update: {
          isActive: true,
        },
      });
    }

    // TODO: Send confirmation email to student
    console.log('Payment completed successfully:', paymentId);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });
    }

    console.log('PaymentIntent succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
        },
      });
    }

    console.log('PaymentIntent failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

// Handle refunded charge
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
        },
      });
    }

    console.log('Charge refunded:', charge.id);
  } catch (error) {
    console.error('Error handling charge refunded:', error);
  }
}
