import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth } from '@/lib/api';
import { updateJobSchema } from '@/lib/validations';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      company: {
        include: {
          reviews: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: { profile: { select: { firstName: true, lastName: true } } },
              },
            },
          },
        },
      },
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    return apiError('Job not found', 404);
  }

  // Increment views
  await prisma.job.update({
    where: { id: params.id },
    data: { viewsCount: { increment: 1 } },
  });

  // Check if user has applied
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

  return apiSuccess({
    ...job,
    hasApplied,
    isSaved,
    applicationsCount: job._count.applications,
  });
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

  if (!job) return apiError('Job not found', 404);

  if (job.company.ownerId !== user!.id && user!.role !== 'ADMIN') {
    return apiError('Not authorized to update this job', 403);
  }

  const body = await req.json();
  const validation = updateJobSchema.safeParse(body);
  if (!validation.success) {
    return apiError(validation.error.errors.map((e) => e.message).join(', '), 400);
  }

  const updated = await prisma.job.update({
    where: { id: params.id },
    data: {
      ...validation.data,
      expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : undefined,
    },
  });

  return apiSuccess(updated);
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

  if (!job) return apiError('Job not found', 404);

  if (job.company.ownerId !== user!.id && user!.role !== 'ADMIN') {
    return apiError('Not authorized to delete this job', 403);
  }

  await prisma.job.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return apiSuccess({ message: 'Job deactivated' });
}
