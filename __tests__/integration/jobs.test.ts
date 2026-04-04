import { cleanup, createUser, createJob, createCompany, generateTestToken, prisma } from '../fixtures';

// ---------------------------------------------------------------------------
// Integration tests for Jobs API using Next.js route handler testing helpers
// These tests verify the actual route handler logic, not just unit mocks.
// ---------------------------------------------------------------------------

describe('GET /api/jobs', () => {
  afterAll(async () => {
    await cleanup();
  });

  it('should return 200 with jobs list', async () => {
    const { GET } = await import('@/app/api/jobs/route');
    const request = new Request('http://localhost:3000/api/jobs');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body.data).toHaveProperty('jobs');
    expect(body.data).toHaveProperty('pagination');
    expect(body.data.pagination).toMatchObject({
      page: expect.any(Number),
      perPage: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it('should support filtering by search', async () => {
    const user = await createUser({ role: 'EMPLOYER' });
    const company = await createCompany({ ownerId: user.id });
    await createJob({ companyId: company.id, title: 'Senior TypeScript Developer' });

    const { GET } = await import('@/app/api/jobs/route');
    const request = new Request('http://localhost:3000/api/jobs?search=TypeScript');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});

describe('POST /api/jobs', () => {
  let employer: any;
  let company: any;
  let token: string;

  beforeAll(async () => {
    employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    token = generateTestToken({ id: employer.id, email: employer.email, role: employer.role });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should reject without auth', async () => {
    const { POST } = await import('@/app/api/jobs/route');
    const request = new Request('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Should Fail',
        description: 'This should fail because there is no authentication provided at all.',
        requirements: ['TypeScript'],
        responsibilities: ['Code'],
        jobType: 'FULL_TIME',
        workModel: 'REMOTE',
        experienceLevel: 'MID',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.code).toBe('UNAUTHORIZED');
  });

  it('should create job with valid auth', async () => {
    const { POST } = await import('@/app/api/jobs/route');
    const request = new Request('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${token}`,
      },
      body: JSON.stringify({
        title: 'Integration Test Position',
        description: 'A job created during integration testing with sufficient text length here.',
        requirements: ['TypeScript', 'React'],
        responsibilities: ['Develop features', 'Write tests'],
        jobType: 'FULL_TIME',
        workModel: 'REMOTE',
        experienceLevel: 'MID',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('Integration Test Position');
  });

  it('should reject invalid job data', async () => {
    const { POST } = await import('@/app/api/jobs/route');
    const request = new Request('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${token}`,
      },
      body: JSON.stringify({
        title: 'x', // too short (min 3)
        description: 'short', // too short
        requirements: [], // min 1
        responsibilities: [], // min 1
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/jobs/[id]', () => {
  let company: any;
  let job: any;

  beforeAll(async () => {
    const employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    job = await createJob({ companyId: company.id });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should return a single job', async () => {
    const { GET } = await import('@/app/api/jobs/[id]/route');
    const request = new Request(`http://localhost:3000/api/jobs/${job.id}`);
    const response = await GET(request, { params: Promise.resolve({ id: job.id }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(job.id);
  });

  it('should return 404 for missing job', async () => {
    const { GET } = await import('@/app/api/jobs/[id]/route');
    const request = new Request('http://localhost:3000/api/jobs/missing-id');
    const response = await GET(request, { params: Promise.resolve({ id: 'missing-id' }) });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.code).toBe('NOT_FOUND');
  });
});

describe('PATCH /api/jobs/[id]', () => {
  let employer: any;
  let company: any;
  let token: string;
  let job: any;

  beforeAll(async () => {
    employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    token = generateTestToken({ id: employer.id, email: employer.email, role: employer.role });
    job = await createJob({ companyId: company.id });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should update job as owner', async () => {
    const { PATCH } = await import('@/app/api/jobs/[id]/route');
    const request = new Request(`http://localhost:3000/api/jobs/${job.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${token}`,
      },
      body: JSON.stringify({ title: 'Updated Integration Test Title' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: job.id }) });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('Updated Integration Test Title');
  });
});

describe('DELETE /api/jobs/[id]', () => {
  let employer: any;
  let company: any;
  let token: string;
  let job: any;

  beforeAll(async () => {
    employer = await createUser({ role: 'EMPLOYER' });
    company = await createCompany({ ownerId: employer.id });
    token = generateTestToken({ id: employer.id, email: employer.email, role: employer.role });
    job = await createJob({ companyId: company.id });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should soft-delete (deactivate) a job', async () => {
    const { DELETE } = await import('@/app/api/jobs/[id]/route');
    const request = new Request(`http://localhost:3000/api/jobs/${job.id}`, {
      method: 'DELETE',
      headers: { Cookie: `next-auth.session-token=${token}` },
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: job.id }) });
    expect(response.status).toBe(200);

    // Verify soft delete sets isActive to false
    const dbJob = await prisma.job.findUnique({ where: { id: job.id } });
    expect(dbJob?.isActive).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// APPLICATIONS WORKFLOW
// ---------------------------------------------------------------------------

describe('Applications: create -> list -> update status', () => {
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
    const request = new Request(`http://localhost:3000/api/jobs/${job.id}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverLetter: 'Hire me please!' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: job.id }) });
    expect(response.status).toBe(401);
  });

  it('should reject employer applying to job', async () => {
    const { POST } = await import('@/app/api/jobs/[id]/apply/route');
    const request = new Request(`http://localhost:3000/api/jobs/${job.id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${employerToken}`,
      },
      body: JSON.stringify({ coverLetter: 'I want to apply' }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: job.id }) });
    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.code).toBe('FORBIDDEN');
  });

  it('should create application as job seeker', async () => {
    const { POST } = await import('@/app/api/jobs/[id]/apply/route');
    const request = new Request(`http://localhost:3000/api/jobs/${job.id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${seekerToken}`,
      },
      body: JSON.stringify({
        coverLetter: 'I am very interested in this role and excited to contribute.',
      }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: job.id }) });
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.coverLetter).toBe('I am very interested in this role and excited to contribute.');
  });

  it('should list applications for employer', async () => {
    const { createApplication } = await import('../fixtures');
    await createApplication({ jobId: job.id });

    const { GET } = await import('@/app/api/applications/route');
    const request = new Request('http://localhost:3000/api/applications', {
      headers: { Cookie: `next-auth.session-token=${employerToken}` },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.applications)).toBe(true);
  });

  it('should list own applications for job seeker', async () => {
    const { createApplication } = await import('../fixtures');
    await createApplication({ jobId: job.id, userId: seeker.id });

    const { GET } = await import('@/app/api/applications/route');
    const request = new Request('http://localhost:3000/api/applications', {
      headers: { Cookie: `next-auth.session-token=${seekerToken}` },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.applications.length).toBeGreaterThanOrEqual(1);
  });

  it('should update application status as employer', async () => {
    const { createApplication } = await import('../fixtures');
    const application = await createApplication({ jobId: job.id });

    const { PATCH } = await import('@/app/api/applications/[id]/route');
    const request = new Request(`http://localhost:3000/api/applications/${application.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${employerToken}`,
      },
      body: JSON.stringify({ status: 'INTERVIEW', employerNotes: 'Very strong candidate!' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: application.id }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('INTERVIEW');
  });
});
