import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple SVG-based OG image for jobs
// Falls back to default if job not found
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: { select: { name: true } } },
  });

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0ea5e9"/>
          <stop offset="50%" style="stop-color:#6366f1"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect x="60" y="60" width="1080" height="510" rx="24" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>

      <!-- WorkWave branding -->
      <text x="60" y="130" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.7)">WorkWave</text>

      <!-- Job title -->
      <text x="60" y="220" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="white" fill-opacity="0.95">
        ${escapeXml(job.title, 40)}
      </text>

      <!-- Company name -->
      <text x="60" y="300" font-family="Arial,sans-serif" font-size="32" fill="rgba(255,255,255,0.8)">
        ${escapeXml(job.company.name)}
      </text>

      <!-- Location -->
      ${job.city ? `
      <text x="60" y="360" font-family="Arial,sans-serif" font-size="24" fill="rgba(255,255,255,0.6)">
        ${job.city}${job.state ? `, ${job.state}` : ''}
      </text>` : ''}

      <!-- Job type badges -->
      ${job.jobType ? `
      <rect x="60" y="410" width="${badgeWidth(job.jobType)}" height="36" rx="18" fill="rgba(255,255,255,0.15)"/>
      <text x="${60 + badgeWidth(job.jobType)/2}" y="434" font-family="Arial,sans-serif" font-size="16" fill="white" text-anchor="middle">
        ${badgeLabel(job.jobType)}
      </text>` : ''}
      ${job.workModel ? `
      <rect x="${100 + badgeWidth(job.jobType || '')}" y="410" width="${badgeWidth(job.workModel)}" height="36" rx="18" fill="rgba(255,255,255,0.15)"/>
      <text x="${100 + badgeWidth(job.jobType || '') + badgeWidth(job.workModel)/2}" y="434" font-family="Arial,sans-serif" font-size="16" fill="white" text-anchor="middle">
        ${job.workModel}
      </text>` : ''}

      ${
        job.salaryMin || job.salaryMax
          ? `<text x="60" y="490" font-family="Arial,sans-serif" font-size="28" fill="#34d399" font-weight="bold">
        $${job.salaryMin?.toLocaleString()} - $${job.salaryMax?.toLocaleString()} / year
      </text>`
          : ''
      }

      <text x="60" y="555" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.5)">
        Apply now on WorkWave
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

function badgeLabel(type: string): string {
  const labels: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    FREELANCE: 'Freelance',
  };
  return labels[type] || type;
}

function badgeWidth(text: string): number {
  return Math.max(80, badgeLabel(text).length * 12 + 40);
}

function escapeXml(str: string, maxLen?: number): string {
  const s = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return maxLen && s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
}
