import type { Metadata } from 'next';
import CompaniesClient from './CompaniesClient';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Companies — Discover Top Employers',
  description: 'Browse companies hiring on WorkWave. Read reviews, explore open positions, and find your ideal workplace.',
  alternates: { canonical: `${APP_URL}/companies` },
  openGraph: {
    title: 'Companies — WorkWave',
    description: 'Browse companies hiring on WorkWave.',
    url: `${APP_URL}/companies`,
    type: 'website',
  },
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
