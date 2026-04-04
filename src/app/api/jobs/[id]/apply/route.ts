import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, rateLimit } from '@/lib/api';
import { applySchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

const FREE_APPLICATIONS_LIMIT = 5;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  if (user!.role !== 'JOB_SEEKER') {
    return apiError('Only job seekers can apply to jobs', 403, 'FORBIDDEN');
  }

  const jobId = params.id;
  const userId = user!.id as string;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, subscriptionStatus: true },
  });
  if (!dbUser) return apiError('User not found. Please log in again.', 401, 'UNAUTHORIZED');

  const job = await prisma.job.findUnique({
    where: { id: jobId, isActive: true },
    select: { id: true, isExclusive: true, expiresAt: true, companyId: true },
  });
  if (!job) return apiError('Job not found or no longer active', 404, 'NOT_FOUND');
  if (job.isExclusive && dbUser.subscriptionStatus !== 'ACTIVE') {
    return apiError('This job is exclusive to premium members', 403, 'PREMIUM_REQUIRED');
  }

  const existingApplication = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existingApplication) {
    return apiError('You have already applied to this job', 409, 'DUPLICATE_APPLICATION');
  }

  if (dbUser.subscriptionStatus !== 'ACTIVE') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyApplications = await prisma.application.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });
    if (monthlyApplications >= FREE_APPLICATIONS_LIMIT) {
      return apiError(
        `Free users are limited to ${FREE_APPLICATIONS_LIMIT} applications per month. Upgrade to Premium for unlimited applications.`,
        403,
        'APPLICATION_LIMIT'
      );
    }
  }

  const body = await req.json();
  const validation = applySchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const sanitizedData: Record<string, unknown> = { ...validation.data };
  if (validation.data.coverLetter) {
    sanitizedData.coverLetter = sanitizeHtml(validation.data.coverLetter);
  }

  try {
    const isPremium = user!.subscriptionStatus === 'ACTIVE';
    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        coverLetter: sanitizedData.coverLetter as string | undefined,
        salaryExpectation: sanitizedData.salaryExpectation as number | undefined,
        availableFrom: sanitizedData.availableFrom
          ? new Date(sanitizedData.availableFrom as string)
          : undefined,
        isPriority: isPremium,
      },
      include: { job: { select: { title: true, company: { select: { name: true } } } } },
    });

    await prisma.job.update({ where: { id: jobId }, data: { applicationsCount: { increment: 1 } } });

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

    logger.info({ applicationId: application.id, jobId, userId }, 'Application submitted');
    return apiResponse(application, 201);
  } catch (err) {
    logger.error({ err, jobId, userId }, 'Failed to submit application');
    return apiError('Failed to submit application. Please try again.', 500, 'INTERNAL_ERROR');
  }
}
