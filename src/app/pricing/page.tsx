import type { Metadata } from 'next';
import PricingClient from './PricingClient';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Pricing — Free & Premium Plans',
  description: 'Browse thousands of jobs with free access or upgrade to premium for unlimited applications and exclusive job postings.',
  alternates: { canonical: `${APP_URL}/pricing` },
  openGraph: {
    title: 'Pricing — WorkWave',
    description: 'Free and premium plans for job seekers and employers.',
    type: 'website',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
