import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, rateLimit } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = await rateLimit(req, 60);
  if (!rl.allowed) return rl.response!;

  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      jobs: {
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        take: 10,
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { profile: { select: { firstName: true } } },
          },
        },
      },
      _count: {
        select: { jobs: { where: { isActive: true } }, reviews: true },
      },
    },
  });

  if (!company) return apiError('Company not found', 404, 'NOT_FOUND');

  return apiResponse(company);
}
