import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, requireAuth, getPagination, generateSlug } from '@/lib/api';
import { createCompanySchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const { page, limit, skip } = getPagination(req.nextUrl.searchParams);
  const search = req.nextUrl.searchParams.get('search');

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { industry: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        _count: { select: { jobs: { where: { isActive: true } } } },
      },
      orderBy: { rating: 'desc' },
      skip,
      take: limit,
    }),
    prisma.company.count({ where }),
  ]);

  return apiSuccess({
    companies,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  if (!['EMPLOYER', 'ADMIN', 'RECRUITER'].includes(user!.role as string)) {
    return apiError('Only employers can create companies', 403);
  }

  // Check if user already has a company
  const existing = await prisma.company.findFirst({
    where: { ownerId: user!.id as string },
  });
  if (existing) {
    return apiError('You already have a company profile', 409);
  }

  const body = await req.json();
  const validation = createCompanySchema.safeParse(body);
  if (!validation.success) {
    return apiError(validation.error.errors.map((e) => e.message).join(', '), 400);
  }

  const slug = generateSlug(validation.data.name) + '-' + Date.now().toString(36);

  const company = await prisma.company.create({
    data: {
      ...validation.data,
      slug,
      ownerId: user!.id as string,
    },
  });

  return apiSuccess(company, 201);
}
