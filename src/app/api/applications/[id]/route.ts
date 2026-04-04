import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth } from '@/lib/api';
import { updateApplicationStatusSchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      job: { include: { company: { select: { id: true, name: true, logo: true, ownerId: true } } } },
      user: { select: { id: true, email: true, profile: true } },
    },
  });

  if (!application) return apiError('Application not found', 404, 'NOT_FOUND');

  const isOwner = application.userId === user!.id;
  const isEmployer = application.job.company.ownerId === user!.id;
  const isAdmin = user!.role === 'ADMIN';

  if (!isOwner && !isEmployer && !isAdmin) {
    return apiError('Not authorized', 403, 'FORBIDDEN');
  }

  return apiResponse(application);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: { include: { company: { select: { ownerId: true } } } } },
  });

  if (!application) return apiError('Application not found', 404, 'NOT_FOUND');

  const body = await req.json();

  if (user!.role === 'JOB_SEEKER') {
    if (body.status !== 'WITHDRAWN') return apiError('You can only withdraw your application', 403, 'FORBIDDEN');
    if (application.userId !== user!.id) return apiError('Not authorized', 403, 'FORBIDDEN');
  }

  if (['EMPLOYER', 'RECRUITER', 'ADMIN'].includes(user!.role as string)) {
    if (application.job.company.ownerId !== user!.id && user!.role !== 'ADMIN') {
      return apiError('Not authorized', 403, 'FORBIDDEN');
    }
  }

  const validation = updateApplicationStatusSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const updateData: Record<string, unknown> = { status: validation.data.status };
  if (validation.data.employerNotes) updateData.employerNotes = sanitizeHtml(validation.data.employerNotes);
  if (validation.data.interviewDate) updateData.interviewDate = new Date(validation.data.interviewDate);

  try {
    const updated = await prisma.application.update({ where: { id: params.id }, data: updateData });

    if (user!.role !== 'JOB_SEEKER') {
      await prisma.notification.create({
        data: {
          userId: application.userId,
          title: 'Application Update',
          message: `Your application status has been updated to: ${validation.data.status}`,
          type: 'APPLICATION_UPDATE',
          link: `/dashboard/applications/${application.id}`,
        },
      });
    }

    logger.info({ applicationId: params.id, status: validation.data.status }, 'Application status updated');
    return apiResponse(updated);
  } catch (err) {
    logger.error({ err, applicationId: params.id }, 'Failed to update application');
    return apiError('Failed to update application', 500, 'INTERNAL_ERROR');
  }
}
