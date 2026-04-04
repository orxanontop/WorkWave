import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, getPagination, paginationMeta } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const status = req.nextUrl.searchParams.get('status');

  const where: Record<string, unknown> = {};
  if (user!.role === 'JOB_SEEKER') {
    where.userId = user!.id;
    if (status) where.status = status;
  } else if (['EMPLOYER', 'RECRUITER', 'ADMIN'].includes(user!.role as string)) {
    const company = await prisma.company.findFirst({
      where: { ownerId: user!.id as string },
      select: { id: true },
    });
    if (company) where.job = { companyId: company.id };
    if (status) where.status = status;
  }

  const orderBy: Record<string, unknown>[] = [];
  if (['EMPLOYER', 'RECRUITER'].includes(user!.role as string)) orderBy.push({ isPriority: 'desc' });
  orderBy.push({ createdAt: 'desc' });

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: { select: { id: true, title: true, slug: true, city: true, state: true, salaryMin: true, salaryMax: true, jobType: true, company: { select: { id: true, name: true, logo: true } } } },
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true, headline: true, skills: true, experienceYears: true, resumeUrl: true } } } },
      },
      orderBy, skip, take: perPage,
    }),
    prisma.application.count({ where }),
  ]);

  return apiResponse({ applications, pagination: paginationMeta(total, page, perPage) });
}
