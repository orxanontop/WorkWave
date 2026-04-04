import type { Metadata } from 'next';
import HomePage from './HomePage';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'WorkWave — Find Your Next Opportunity, Locally',
  description: 'Hyper-local job marketplace connecting job seekers with local employers. Browse 10,000+ jobs, apply instantly, and get hired faster.',
  alternates: { canonical: APP_URL },
};

export default function Home() {
  return <HomePage />;
}
