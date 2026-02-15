import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
// This allows the app to build even without Stripe configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  : null;

// Helper to check if Stripe is configured
export const isStripeConfigured = () => !!stripeSecretKey;
