import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth, getPagination } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const { page, limit, skip } = getPagination(req.nextUrl.searchParams);

  const [saved, total] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId: user!.id as string },
      include: {
        job: {
          include: {
            company: {
              select: { id: true, name: true, logo: true, city: true, state: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.savedJob.count({ where: { userId: user!.id as string } }),
  ]);

  return apiSuccess({
    savedJobs: saved,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const { jobId } = body;

  if (!jobId) return apiError('jobId is required', 400);

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return apiError('Job not found', 404);

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: user!.id as string, jobId } },
  });

  if (existing) {
    // Unsave
    await prisma.savedJob.delete({ where: { id: existing.id } });
    return apiSuccess({ saved: false });
  }

  await prisma.savedJob.create({
    data: { userId: user!.id as string, jobId },
  });

  return apiSuccess({ saved: true }, 201);
}
