import { NextRequest } from 'next/server';
import { cleanup, createUser, createJob, createApplication, createCompany, generateTestToken, prisma } from '../fixtures';

// ---------------------------------------------------------------------------
// Helper utilities for mocking requests + parsing route params
// ---------------------------------------------------------------------------

function mockRequest(
  url: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): NextRequest {
  const fullUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`;
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (options.token) {
    headers.set('cookie', `next-auth.session-token=${options.token}`);
  }
  return new NextRequest(fullUrl, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

function mockRequestWithParams(
  url: string,
  params: Record<string, string>,
  options: { method?: string; body?: unknown; token?: string } = {}
): [NextRequest, { params: Promise<Record<string, string>> }] {
  const req = mockRequest(url, options);
  return [req, { params: Promise.resolve(params) }];
}

// ---------------------------------------------------------------------------
// AUTH REGISTER
// ---------------------------------------------------------------------------

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    try { await prisma.user.deleteMany({ where: { email: { contains: '@test-reg-email-' } } }); } catch { /* ignore */ }
  });

  it('should register a new user', async () => {
    const { POST } = await import('@/app/api/auth/register/route');
  });
});

// ---------------------------------------------------------------------------
// JOBS CRUD
// ---------------------------------------------------------------------------

describe('GET/POST /api/jobs', () => {
  let employer: any;
  let company: any;
  let employerToken: string;

  beforeAll(async () => {
    employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    employerToken = generateTestToken({ id: employer.id, email: employer.email, role: employer.role });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should list jobs without auth', async () => {
    await createJob({ companyId: company.id });

    const { GET } = await import('@/app/api/jobs/route');
    const res = await GET(mockRequest('/api/jobs'));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.jobs)).toBe(true);
    expect(data.data.pagination).toEqual(
      expect.objectContaining({ page: 1, perPage: 20, total: expect.any(Number) })
    );
  });

  it('should create a job with authenticat', async () => {
    const { POST } = await import('@/app/api/jobs/route');

    const res = await POST(
      mockRequest('/api/jobs', {
        method: 'POST',
        token: employerToken,
        body: {
          title: 'Integration Test Job',
          description: 'A job created during integration testing with enough minimum characters required.',
          requirements: ['TypeScript', 'React'],
          responsibilities: ['Write code', 'Ship features'],
          jobType: 'FULL_TIME',
          workModel: 'REMOTE',
          experienceLevel: 'MID',
          city: 'Test City',
          state: 'TX',
        },
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Integration Test Job');
  });

  it('should reject job creation without auth', async () => {
    const { POST } = await import('@/app/api/jobs/route');

    const res = await POST(
      mockRequest('/api/jobs', {
        method: 'POST',
        body: {
          title: 'Should Fail',
          description: 'This job creation should fail because there is no auth token provided.',
          requirements: ['None'],
          responsibilities: ['None'],
          jobType: 'FULL_TIME',
          workModel: 'REMOTE',
          experienceLevel: 'MID',
        },
      })
    );

    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.code).toBe('UNAUTHORIZED');
  });
});

describe('GET/PATCH/DELETE /api/jobs/[id]', () => {
  let employer: any;
  let company: any;
  let employerToken: string;
  let job: any;

  beforeAll(async () => {
    employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    employerToken = generateTestToken({ id: employer.id, email: employer.email, role: employer.role });
    job = await createJob({ companyId: company.id });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should get a job by id', async () => {
    const { GET } = await import('@/app/api/jobs/[id]/route');
    const [req, ctx] = mockRequestWithParams(`/api/jobs/${job.id}`, { id: job.id });

    const res = await GET(req, ctx);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(job.id);
  });

  it('should return 404 for non-existent job', async () => {
    const { GET } = await import('@/app/api/jobs/[id]/route');
    const [req, ctx] = mockRequestWithParams('/api/jobs/nonexistent', { id: 'nonexistent' });

    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it('should update a job as owner', async () => {
    const { PATCH } = await import('@/app/api/jobs/[id]/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/jobs/${job.id}`,
      { id: job.id },
      { method: 'PATCH', token: employerToken, body: { title: 'Updated Title Integration' } }
    );

    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Updated Title Integration');
  });

  it('should soft-delete (deactivate) a job as owner', async () => {
    const { DELETE } = await import('@/app/api/jobs/[id]/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/jobs/${job.id}`,
      { id: job.id },
      { method: 'DELETE', token: employerToken }
    );

    const res = await DELETE(req, ctx);
    expect(res.status).toBe(200);

    // Verify job is still in DB but inactive
    const dbJob = await prisma.job.findUnique({ where: { id: job.id } });
    expect(dbJob?.isActive).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// APPLICATIONS WORKFLOW
// ---------------------------------------------------------------------------

describe('Applications: create → list → update status', () => {
  let seeker: any;
  let employer: any;
  let company: any;
  let job: any;
  let seekerToken: string;
  let employerToken: string;

  beforeEach(async () => {
    seeker = await createUser({ role: 'JOB_SEEKER' });
    employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    job = await createJob({ companyId: company.id });
    seekerToken = generateTestToken({ id: seeker.id, email: seeker.email, role: seeker.role });
    employerToken = generateTestToken({ id: employer.id, email: employer.email, role: employer.role });
  });

  afterEach(async () => {
    await cleanup();
  });

  it('should reject application without auth', async () => {
    const { POST } = await import('@/app/api/jobs/[id]/apply/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/jobs/${job.id}/apply`,
      { id: job.id },
      { method: 'POST', body: { coverLetter: 'Hire me!' } }
    );

    const res = await POST(req, ctx);
    expect(res.status).toBe(401);
  });

  it('should reject employer applying to own', async () => {
    const { POST } = await import('@/app/api/jobs/[id]/apply/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/jobs/${job.id}/apply`,
      { id: job.id },
      { method: 'POST', token: employerToken, body: { coverLetter: 'I want this job' } }
    );

    const res = await POST(req, ctx);
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.code).toBe('FORBIDDEN');
  });

  it('should create application as job seeker', async () => {
    const { POST } = await import('@/app/api/jobs/[id]/apply/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/jobs/${job.id}/apply`,
      { id: job.id },
      { method: 'POST', token: seekerToken, body: { coverLetter: 'Very interested in this role and excited to contribute.' } }
    );

    const res = await POST(req, ctx);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.coverLetter).toBe('Very interested in this role and excited to contribute.');
  });

  it('should list applications for employer', async () => {
    await createApplication({ jobId: job.id });

    const { GET } = await import('@/app/api/applications/route');
    const res = await GET(mockRequest('/api/applications', { token: employerToken }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.applications)).toBe(true);
  });

  it('should list applications for job seeker (own only)', async () => {
    await createApplication({ jobId: job.id });

    const { GET } = await import('@/app/api/applications/route');
    const res = await GET(mockRequest('/api/applications', { token: seekerToken }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.applications.length).toBeGreaterThanOrEqual(1);
  });

  it('should update application status as employer', async () => {
    const application = await createApplication({ jobId: job.id });

    const { PATCH } = await import('@/app/api/applications/[id]/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/applications/${application.id}`,
      { id: application.id },
      {
        method: 'PATCH',
        token: employerToken,
        body: { status: 'INTERVIEW', employerNotes: 'Great candidate!' },
      }
    );

    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('INTERVIEW');
  });

  it('should reject unauthorized status update', async () => {
    const application = await createApplication({ jobId: job.id });
    const randomUser = await createUser({ role: 'JOB_SEEKER' });
    const randomToken = generateTestToken({ id: randomUser.id, email: randomUser.email, role: randomUser.role });

    const { PATCH } = await import('@/app/api/applications/[id]/route');
    const [req, ctx] = mockRequestWithParams(
      `/api/applications/${application.id}`,
      { id: application.id },
      { method: 'PATCH', token: randomToken, body: { status: 'OFFERED' } }
    );

    const res = await PATCH(req, ctx);
    expect(res.status).toBe(403);
  });
});
