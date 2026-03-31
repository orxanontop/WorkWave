import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    applications: 5,
    features: [
      'Browse local job listings',
      'Basic profile',
      '5 applications per month',
      'View company profiles',
    ],
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    applications: -1, // unlimited
    features: [
      'Unlimited applications',
      'Priority ranking',
      'Advanced filters',
      'Application tracking',
      'AI resume suggestions',
      'Direct messaging',
      'Exclusive job listings',
    ],
  },
  employer_basic: {
    name: 'Employer Basic',
    price: 49.99,
    priceId: process.env.STRIPE_EMPLOYER_POSTING_PRICE_ID,
    features: [
      'Post up to 5 jobs/month',
      'Basic candidate search',
      'Company profile',
      'Email support',
    ],
  },
  employer_pro: {
    name: 'Employer Pro',
    price: 149.99,
    features: [
      'Unlimited job posts',
      'Featured listings',
      'Full candidate database',
      'Priority support',
      'Analytics dashboard',
    ],
  },
} as const;

export async function createStripeCustomer(email: string, name?: string) {
  return stripe.customers.create({ email, name });
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}
