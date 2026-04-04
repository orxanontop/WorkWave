import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  apiResponse,
  apiError,
  requireAuth,
  requireRole,
  getPagination,
  paginationMeta,
  generateSlug,
  rateLimit,
} from '@/lib/api';
import { createJobSchema } from '@/lib/validations';
import { sanitizeHtml, sanitizeStringArray } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const rl = await rateLimit(req, 100);
  if (!rl.allowed) return rl.response!;

  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const params = req.nextUrl.searchParams;

  const where: Record<string, unknown> = { isActive: true };

  const search = params.get('search');
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { skills: { hasSome: search.split(' ') } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const jobType = params.get('jobType');
  if (jobType) where.jobType = { in: jobType.split(',') };
  const workModel = params.get('workModel');
  if (workModel) where.workModel = { in: workModel.split(',') };
  const experienceLevel = params.get('experienceLevel');
  if (experienceLevel) where.experienceLevel = { in: experienceLevel.split(',') };
  const city = params.get('city');
  if (city) where.city = { contains: city, mode: 'insensitive' };
  const state = params.get('state');
  if (state) where.state = { contains: state, mode: 'insensitive' };
  const industry = params.get('industry');
  if (industry) where.industry = { contains: industry, mode: 'insensitive' };
  const salaryMin = params.get('salaryMin');
  if (salaryMin) where.salaryMax = { gte: parseInt(salaryMin) };
  const salaryMax = params.get('salaryMax');
  if (salaryMax) where.salaryMin = { lte: parseInt(salaryMax) };
  const isFeatured = params.get('featured');
  if (isFeatured === 'true') where.isFeatured = true;
  const isExclusive = params.get('exclusive');
  if (isExclusive === 'true') where.isExclusive = true;

  const sort = params.get('sort') || 'newest';
  let orderBy: Record<string, unknown> | Record<string, unknown>[] = {};
  switch (sort) {
    case 'salary_high': orderBy = { salaryMax: 'desc' }; break;
    case 'salary_low': orderBy = { salaryMin: 'asc' }; break;
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
    default: orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: { select: { id: true, name: true, slug: true, logo: true, rating: true, reviewCount: true, industry: true, city: true, state: true } } },
      orderBy, skip, take: perPage,
    }),
    prisma.job.count({ where }),
  ]);

  return apiResponse({ jobs, pagination: paginationMeta(total, page, perPage) });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireRole(req, ['EMPLOYER', 'ADMIN', 'RECRUITER']);
  if (error) return error;

  const validation = await createJobSchema.safeParseAsync(await req.json());
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const data = validation.data;
  const company = await prisma.company.findFirst({ where: { ownerId: user!.id as string } });
  if (!company && user!.role !== 'ADMIN') {
    return apiError('You must create a company profile first', 400, 'COMPANY_REQUIRED');
  }

  const slug = generateSlug(data.title) + '-' + Date.now().toString(36);

  try {
    const job = await prisma.job.create({
      data: {
        ...data,
        description: sanitizeHtml(data.description),
        requirements: sanitizeStringArray(data.requirements),
        responsibilities: sanitizeStringArray(data.responsibilities),
        benefits: data.benefits ? sanitizeStringArray(data.benefits) : [],
        slug, companyId: company?.id || '',
        publishedAt: new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
      include: { company: { select: { id: true, name: true, slug: true, logo: true } } },
    });
    logger.info({ jobId: job.id, userId: user!.id }, 'Job created');
    return apiResponse(job, 201);
  } catch (err) {
    logger.error({ err, userId: user!.id }, 'Failed to create job');
    return apiError('Failed to create job', 500, 'INTERNAL_ERROR');
  }
}
