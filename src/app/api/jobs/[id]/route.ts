import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, rateLimit } from '@/lib/api';
import { updateJobSchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = await rateLimit(req, 100);
  if (!rl.allowed) return rl.response!;

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      company: {
        include: {
          reviews: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { profile: { select: { firstName: true, lastName: true } } } } },
          },
        },
      },
      _count: { select: { applications: true } },
    },
  });

  if (!job) return apiError('Job not found', 404, 'NOT_FOUND');

  prisma.job
    .update({ where: { id: params.id }, data: { viewsCount: { increment: 1 } } })
    .catch((err) => logger.error({ err, jobId: params.id }, 'Failed to increment job views'));

  let hasApplied = false;
  let isSaved = false;
  const { user } = await requireAuth(req);
  if (user) {
    const [application, saved] = await Promise.all([
      prisma.application.findUnique({
        where: { userId_jobId: { userId: user.id as string, jobId: params.id } },
      }),
      prisma.savedJob.findUnique({
        where: { userId_jobId: { userId: user.id as string, jobId: params.id } },
      }),
    ]);
    hasApplied = !!application;
    isSaved = !!saved;
  }

  return apiResponse({ ...job, hasApplied, isSaved, applicationsCount: job._count.applications });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { company: { select: { ownerId: true } } },
  });

  if (!job) return apiError('Job not found', 404, 'NOT_FOUND');
  if (job.company.ownerId !== user!.id && user!.role !== 'ADMIN') {
    return apiError('Not authorized to update this job', 403, 'FORBIDDEN');
  }

  const body = await req.json();
  const validation = updateJobSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const updateData: Record<string, unknown> = { ...validation.data };
  if (updateData.description) updateData.description = sanitizeHtml(updateData.description as string);

  try {
    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...updateData,
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt as string) : undefined,
      },
    });
    logger.info({ jobId: params.id, userId: user!.id }, 'Job updated');
    return apiResponse(updated);
  } catch (err) {
    logger.error({ err, jobId: params.id }, 'Failed to update job');
    return apiError('Failed to update job', 500, 'INTERNAL_ERROR');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { company: { select: { ownerId: true } } },
  });

  if (!job) return apiError('Job not found', 404, 'NOT_FOUND');
  if (job.company.ownerId !== user!.id && user!.role !== 'ADMIN') {
    return apiError('Not authorized to delete this job', 403, 'FORBIDDEN');
  }

  try {
    await prisma.job.update({ where: { id: params.id }, data: { isActive: false } });
    logger.info({ jobId: params.id, userId: user!.id }, 'Job deactivated');
    return apiResponse({ message: 'Job deactivated' });
  } catch (err) {
    logger.error({ err, jobId: params.id }, 'Failed to deactivate job');
    return apiError('Failed to deactivate job', 500, 'INTERNAL_ERROR');
  }
}
