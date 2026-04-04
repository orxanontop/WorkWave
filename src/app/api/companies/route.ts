import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, getPagination, paginationMeta, generateSlug } from '@/lib/api';
import { createCompanySchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const search = req.nextUrl.searchParams.get('search');

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { industry: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { _count: { select: { jobs: { where: { isActive: true } } } } },
      orderBy: { rating: 'desc' },
      skip, take: perPage,
    }),
    prisma.company.count({ where }),
  ]);

  return apiResponse({ companies, pagination: paginationMeta(total, page, perPage) });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  if (!['EMPLOYER', 'ADMIN', 'RECRUITER'].includes(user!.role as string)) {
    return apiError('Only employers can create companies', 403, 'FORBIDDEN');
  }

  const existing = await prisma.company.findFirst({ where: { ownerId: user!.id as string } });
  if (existing) return apiError('You already have a company profile', 409, 'COMPANY_EXISTS');

  const body = await req.json();
  const validation = createCompanySchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const slug = generateSlug(validation.data.name) + '-' + Date.now().toString(36);
  const data = {
    ...validation.data,
    description: validation.data.description ? sanitizeHtml(validation.data.description) : undefined,
    culture: validation.data.culture ? sanitizeHtml(validation.data.culture) : undefined,
  };

  try {
    const company = await prisma.company.create({ data: { ...data, slug, ownerId: user!.id as string } });
    logger.info({ companyId: company.id, userId: user!.id }, 'Company created');
    return apiResponse(company, 201);
  } catch (err) {
    logger.error({ err, userId: user!.id }, 'Failed to create company');
    return apiError('Failed to create company', 500, 'INTERNAL_ERROR');
  }
}
