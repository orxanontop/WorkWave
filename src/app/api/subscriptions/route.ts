import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth } from '@/lib/api';
import { stripe, PLANS, createCheckoutSession, createPortalSession } from '@/lib/stripe';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  try {
    const [subscriptions, currentUser] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId: user!.id as string },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findUnique({
        where: { id: user!.id as string },
        select: {
          subscriptionStatus: true,
          subscriptionExpiry: true,
          stripeCustomerId: true,
        },
      }),
    ]);

    return apiResponse({
      subscriptions,
      currentPlan: currentUser,
      plans: PLANS,
    });
  } catch (err) {
    logger.error({ err, userId: user!.id }, 'Failed to fetch subscriptions');
    return apiError('Failed to fetch subscriptions', 500, 'INTERNAL_ERROR');
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const { action, planId } = body;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  if (action === 'checkout') {
    if (!planId || !['premium', 'employer_basic', 'employer_pro'].includes(planId)) {
      return apiError('Invalid plan', 400, 'INVALID_PLAN');
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan || !('priceId' in plan) || !plan.priceId) {
      return apiError('Plan not configured', 400, 'PLAN_NOT_CONFIGURED');
    }

    try {
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

      logger.info({ userId: user!.id, planId }, 'Checkout session created');
      return apiResponse({ checkoutUrl: session.url });
    } catch (err) {
      logger.error({ err, userId: user!.id, planId }, 'Failed to create checkout session');
      return apiError('Failed to create checkout session', 500, 'INTERNAL_ERROR');
    }
  }

  if (action === 'portal') {
    try {
      const userRecord = await prisma.user.findUnique({
        where: { id: user!.id as string },
        select: { stripeCustomerId: true },
      });

      if (!userRecord?.stripeCustomerId) {
        return apiError('No subscription found', 400, 'NO_SUBSCRIPTION');
      }

      const portal = await createPortalSession(
        userRecord.stripeCustomerId,
        `${appUrl}/dashboard`
      );

      return apiResponse({ portalUrl: portal.url });
    } catch (err) {
      logger.error({ err, userId: user!.id }, 'Failed to create portal session');
      return apiError('Failed to create portal session', 500, 'INTERNAL_ERROR');
    }
  }

  return apiError('Invalid action', 400, 'INVALID_ACTION');
}