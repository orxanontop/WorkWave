import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth } from '@/lib/api';
import { profileSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const profile = await prisma.profile.findUnique({
    where: { userId: user!.id as string },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          subscriptionStatus: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) return apiError('Profile not found', 404);

  // Get application stats
  const applicationCount = await prisma.application.count({
    where: { userId: user!.id as string },
  });

  const monthlyApplications = await prisma.application.count({
    where: {
      userId: user!.id as string,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  return apiSuccess({
    ...profile,
    applicationCount,
    monthlyApplications,
  });
}

export async function PATCH(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const validation = profileSchema.safeParse(body);
  if (!validation.success) {
    return apiError(validation.error.errors.map((e) => e.message).join(', '), 400);
  }

  const data = validation.data;

  const updated = await prisma.profile.update({
    where: { userId: user!.id as string },
    data: {
      ...data,
      skills: data.skills || undefined,
    },
  });

  return apiSuccess(updated);
}
