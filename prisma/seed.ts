import { PrismaClient } from '@prisma/client';
import * as bcrypt from '@node-rs/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.companyReview.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@jobmarket.com',
      password: hashedPassword,
      role: 'ADMIN',
      subscriptionStatus: 'ACTIVE',
      profile: {
        create: { firstName: 'Admin', lastName: 'User' },
      },
    },
  });

  // Create job seekers
  const seekers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'JOB_SEEKER',
        subscriptionStatus: 'ACTIVE',
        profile: {
          create: {
            firstName: 'Alice',
            lastName: 'Johnson',
            headline: 'Senior Frontend Developer',
            city: 'San Francisco',
            state: 'CA',
            skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'CSS'],
            experienceYears: 5,
            experienceLevel: 'SENIOR',
            bio: 'Passionate frontend developer with 5 years of experience building modern web applications.',
            salaryExpectation: 150000,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'JOB_SEEKER',
        profile: {
          create: {
            firstName: 'Bob',
            lastName: 'Smith',
            headline: 'Junior Data Analyst',
            city: 'Austin',
            state: 'TX',
            skills: ['Python', 'SQL', 'Excel', 'Tableau'],
            experienceYears: 1,
            experienceLevel: 'ENTRY',
            bio: 'Recent graduate eager to start a career in data analytics.',
            salaryExpectation: 55000,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'carol@example.com',
        password: hashedPassword,
        role: 'JOB_SEEKER',
        subscriptionStatus: 'ACTIVE',
        profile: {
          create: {
            firstName: 'Carol',
            lastName: 'Williams',
            headline: 'Product Manager',
            city: 'New York',
            state: 'NY',
            skills: ['Product Strategy', 'Agile', 'Scrum', 'User Research', 'SQL', 'JIRA'],
            experienceYears: 7,
            experienceLevel: 'SENIOR',
            bio: 'Experienced product manager with a track record of launching successful B2B products.',
            salaryExpectation: 160000,
          },
        },
      },
    }),
  ]);

  // Create employers
  const employers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'hr@techcorp.com',
        password: hashedPassword,
        role: 'EMPLOYER',
        subscriptionStatus: 'ACTIVE',
        profile: {
          create: { firstName: 'Sarah', lastName: 'Chen' },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'jobs@innovate.io',
        password: hashedPassword,
        role: 'EMPLOYER',
        subscriptionStatus: 'ACTIVE',
        profile: {
          create: { firstName: 'Mike', lastName: 'Davis' },
        },
      },
    }),
  ]);

  // Create recruiter
  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@talentfind.com',
      password: hashedPassword,
      role: 'RECRUITER',
      subscriptionStatus: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Jessica',
          lastName: 'Lee',
          headline: 'Technical Recruiter',
          city: 'Seattle',
          state: 'WA',
        },
      },
    },
  });

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechCorp',
        slug: 'techcorp',
        description: 'Leading technology company building the future of cloud computing. We are a team of 500+ engineers, designers, and product thinkers working on infrastructure that powers millions of businesses worldwide.',
        industry: 'Technology',
        size: '500-1000',
        city: 'San Francisco',
        state: 'CA',
        website: 'https://techcorp.example.com',
        isVerified: true,
        rating: 4.5,
        reviewCount: 128,
        benefits: ['Health Insurance', '401k Match', 'Remote Work', 'Unlimited PTO', 'Learning Budget'],
        ownerId: employers[0].id,
      },
    }),
    prisma.company.create({
      data: {
        name: 'Innovate.io',
        slug: 'innovate-io',
        description: 'Fast-growing startup disrupting the fintech space. Our mission is to make financial services accessible to everyone. Join our team of 50 passionate builders.',
        industry: 'Finance',
        size: '50-200',
        city: 'Austin',
        state: 'TX',
        website: 'https://innovate.example.com',
        isVerified: true,
        rating: 4.2,
        reviewCount: 45,
        benefits: ['Equity', 'Health Insurance', 'Flexible Hours', 'Gym Membership'],
        ownerId: employers[1].id,
      },
    }),
    prisma.company.create({
      data: {
        name: 'DataDriven Inc',
        slug: 'datadriven-inc',
        description: 'Enterprise analytics platform helping Fortune 500 companies make data-driven decisions. We process billions of data points daily.',
        industry: 'Technology',
        size: '200-500',
        city: 'New York',
        state: 'NY',
        isVerified: true,
        rating: 4.0,
        reviewCount: 67,
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Parental Leave'],
      },
    }),
    prisma.company.create({
      data: {
        name: 'GreenBuild Construction',
        slug: 'greenbuild-construction',
        description: 'Sustainable construction company specializing in LEED-certified commercial buildings.',
        industry: 'Construction',
        size: '100-300',
        city: 'Portland',
        state: 'OR',
        isVerified: true,
        rating: 4.3,
        reviewCount: 23,
        benefits: ['Health Insurance', '401k', 'Paid Training'],
      },
    }),
  ]);

  // Create jobs
  const jobData = [
    {
      title: 'Senior Frontend Engineer',
      slug: 'senior-frontend-engineer-1',
      description: 'We are looking for a Senior Frontend Engineer to join our platform team. You will be responsible for building and maintaining our customer-facing dashboard used by millions of users. You will work closely with designers and backend engineers to deliver pixel-perfect, performant user interfaces.\n\nOur tech stack includes React, TypeScript, and GraphQL. We value clean code, thorough testing, and continuous improvement.',
      requirements: ['5+ years of frontend development experience', 'Expert knowledge of React and TypeScript', 'Experience with GraphQL and REST APIs', 'Strong understanding of web performance optimization', 'Experience with testing frameworks (Jest, Cypress)'],
      responsibilities: ['Build and maintain customer-facing dashboard', 'Collaborate with design team on UI/UX improvements', 'Mentor junior developers', 'Participate in code reviews and architecture discussions', 'Write technical documentation'],
      benefits: ['Competitive salary', 'Equity package', 'Health, dental, vision insurance', 'Unlimited PTO', 'Learning budget'],
      companyId: companies[0].id,
      city: 'San Francisco',
      state: 'CA',
      salaryMin: 140000,
      salaryMax: 200000,
      jobType: 'FULL_TIME' as const,
      workModel: 'HYBRID' as const,
      experienceLevel: 'SENIOR' as const,
      skills: ['React', 'TypeScript', 'GraphQL', 'CSS', 'Jest'],
      industry: 'Technology',
      isFeatured: true,
    },
    {
      title: 'Full Stack Developer',
      slug: 'full-stack-developer-1',
      description: 'Join our growing engineering team to build the next generation of fintech products. You will work across the entire stack, from our React frontend to our Node.js microservices.\n\nWe are a small team, so you will have a significant impact on our product direction. We value autonomy, ownership, and shipping fast.',
      requirements: ['3+ years of full stack development', 'Experience with React and Node.js', 'Familiarity with PostgreSQL', 'Understanding of RESTful API design', 'BS in Computer Science or equivalent'],
      responsibilities: ['Develop new features end-to-end', 'Optimize application performance', 'Write automated tests', 'Deploy and monitor production services', 'Participate in on-call rotation'],
      benefits: ['Competitive salary + equity', 'Health insurance', 'Flexible hours', 'Annual retreat'],
      companyId: companies[1].id,
      city: 'Austin',
      state: 'TX',
      salaryMin: 100000,
      salaryMax: 150000,
      jobType: 'FULL_TIME' as const,
      workModel: 'REMOTE' as const,
      experienceLevel: 'MID' as const,
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
      industry: 'Finance',
      isFeatured: true,
    },
    {
      title: 'Junior Data Analyst',
      slug: 'junior-data-analyst-1',
      description: 'Great opportunity for a recent graduate to start a career in data analytics. You will help our team analyze large datasets and create reports for business stakeholders.\n\nWe provide extensive training and mentorship. This is a great entry point for someone passionate about data.',
      requirements: ["Bachelor's degree in a quantitative field", 'Basic SQL knowledge', 'Familiarity with Python or R', 'Strong analytical thinking', 'Excellent communication skills'],
      responsibilities: ['Analyze datasets and create visualizations', 'Build and maintain dashboards', 'Support ad-hoc reporting requests', 'Document data processes', 'Present findings to stakeholders'],
      benefits: ['Competitive entry-level salary', 'Health insurance', 'Professional development budget', 'Mentorship program'],
      companyId: companies[2].id,
      city: 'New York',
      state: 'NY',
      salaryMin: 55000,
      salaryMax: 75000,
      jobType: 'FULL_TIME' as const,
      workModel: 'ON_SITE' as const,
      experienceLevel: 'ENTRY' as const,
      skills: ['Python', 'SQL', 'Excel', 'Tableau'],
      industry: 'Technology',
    },
    {
      title: 'Product Manager',
      slug: 'product-manager-1',
      description: 'Lead the product strategy for our core analytics platform. You will work with engineering, design, and sales to define the roadmap and ship features that delight our customers.\n\nWe are looking for someone who can balance user needs with business goals and make data-driven decisions.',
      requirements: ['5+ years of product management experience', 'Experience with B2B SaaS products', 'Strong analytical skills', 'Excellent stakeholder management', 'Technical background preferred'],
      responsibilities: ['Define product roadmap and priorities', 'Write detailed product requirements', 'Work with engineering on scoping and delivery', 'Conduct user research and interviews', 'Track and report on product metrics'],
      benefits: ['Top-tier compensation', 'Equity', 'Executive coaching', 'Health and wellness benefits'],
      companyId: companies[2].id,
      city: 'New York',
      state: 'NY',
      salaryMin: 130000,
      salaryMax: 180000,
      jobType: 'FULL_TIME' as const,
      workModel: 'HYBRID' as const,
      experienceLevel: 'SENIOR' as const,
      skills: ['Product Strategy', 'Agile', 'SQL', 'User Research'],
      industry: 'Technology',
      isFeatured: true,
    },
    {
      title: 'DevOps Engineer',
      slug: 'devops-engineer-1',
      description: 'Help us build and maintain the infrastructure that powers our platform. You will manage our Kubernetes clusters, CI/CD pipelines, and monitoring systems.\n\nWe run on AWS and process millions of requests daily. Reliability and performance are critical to our business.',
      requirements: ['3+ years of DevOps/SRE experience', 'Strong Kubernetes and Docker knowledge', 'Experience with AWS services', 'Terraform or Pulumi experience', 'Understanding of CI/CD best practices'],
      responsibilities: ['Manage Kubernetes clusters', 'Build and maintain CI/CD pipelines', 'Monitor system health and respond to incidents', 'Optimize infrastructure costs', 'Improve developer experience'],
      benefits: ['Competitive salary', 'On-call compensation', 'Learning budget', 'Remote work'],
      companyId: companies[0].id,
      city: 'San Francisco',
      state: 'CA',
      salaryMin: 130000,
      salaryMax: 180000,
      jobType: 'FULL_TIME' as const,
      workModel: 'REMOTE' as const,
      experienceLevel: 'MID' as const,
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
      industry: 'Technology',
    },
    {
      title: 'Marketing Intern',
      slug: 'marketing-intern-1',
      description: 'Join our marketing team for a summer internship. You will help with social media, content creation, and campaign analytics. Great opportunity to learn digital marketing from experienced professionals.',
      requirements: ['Currently pursuing a marketing or communications degree', 'Strong written communication', 'Familiarity with social media platforms', 'Creative mindset', 'Self-starter attitude'],
      responsibilities: ['Assist with social media content', 'Help plan marketing campaigns', 'Analyze campaign performance', 'Write blog posts and email copy', 'Support event planning'],
      benefits: ['Stipend', 'Mentorship', 'Potential full-time offer', 'Flexible schedule'],
      companyId: companies[1].id,
      city: 'Austin',
      state: 'TX',
      salaryMin: 20000,
      salaryMax: 30000,
      jobType: 'INTERNSHIP' as const,
      workModel: 'ON_SITE' as const,
      experienceLevel: 'ENTRY' as const,
      skills: ['Marketing', 'Social Media', 'Content Creation'],
      industry: 'Finance',
    },
    {
      title: 'Construction Project Manager',
      slug: 'construction-pm-1',
      description: 'Oversee sustainable commercial construction projects from planning through completion. You will manage budgets, timelines, and coordinate with subcontractors and clients.\n\nWe specialize in LEED-certified buildings and value environmental responsibility.',
      requirements: ['PMP certification', '5+ years in construction management', 'Knowledge of LEED standards', 'Budget management experience', 'Strong leadership skills'],
      responsibilities: ['Manage project timelines and budgets', 'Coordinate with subcontractors', 'Ensure safety compliance', 'Report to stakeholders', 'Manage project documentation'],
      benefits: ['Company vehicle', 'Health insurance', '401k match', 'Performance bonus'],
      companyId: companies[3].id,
      city: 'Portland',
      state: 'OR',
      salaryMin: 85000,
      salaryMax: 120000,
      jobType: 'FULL_TIME' as const,
      workModel: 'ON_SITE' as const,
      experienceLevel: 'SENIOR' as const,
      skills: ['Project Management', 'Construction', 'LEED', 'Budgeting'],
      industry: 'Construction',
      isExclusive: true,
    },
    {
      title: 'Freelance UX Designer',
      slug: 'freelance-ux-designer-1',
      description: 'We need a talented UX designer for a 3-month project to redesign our customer onboarding flow. You will conduct user research, create wireframes, and deliver high-fidelity designs.\n\nThis is a remote freelance position with potential for extension.',
      requirements: ['Portfolio demonstrating UX design work', 'Proficiency in Figma', 'Experience with user research methods', 'Understanding of accessibility standards', 'Strong communication skills'],
      responsibilities: ['Conduct user research and interviews', 'Create user flows and wireframes', 'Design high-fidelity mockups', 'Create interactive prototypes', 'Collaborate with development team'],
      benefits: ['Flexible hours', 'Remote work', 'Competitive hourly rate'],
      companyId: companies[1].id,
      city: 'Austin',
      state: 'TX',
      salaryMin: 60000,
      salaryMax: 90000,
      jobType: 'FREELANCE' as const,
      workModel: 'REMOTE' as const,
      experienceLevel: 'MID' as const,
      skills: ['UX Design', 'Figma', 'User Research', 'Prototyping'],
      industry: 'Finance',
    },
  ];

  for (const data of jobData) {
    await prisma.job.create({
      data: {
        ...data,
        publishedAt: new Date(),
        viewsCount: Math.floor(Math.random() * 500) + 50,
        applicationsCount: Math.floor(Math.random() * 30),
      },
    });
  }

  // Create some applications
  const jobs = await prisma.job.findMany({ take: 5 });

  for (const job of jobs) {
    for (const seeker of seekers) {
      const statuses = ['PENDING', 'REVIEWED', 'INTERVIEW', 'PENDING'];
      await prisma.application.create({
        data: {
          userId: seeker.id,
          jobId: job.id,
          status: statuses[Math.floor(Math.random() * statuses.length)] as any,
          coverLetter: 'I am very interested in this position and believe my skills align well with your requirements.',
          isPriority: Math.random() > 0.5,
        },
      });
    }
  }

  // Create company reviews
  for (const company of companies) {
    for (let i = 0; i < 3; i++) {
      const seeker = seekers[i % seekers.length];
      await prisma.companyReview.create({
        data: {
          userId: seeker.id,
          companyId: company.id,
          rating: Math.floor(Math.random() * 2) + 4,
          title: ['Great place to work', 'Excellent culture', 'Good growth opportunities'][i],
          pros: ['Great team, good benefits, interesting work',
                 'Flexible hours, competitive pay, modern tech stack',
                 'Learning opportunities, supportive management'][i],
          cons: ['Fast-paced environment can be stressful',
                 'Communication between teams could be better',
                 'Office could be bigger'][i],
          isApproved: true,
        },
      });
    }
  }

  // Create saved jobs
  for (const seeker of seekers) {
    for (const job of jobs.slice(0, 2)) {
      await prisma.savedJob.create({
        data: { userId: seeker.id, jobId: job.id },
      }).catch(() => {});
    }
  }

  // Create messages
  await prisma.message.createMany({
    data: [
      { senderId: employers[0].id, receiverId: seekers[0].id, content: "Hi Alice! We were impressed by your profile and would love to chat about the Senior Frontend Engineer role. Are you available for a call this week?" },
      { senderId: seekers[0].id, receiverId: employers[0].id, content: "Thank you for reaching out! I would love to learn more about the opportunity. I am available Thursday or Friday afternoon." },
      { senderId: employers[0].id, receiverId: seekers[0].id, content: "Perfect! How about Thursday at 2pm PST? I will send over a calendar invite." },
      { senderId: recruiter.id, receiverId: seekers[1].id, content: "Hi Bob! I came across your profile and have a few data analyst positions that might interest you. Would you be open to hearing about them?" },
    ],
  });

  // Create payments
  await prisma.payment.createMany({
    data: [
      { userId: seekers[0].id, stripePaymentId: 'pi_demo_1', amount: 999, status: 'succeeded', description: 'Premium subscription - Monthly' },
      { userId: seekers[2].id, stripePaymentId: 'pi_demo_2', amount: 999, status: 'succeeded', description: 'Premium subscription - Monthly' },
      { userId: employers[0].id, stripePaymentId: 'pi_demo_3', amount: 4999, status: 'succeeded', description: 'Employer plan - Monthly' },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('\n--- Demo Accounts ---');
  console.log('Admin:     admin@jobmarket.com / password123');
  console.log('Seeker:    alice@example.com / password123 (Premium)');
  console.log('Seeker:    bob@example.com / password123 (Free)');
  console.log('Employer:  hr@techcorp.com / password123');
  console.log('Recruiter: recruiter@talentfind.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
