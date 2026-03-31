import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth } from '@/lib/api';
import { stripe, PLANS, createCheckoutSession, createPortalSession } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user!.id as string },
    orderBy: { createdAt: 'desc' },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: user!.id as string },
    select: {
      subscriptionStatus: true,
      subscriptionExpiry: true,
      stripeCustomerId: true,
    },
  });

  return apiSuccess({
    subscriptions,
    currentPlan: currentUser,
    plans: PLANS,
  });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const { action, planId } = body;

  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  if (action === 'checkout') {
    if (!planId || !['premium', 'employer_basic', 'employer_pro'].includes(planId)) {
      return apiError('Invalid plan', 400);
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan || !('priceId' in plan) || !plan.priceId) {
      return apiError('Plan not configured', 400);
    }

    let customerId = user!.stripeCustomerId as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user!.email as string,
        metadata: { userId: user!.id as string },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user!.id as string },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await createCheckoutSession(
      customerId,
      plan.priceId,
      `${appUrl}/dashboard?subscription=success`,
      `${appUrl}/pricing?subscription=cancelled`
    );

    return apiSuccess({ checkoutUrl: session.url });
  }

  if (action === 'portal') {
    const userRecord = await prisma.user.findUnique({
      where: { id: user!.id as string },
      select: { stripeCustomerId: true },
    });

    if (!userRecord?.stripeCustomerId) {
      return apiError('No subscription found', 400);
    }

    const portal = await createPortalSession(
      userRecord.stripeCustomerId,
      `${appUrl}/dashboard`
    );

    return apiSuccess({ portalUrl: portal.url });
  }

  return apiError('Invalid action', 400);
}
