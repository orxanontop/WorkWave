import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, getPagination, paginationMeta } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const userId = user!.id as string;

  const [saved, total] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId },
      include: { job: { include: { company: { select: { id: true, name: true, logo: true, city: true, state: true } } } } },
      orderBy: { createdAt: 'desc' },
      skip, take: perPage,
    }),
    prisma.savedJob.count({ where: { userId } }),
  ]);

  return apiResponse({ savedJobs: saved, pagination: paginationMeta(total, page, perPage) });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const { jobId } = body;

  if (!jobId) return apiError('jobId is required', 400, 'VALIDATION_ERROR');

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return apiError('Job not found', 404, 'NOT_FOUND');

  const userId = user!.id as string;
  const existing = await prisma.savedJob.findUnique({ where: { userId_jobId: { userId, jobId } } });

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
    logger.info({ userId, jobId }, 'Job unsaved');
    return apiResponse({ saved: false });
  }

  await prisma.savedJob.create({ data: { userId, jobId } });
  logger.info({ userId, jobId }, 'Job saved');
  return apiResponse({ saved: true }, 201);
}
