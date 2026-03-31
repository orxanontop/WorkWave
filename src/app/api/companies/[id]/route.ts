import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  if (!company) return apiError('Company not found', 404);

  return apiSuccess(company);
}
