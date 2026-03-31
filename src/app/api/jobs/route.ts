import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPagination, apiSuccess, apiError, rateLimit, getClientIp, generateSlug } from '@/lib/api';
import { requireAuth, requireRole } from '@/lib/api';
import { createJobSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return apiError('Too many requests', 429);
  }

  const { page, limit, skip } = getPagination(req.nextUrl.searchParams);
  const params = req.nextUrl.searchParams;

  const where: any = { isActive: true };

  // Search
  const search = params.get('search');
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { skills: { hasSome: search.split(' ') } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Filters
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

  // Sort
  const sort = params.get('sort') || 'newest';
  let orderBy: any = {};
  switch (sort) {
    case 'salary_high':
      orderBy = { salaryMax: 'desc' };
      break;
    case 'salary_low':
      orderBy = { salaryMin: 'asc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    default:
      orderBy = [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            rating: true,
            reviewCount: true,
            industry: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return apiSuccess({
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireRole(req, ['EMPLOYER', 'ADMIN', 'RECRUITER']);
  if (error) return error;

  const validation = await createJobSchema.safeParseAsync(await req.json());
  if (!validation.success) {
    return apiError(
      validation.error.errors.map((e) => e.message).join(', '),
      400
    );
  }

  const data = validation.data;

  const company = await prisma.company.findFirst({
    where: { ownerId: user!.id as string },
  });

  if (!company && user!.role !== 'ADMIN') {
    return apiError('You must create a company profile first', 400);
  }

  const slug = generateSlug(data.title) + '-' + Date.now().toString(36);

  const job = await prisma.job.create({
    data: {
      ...data,
      slug,
      companyId: company?.id || '',
      publishedAt: new Date(),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  return apiSuccess(job, 201);
}
