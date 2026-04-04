import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
  role: z.enum(['JOB_SEEKER', 'EMPLOYER', 'RECRUITER']).default('JOB_SEEKER'),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  skills: z.array(z.string().max(50)).max(30).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  salaryExpectation: z.number().min(0).optional(),
  isOpenToWork: z.boolean().optional(),
});

export const createJobSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(50).max(10000),
  requirements: z.array(z.string().min(1).max(500)).min(1).max(20),
  responsibilities: z.array(z.string().min(1).max(500)).min(1).max(20),
  benefits: z.array(z.string().max(500)).max(20).optional().default([]),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  workModel: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  skills: z.array(z.string().max(50)).max(15).default([]),
  industry: z.string().max(100).optional(),
  isExclusive: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
}).refine(
  (data) => data.salaryMin === undefined || data.salaryMax === undefined || data.salaryMin <= data.salaryMax,
  { message: 'salaryMin must be less than or equal to salaryMax', path: ['salaryMax'] }
);

const _createJobSchemaBase = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(50).max(10000),
  requirements: z.array(z.string().min(1).max(500)).min(1).max(20),
  responsibilities: z.array(z.string().min(1).max(500)).min(1).max(20),
  benefits: z.array(z.string().max(500)).max(20).optional().default([]),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  workModel: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  skills: z.array(z.string().max(50)).max(15).default([]),
  industry: z.string().max(100).optional(),
  isExclusive: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
});
export const updateJobSchema = _createJobSchemaBase.partial().refine(
  (data) => data.salaryMin === undefined || data.salaryMax === undefined || data.salaryMin <= data.salaryMax,
  { message: 'salaryMin must be less than or equal to salaryMax', path: ['salaryMax'] }
);

export const applySchema = z.object({
  coverLetter: z.string().max(5000).optional(),
  salaryExpectation: z.number().min(0).optional(),
  availableFrom: z.string().datetime().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN']),
  employerNotes: z.string().max(2000).optional(),
  interviewDate: z.string().datetime().optional(),
});

export const createCompanySchema = z.object({
  name: z.string().min(2).max(200).trim(),
  description: z.string().max(5000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  foundedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  culture: z.string().max(3000).optional(),
  benefits: z.array(z.string().max(500)).max(20).default([]),
});

export const messageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(200).trim(),
  pros: z.string().max(2000).optional(),
  cons: z.string().max(2000).optional(),
  isAnonymous: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
export type CompanyInput = z.infer<typeof createCompanySchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type UpdateApplicationStatus = z.infer<typeof updateApplicationStatusSchema>;
