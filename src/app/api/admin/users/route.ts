import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireRole, getPagination, paginationMeta } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const search = req.nextUrl.searchParams.get('search');
  const role = req.nextUrl.searchParams.get('role');

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (role) where.role = role;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: { select: { firstName: true, lastName: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ]);

    return apiResponse({
      users,
      pagination: paginationMeta(total, page, perPage),
    });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch admin users');
    return apiError('Failed to fetch users', 500, 'INTERNAL_ERROR');
  }
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const body = await req.json();
  const { userId, isActive, role } = body;

  if (!userId) return apiError('userId is required', 400, 'VALIDATION_ERROR');

  try {
    const updateData: Record<string, unknown> = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (role) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    logger.info({ userId, ...updateData }, 'Admin updated user');
    return apiResponse({ id: updatedUser.id, isActive: updatedUser.isActive, role: updatedUser.role });
  } catch (err) {
    logger.error({ err, userId }, 'Failed to update user');
    return apiError('Failed to update user', 500, 'INTERNAL_ERROR');
  }
}
