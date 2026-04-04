import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    logger.error({ err, signature: sig }, 'Stripe webhook signature verification failed');
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  logger.info({ eventType: event.type, eventId: event.id }, 'Stripe webhook received');

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'ACTIVE',
              stripeSubscriptionId: subscription.id,
              subscriptionExpiry: new Date(subscription.current_period_end * 1000),
            },
          });

          await prisma.subscription.create({
            data: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCustomerId: customerId,
              plan: subscription.items.data[0].price.nickname || 'premium',
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
          logger.info({ userId: user.id, subscriptionId: subscription.id }, 'Subscription activated via checkout');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
              subscriptionExpiry: new Date(subscription.current_period_end * 1000),
            },
          });

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          });
          logger.info({ userId: user.id, status: subscription.status }, 'Subscription updated');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'cancelled', cancelledAt: new Date() },
        });

        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (sub) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { subscriptionStatus: 'CANCELLED' },
          });
          logger.info({ userId: sub.userId }, 'Subscription cancelled');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: 'PAST_DUE' },
          });
          logger.warn({ userId: user.id, invoiceId: invoice.id }, 'Stripe payment failed');
        }
        break;
      }

      default:
        logger.debug({ eventType: event.type, eventId: event.id }, 'Unhandled Stripe event type, ignoring');
    }
  } catch (err) {
    logger.error({ err, eventType: event.type, eventId: event.id }, 'Stripe webhook handler failed');
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
