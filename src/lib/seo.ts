// ---------------------------------------------------------------------------
// JSON-LD helpers for structured data
// ---------------------------------------------------------------------------

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export function jobPostingJsonLd(job: {
  id: string;
  title: string;
  description: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobType?: string;
  workModel?: string;
  experienceLevel?: string;
  city?: string | null;
  state?: string | null;
  company: { name: string; url?: string };
  datePosted?: string;
  validThrough?: string | null;
  isFeatured?: boolean;
}) {
  const salaryRange = job.salaryMin || job.salaryMax
    ? {
        '@type': 'MonetaryAmount' as const,
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue' as const,
          minValue: job.salaryMin ?? undefined,
          maxValue: job.salaryMax ?? undefined,
          unitText: 'YEAR' as const,
        },
      }
    : undefined;

  const jobLocation = job.city || job.state
    ? {
        '@type': 'Place' as const,
        address: {
          '@type': 'PostalAddress' as const,
          addressLocality: job.city || undefined,
          addressRegion: job.state || undefined,
          addressCountry: 'US',
        },
      }
    : {
        '@type': 'Place' as const,
        address: {
          '@type': 'PostalAddress' as const,
          addressCountry: 'US',
        },
      };

  return {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted || new Date().toISOString(),
    validThrough: job.validThrough
      ? new Date(job.validThrough).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      url: job.company.url || APP_URL,
    },
    jobLocation,
    employmentType: mapJobTypeToSchema(job.jobType || 'FULL_TIME'),
    applicantLocationRequirements: mapWorkModelToSchema(job.workModel),
    baseSalary: salaryRange,
    experienceRequirements: job.experienceLevel
      ? {
          '@type': 'OccupationalExperienceRequirements' as const,
          monthsOfExperience: mapExperienceToMonths(job.experienceLevel),
        }
      : undefined,
    directApply: true,
  };
}

function mapJobTypeToSchema(type: string): string {
  const mapping: Record<string, string> = {
    FULL_TIME: 'FULL_TIME',
    PART_TIME: 'PART_TIME',
    CONTRACT: 'CONTRACTOR',
    INTERNSHIP: 'INTERN',
    FREELANCE: 'CONTRACTOR',
  };
  return mapping[type] || 'FULL_TIME';
}

function mapWorkModelToSchema(model?: string): string {
  if (model === 'REMOTE') return 'TELECOMMUTE';
  return undefined as any;
}

function mapExperienceToMonths(level: string): number {
  const mapping: Record<string, number> = {
    ENTRY: 0,
    MID: 24,
    SENIOR: 60,
    LEAD: 84,
    EXECUTIVE: 120,
  };
  return mapping[level] ?? 0;
}

export function organizationJsonLd(org: {
  name: string;
  description?: string | null;
  url?: string;
  logo?: string | null;
  address?: { city?: string | null; state?: string | null };
}) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: org.name,
    description: org.description || undefined,
    url: org.url || APP_URL,
    logo: org.logo ? `${APP_URL}${org.logo}` : undefined,
    address: org.address?.city || org.address?.state
      ? {
          '@type': 'PostalAddress',
          addressLocality: org.address.city || undefined,
          addressRegion: org.address.state || undefined,
          addressCountry: 'US',
        }
      : undefined,
  };
}

// Helper to render JSON-LD in a component
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return null; // Will be used in server components via generateMetadata
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
