import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireRole, getPagination } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const { page, limit, skip } = getPagination(req.nextUrl.searchParams);
  const search = req.nextUrl.searchParams.get('search');
  const isActive = req.nextUrl.searchParams.get('active');

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (isActive !== null) where.isActive = isActive === 'true';

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        company: { select: { id: true, name: true, logo: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return apiSuccess({
    jobs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const body = await req.json();
  const { jobId, isActive, isFeatured } = body;

  if (!jobId) return apiError('jobId is required', 400);

  const updateData: any = {};
  if (typeof isActive === 'boolean') updateData.isActive = isActive;
  if (typeof isFeatured === 'boolean') {
    updateData.isFeatured = isFeatured;
    if (isFeatured) {
      updateData.featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  const job = await prisma.job.update({
    where: { id: jobId },
    data: updateData,
  });

  return apiSuccess({ id: job.id, isActive: job.isActive, isFeatured: job.isFeatured });
}
