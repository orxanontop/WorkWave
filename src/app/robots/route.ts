import { NextResponse } from 'next/server';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function GET() {
  const robots = `
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/

Sitemap: ${APP_URL}/sitemap.xml
`.trim();

  return new NextResponse(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
