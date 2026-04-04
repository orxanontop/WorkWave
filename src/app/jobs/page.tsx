import type { Metadata } from 'next';
import { Suspense } from 'react';
import JobsClient from './JobsClient';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Browse Jobs — Find Your Next Opportunity',
  description: 'Search thousands of local and remote jobs. Filter by location, salary, job type, and experience level on WorkWave.',
  alternates: { canonical: `${APP_URL}/jobs` },
  openGraph: { title: 'Browse Jobs — WorkWave', description: 'Search thousands of local and remote jobs.', url: `${APP_URL}/jobs`, type: 'website' },
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="container-app py-8"><div className="skeleton h-10 w-64 mb-4"/><div className="skeleton h-32 w-full"/></div>}>
      <JobsClient />
    </Suspense>
  );
}
