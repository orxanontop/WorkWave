'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SUBSCRIPTION_PLANS, APP_NAME } from '@/lib/constants';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planKey: string) => {
    if (!session) { router.push('/auth/register'); return; }
    if (planKey === 'free') { router.push('/jobs'); return; }

    setIsLoading(true);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout', planId: planKey }),
      });
      const data = await res.json();
      if (res.ok && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        toast.error(data.error || 'Failed to start checkout');
      }
    } catch (err) { toast.error('Something went wrong'); }
    finally { setIsLoading(false); }
  };

  const isPremium = (session?.user as any)?.subscriptionStatus === 'ACTIVE';

  return (
    <div className="container-app py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-500">Start free, upgrade when you are ready. No hidden fees, cancel anytime.</p>
        {isPremium && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            You are on the Premium plan
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
          <div key={key} className={`card p-8 relative ${'popular' in plan ? 'border-primary-500 border-2 shadow-xl scale-[1.02]' : ''}`}>
            {'popular' in plan && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                {'period' in plan && plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(key)}
              disabled={isLoading || (key === 'free' && isPremium)}
              className={`btn w-full btn-lg ${'popular' in plan ? 'btn-primary' : 'btn-secondary'}`}
            >
              {key === 'free' ? 'Get Started Free' : isPremium ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription at any time. You will continue to have access until the end of your billing period.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through Stripe, our secure payment processor.' },
            { q: 'Is there a free trial?', a: 'The free plan lets you browse all jobs and apply to up to 5 jobs per month. No credit card required.' },
            { q: 'How does priority ranking work?', a: 'Premium applications are highlighted and sorted to the top of the employer dashboard, giving you 3x more visibility.' },
          ].map(({ q, a }) => (
            <div key={q} className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
