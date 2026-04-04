import type { Metadata, ResolvingMetadata } from 'next';
import prisma from '@/lib/prisma';
import { jobPostingJsonLd } from '@/lib/seo';
import JobDetailClient from './JobDetailClient';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

type Props = {
  params: { id: string };
};

// ---------------------------------------------------------------------------
// Dynamic metadata — generates unique title/description/OG/JSON-LD per job
// ---------------------------------------------------------------------------
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      company: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!job) {
    return {
      title: 'Job Not Found',
      robots: { index: false, follow: false },
    };
  }

  const location = [job.city, job.state].filter(Boolean).join(', ');
  const title = `${job.title}${location ? ` in ${location}` : ''} at ${job.company.name}`;

  // Strip HTML for the meta description, truncate to 155 chars
  const plainDesc = job.description.replace(/<[^>]*>/g, '').slice(0, 155).trim();
  const description = plainDesc.length >= 155 ? plainDesc + '...' : plainDesc;

  const url = `${APP_URL}/jobs/${job.id}`;

  // JSON-LD JobPosting structured data
  const jsonLd = jobPostingJsonLd({
    id: job.id,
    title: job.title,
    description: plainDesc,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    jobType: job.jobType || 'FULL_TIME',
    workModel: job.workModel || undefined,
    experienceLevel: job.experienceLevel || undefined,
    city: job.city,
    state: job.state,
    company: {
      name: job.company.name,
      url: `${APP_URL}/companies/${job.company.id}`,
    },
    datePosted: job.publishedAt?.toISOString() || job.createdAt.toISOString(),
    validThrough: job.expiresAt?.toISOString() || undefined,
  });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${job.title} at ${job.company.name}`,
      description,
      type: 'article',
      url,
      images: [
        {
          url: `${APP_URL}/api/og/job?id=${job.id}`,
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company.name}`,
        },
      ],
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}

// ---------------------------------------------------------------------------
// Server component — delegates to client component for interactivity
// ---------------------------------------------------------------------------
export default function JobDetailPage({ params }: Props) {
  return <JobDetailClient id={params.id} />;
}
