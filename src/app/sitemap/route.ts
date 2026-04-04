import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function GET() {
  const url = (path: string) => `${APP_URL}${path}`;

  // Static pages
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url('/')}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${url('/jobs')}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${url('/companies')}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${url('/pricing')}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;

  // Dynamic job pages (last 500 active jobs)
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: { id: true, updatedAt: true },
    });

    for (const job of jobs) {
      xml += `  <url>
    <loc>${url(`/jobs/${job.id}`)}</loc>
    <lastmod>${new Date(job.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  } catch {
    // Skip dynamic job URLs if DB unavailable
  }

  // Dynamic company pages
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
      take: 200,
      select: { id: true, updatedAt: true },
    });

    for (const company of companies) {
      xml += `  <url>
    <loc>${url(`/companies/${company.id}`)}</loc>
    <lastmod>${new Date(company.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
  } catch {
    // Skip dynamic company URLs if DB unavailable
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
