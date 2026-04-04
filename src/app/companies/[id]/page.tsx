import { Metadata, ResolvingMetadata } from 'next';
import prisma from '@/lib/prisma';
import { organizationJsonLd } from '@/lib/seo';
import CompanyDetailClient from './CompanyDetailClient';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

type Props = {
  params: { id: string };
};

// ---------------------------------------------------------------------------
// Dynamic metadata — unique title/description/OG/JSON-LD per company
// ---------------------------------------------------------------------------
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, description: true, city: true, state: true, industry: true },
  });

  if (!company) {
    return { title: 'Company Not Found', robots: { index: false } };
  }

  const plainDesc = company.description
    ? company.description.replace(/<[^>]*>/g, '').slice(0, 155)
    : `${company.name} — ${company.industry || 'Company'}${company.city ? ` in ${company.city}` : ''}`;
  const description = plainDesc.length >= 155 ? plainDesc + '...' : plainDesc;
  const url = `${APP_URL}/companies/${company.id}`;

  const jsonLd = organizationJsonLd({
    name: company.name,
    description: company.description || undefined,
    url,
    address: { city: company.city, state: company.state },
  });

  return {
    title: `${company.name} — Company Profile`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: company.name,
      description,
      type: 'profile',
      url,
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default function CompanyDetailPage({ params }: Props) {
  return <CompanyDetailClient id={params.id} />;
}
