import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, rateLimit } from '@/lib/api';
import { profileSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const rl = await rateLimit(req, 60);
  if (!rl.allowed) return rl.response!;

  const { error, user } = await requireAuth(req);
  if (error) return error;

  const profile = await prisma.profile.findUnique({
    where: { userId: user!.id as string },
    include: { user: { select: { id: true, email: true, role: true, subscriptionStatus: true, createdAt: true } } },
  });

  if (!profile) return apiError('Profile not found', 404, 'NOT_FOUND');

  const [applicationCount, monthlyApplications] = await Promise.all([
    prisma.application.count({ where: { userId: user!.id as string } }),
    prisma.application.count({
      where: { userId: user!.id as string, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    }),
  ]);

  return apiResponse({ ...profile, applicationCount, monthlyApplications });
}

export async function PATCH(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const validation = profileSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  try {
    const data = validation.data;
    const updated = await prisma.profile.update({
      where: { userId: user!.id as string },
      data: { ...data, skills: data.skills || undefined },
    });
    logger.info({ userId: user!.id }, 'Profile updated');
    return apiResponse(updated);
  } catch (err) {
    logger.error({ err, userId: user!.id }, 'Failed to update profile');
    return apiError('Failed to update profile', 500, 'INTERNAL_ERROR');
  }
}
