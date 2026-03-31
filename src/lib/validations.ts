import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  role: z.enum(['JOB_SEEKER', 'EMPLOYER', 'RECRUITER']).default('JOB_SEEKER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile schemas
export const profileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  skills: z.array(z.string()).max(30).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  salaryExpectation: z.number().min(0).optional(),
  isOpenToWork: z.boolean().optional(),
});

// Job schemas
export const createJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(50).max(10000),
  requirements: z.array(z.string()).min(1).max(20),
  responsibilities: z.array(z.string()).min(1).max(20),
  benefits: z.array(z.string()).max(20).optional().default([]),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  workModel: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  skills: z.array(z.string()).max(15).default([]),
  industry: z.string().max(100).optional(),
  isExclusive: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
});

export const updateJobSchema = createJobSchema.partial();

// Application schemas
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

// Company schemas
export const createCompanySchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  foundedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  culture: z.string().max(3000).optional(),
  benefits: z.array(z.string()).max(20).default([]),
});

// Message schema
export const messageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(200),
  pros: z.string().max(2000).optional(),
  cons: z.string().max(2000).optional(),
  isAnonymous: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
