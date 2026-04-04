import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireRole, getPagination, paginationMeta } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const search = req.nextUrl.searchParams.get('search');
  const isActive = req.nextUrl.searchParams.get('active');

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (isActive !== null && isActive !== undefined) where.isActive = isActive === 'true';

  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, logo: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip, take: perPage,
      }),
      prisma.job.count({ where }),
    ]);

    return apiResponse({ jobs, pagination: paginationMeta(total, page, perPage) });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch admin jobs');
    return apiError('Failed to fetch jobs', 500, 'INTERNAL_ERROR');
  }
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const body = await req.json();
  const { jobId, isActive, isFeatured } = body;

  if (!jobId) return apiError('jobId is required', 400, 'VALIDATION_ERROR');

  try {
    const updateData: Record<string, unknown> = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof isFeatured === 'boolean') {
      updateData.isFeatured = isFeatured;
      if (isFeatured) updateData.featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const job = await prisma.job.update({ where: { id: jobId }, data: updateData });
    logger.info({ jobId, ...updateData }, 'Admin updated job');
    return apiResponse({ id: job.id, isActive: job.isActive, isFeatured: job.isFeatured });
  } catch (err) {
    logger.error({ err, jobId }, 'Failed to update job');
    return apiError('Failed to update job', 500, 'INTERNAL_ERROR');
  }
}
