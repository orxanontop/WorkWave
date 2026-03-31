import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireRole, getPagination } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const { page, limit, skip } = getPagination(req.nextUrl.searchParams);
  const search = req.nextUrl.searchParams.get('search');
  const role = req.nextUrl.searchParams.get('role');

  const where: any = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: { select: { firstName: true, lastName: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return apiSuccess({
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  const body = await req.json();
  const { userId, isActive, role } = body;

  if (!userId) return apiError('userId is required', 400);

  const updateData: any = {};
  if (typeof isActive === 'boolean') updateData.isActive = isActive;
  if (role) updateData.role = role;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return apiSuccess({ id: user.id, isActive: user.isActive, role: user.role });
}
