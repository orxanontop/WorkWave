export const APP_NAME = 'JobMarket';
export const APP_TAGLINE = 'Find your next opportunity, locally';

export const FREE_APPLICATIONS_LIMIT = 5;
export const PREMIUM_PRICE = 9.99;

export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
] as const;

export const WORK_MODELS = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ON_SITE', label: 'On-site' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'MID', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'EXECUTIVE', label: 'Executive' },
] as const;

export const APPLICATION_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'REVIEWED', label: 'Reviewed', color: 'blue' },
  { value: 'SHORTLISTED', label: 'Shortlisted', color: 'indigo' },
  { value: 'INTERVIEW', label: 'Interview', color: 'purple' },
  { value: 'OFFERED', label: 'Offered', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
  { value: 'WITHDRAWN', label: 'Withdrawn', color: 'gray' },
] as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Construction',
  'Transportation',
  'Hospitality',
  'Real Estate',
  'Media & Entertainment',
  'Non-Profit',
  'Government',
  'Legal',
  'Consulting',
  'Other',
] as const;

export const SALARY_RANGES = [
  { min: 0, max: 30000, label: 'Under $30k' },
  { min: 30000, max: 50000, label: '$30k - $50k' },
  { min: 50000, max: 75000, label: '$50k - $75k' },
  { min: 75000, max: 100000, label: '$75k - $100k' },
  { min: 100000, max: 150000, label: '$100k - $150k' },
  { min: 150000, max: 0, label: '$150k+' },
] as const;

export const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
  'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile',
  'Project Management', 'Communication', 'Leadership', 'Analytics',
  'Marketing', 'Sales', 'Design', 'Customer Service',
] as const;

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    period: '',
    applications: 5,
    features: [
      'Browse all local jobs',
      'Create a basic profile',
      '5 applications per month',
      'View company profiles & reviews',
    ],
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    period: '/month',
    applications: -1,
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited applications',
      'Priority application ranking',
      'Advanced job filters',
      'Application tracking dashboard',
      'AI resume optimization',
      'Direct messaging with employers',
      'Exclusive premium-only jobs',
    ],
  },
} as const;
