import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth, getPagination } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const { page, limit, skip } = getPagination(req.nextUrl.searchParams);
  const status = req.nextUrl.searchParams.get('status');

  const where: any = {};
  const params = req.nextUrl.searchParams;
  const view = params.get('view');

  if (user!.role === 'JOB_SEEKER') {
    where.userId = user!.id;
    if (status) where.status = status;
  } else if (['EMPLOYER', 'RECRUITER', 'ADMIN'].includes(user!.role as string)) {
    // Employer sees applications for their jobs
    const company = await prisma.company.findFirst({
      where: { ownerId: user!.id as string },
      select: { id: true },
    });
    if (company) {
      where.job = { companyId: company.id };
    }
    if (status) where.status = status;
  }

  const orderBy: any[] = [];
  // Premium users get priority ranking for employers
  if (['EMPLOYER', 'RECRUITER'].includes(user!.role as string)) {
    orderBy.push({ isPriority: 'desc' });
  }
  orderBy.push({ createdAt: 'desc' });

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            state: true,
            salaryMin: true,
            salaryMax: true,
            jobType: true,
            company: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                headline: true,
                skills: true,
                experienceYears: true,
                resumeUrl: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return apiSuccess({
    applications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
