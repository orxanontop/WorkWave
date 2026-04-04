import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/bcrypt';
import * as jwt from 'jsonwebtoken';

export const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Test factories — create seeded records that can be cleaned up after tests
// ---------------------------------------------------------------------------

let _userCounter = 0;
let _companyCounter = 0;
let _jobCounter = 0;

function unique() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createUser(overrides: {
  role?: string;
  email?: string;
  profile?: { firstName?: string; lastName?: string };
  subscriptionStatus?: string;
} = {}) {
  _userCounter++;
  const hashedPassword = await hash('password123', 10);

  return prisma.user.create({
    data: {
      email: overrides.email || `user${_userCounter}-${unique()}@test.com`,
      password: hashedPassword,
      role: (overrides.role as any) || 'JOB_SEEKER',
      subscriptionStatus: (overrides.subscriptionStatus as any) || 'FREE',
      profile: {
        create: {
          firstName: overrides.profile?.firstName || 'Test',
          lastName: overrides.profile?.lastName || 'User',
        },
      },
    },
    include: { profile: true },
  });
}

export async function createCompany(overrides: {
  ownerId?: string;
  name?: string;
  industry?: string;
} = {}) {
  const owner = overrides.ownerId
    ? await prisma.user.findUnique({ where: { id: overrides.ownerId } })
    : await createUser({ role: 'EMPLOYER' });

  _companyCounter++;
  return prisma.company.create({
    data: {
      name: overrides.name || `Test Company ${_companyCounter}-${unique()}`,
      description: 'A test company for integration testing.',
      ownerId: owner!.id,
      industry: overrides.industry || 'Technology',
      slug: `test-company-${_companyCounter}-${Date.now()}`,
    },
  });
}

export async function createJob(overrides: {
  companyId?: string;
  title?: string;
  isActive?: boolean;
  data?: Record<string, unknown>;
} = {}) {
  const companyId =
    overrides.companyId || (await createCompany()).id;

  _jobCounter++;
  return prisma.job.create({
    data: {
      title: overrides.title || `Software Engineer ${_jobCounter}`,
      description:
        'Build amazing things with modern web technologies for our growing team in Austin Texas.',
      requirements: ['TypeScript', 'React', 'Node.js'],
      responsibilities: ['Develop features', 'Write tests'],
      jobType: 'FULL_TIME',
      workModel: 'REMOTE',
      experienceLevel: 'MID',
      isActive: overrides.isActive !== false,
      companyId,
      slug: `test-job-${_jobCounter}-${Date.now()}`,
      ...(overrides.data || {}),
    },
  });
}

export async function createApplication(overrides: {
  userId?: string;
  jobId?: string;
  status?: string;
} = {}) {
  const userId =
    overrides.userId || (await createUser({ role: 'JOB_SEEKER' })).id;

  const jobId =
    overrides.jobId || (await createJob()).id;

  return prisma.application.create({
    data: {
      userId,
      jobId,
      coverLetter: 'I am very interested in this position.',
      status: (overrides.status as any) || 'PENDING',
    },
  });
}

// ---------------------------------------------------------------------------
// Auth helpers — generate a real JWT token for NextAuth
// ---------------------------------------------------------------------------

export function generateTestToken(user: {
  id: string;
  email: string;
  role: string;
  subscriptionStatus?: string;
}) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus || 'FREE',
    name: user.email,
  };
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
}

// ---------------------------------------------------------------------------
// Cleanup — delete all seeded records in reverse dependency order
// ---------------------------------------------------------------------------

export async function cleanup() {
  try {
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.savedJob.deleteMany(),
      prisma.application.deleteMany(),
      prisma.message.deleteMany(),
      prisma.job.deleteMany(),
      prisma.company.deleteMany(),
      prisma.subscription.deleteMany(),
      prisma.payment.deleteMany(),
      prisma.profile.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  } catch {
    // Ignore cleanup errors in test isolation
  }
}
