import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth } from '@/lib/api';
import { updateApplicationStatusSchema } from '@/lib/validations';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      job: {
        include: {
          company: {
            select: { id: true, name: true, logo: true, ownerId: true },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  if (!application) return apiError('Application not found', 404);

  // Authorization check
  const isOwner = application.userId === user!.id;
  const isEmployer = application.job.company.ownerId === user!.id;
  const isAdmin = user!.role === 'ADMIN';

  if (!isOwner && !isEmployer && !isAdmin) {
    return apiError('Not authorized', 403);
  }

  return apiSuccess(application);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      job: {
        include: { company: { select: { ownerId: true } } },
      },
    },
  });

  if (!application) return apiError('Application not found', 404);

  const body = await req.json();

  // Job seeker can only withdraw
  if (user!.role === 'JOB_SEEKER') {
    if (body.status !== 'WITHDRAWN') {
      return apiError('You can only withdraw your application', 403);
    }
    if (application.userId !== user!.id) {
      return apiError('Not authorized', 403);
    }
  }

  // Employer can update status
  if (['EMPLOYER', 'ADMIN'].includes(user!.role as string)) {
    if (application.job.company.ownerId !== user!.id && user!.role !== 'ADMIN') {
      return apiError('Not authorized', 403);
    }
  }

  const validation = updateApplicationStatusSchema.safeParse(body);
  if (!validation.success) {
    return apiError(validation.error.errors.map((e) => e.message).join(', '), 400);
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: {
      status: validation.data.status,
      employerNotes: validation.data.employerNotes,
      interviewDate: validation.data.interviewDate
        ? new Date(validation.data.interviewDate)
        : undefined,
    },
  });

  // Notify the applicant
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

  return apiSuccess(updated);
}
