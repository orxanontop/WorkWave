import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth } from '@/lib/api';
import { applySchema } from '@/lib/validations';
import { FREE_APPLICATIONS_LIMIT } from '@/lib/constants';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(req);
  if (error) {
    console.error('Apply auth error:', await error.clone().json());
    return error;
  }

  if (user!.role !== 'JOB_SEEKER') {
    return apiError('Only job seekers can apply to jobs', 403);
  }

  const jobId = params.id;
  const userId = user!.id as string;

  // Check if job exists and is active
  const job = await prisma.job.findUnique({
    where: { id: jobId, isActive: true },
    select: {
      id: true,
      isExclusive: true,
      expiresAt: true,
      companyId: true,
    },
  });

  if (!job) {
    return apiError('Job not found or no longer active', 404);
  }

  // Check if exclusive job and user is premium
  if (job.isExclusive && user!.subscriptionStatus !== 'ACTIVE') {
    return apiError('This job is exclusive to premium members', 403);
  }

  // Check if already applied
  const existingApplication = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });

  if (existingApplication) {
    return apiError('You have already applied to this job', 409);
  }

  // Check monthly application limit for free users
  if (user!.subscriptionStatus !== 'ACTIVE') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyApplications = await prisma.application.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (monthlyApplications >= FREE_APPLICATIONS_LIMIT) {
      return apiError(
        `Free users are limited to ${FREE_APPLICATIONS_LIMIT} applications per month. Upgrade to Premium for unlimited applications.`,
        403
      );
    }
  }

  // Parse body
  const body = await req.json();
  const validation = applySchema.safeParse(body);
  if (!validation.success) {
    return apiError(validation.error.errors.map((e) => e.message).join(', '), 400);
  }

  const isPremium = user!.subscriptionStatus === 'ACTIVE';

  // Create application
  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
      coverLetter: validation.data.coverLetter,
      salaryExpectation: validation.data.salaryExpectation,
      availableFrom: validation.data.availableFrom
        ? new Date(validation.data.availableFrom)
        : undefined,
      isPriority: isPremium,
    },
    include: {
      job: {
        select: {
          title: true,
          company: { select: { name: true } },
        },
      },
    },
  });

  // Update job application count
  await prisma.job.update({
    where: { id: jobId },
    data: { applicationsCount: { increment: 1 } },
  });

  // Create notification for employer
  const company = await prisma.company.findUnique({
    where: { id: job.companyId },
    select: { ownerId: true },
  });

  if (company?.ownerId) {
    await prisma.notification.create({
      data: {
        userId: company.ownerId,
        title: 'New Application',
        message: `Someone applied to ${application.job.title}`,
        type: 'APPLICATION',
        link: `/dashboard/applications/${application.id}`,
      },
    });
  }

  return apiSuccess(application, 201);
}
