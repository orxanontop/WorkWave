# JobMarket - Hyper-Local Job Marketplace

A production-ready, mobile-first job marketplace with freemium and subscription features.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | NextAuth.js (JWT + OAuth) |
| Payments | Stripe (subscriptions + checkout) |
| Deployment | Docker, Docker Compose |

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> && cd jobmarket
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Start with Docker

```bash
docker-compose up -d
```

### 4. Setup Database

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jobmarket.com | password123 |
| Seeker (Premium) | alice@example.com | password123 |
| Seeker (Free) | bob@example.com | password123 |
| Employer | hr@techcorp.com | password123 |
| Recruiter | recruiter@talentfind.com | password123 |

## Project Structure

```
jobmarket/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Auth endpoints
│   │   │   ├── jobs/          # Jobs CRUD + apply
│   │   │   ├── applications/  # Application tracking
│   │   │   ├── profile/       # User profile
│   │   │   ├── companies/     # Company profiles
│   │   │   ├── messages/      # Direct messaging
│   │   │   ├── subscriptions/ # Stripe integration
│   │   │   ├── saved/         # Saved jobs
│   │   │   └── admin/         # Admin endpoints
│   │   ├── auth/              # Auth pages
│   │   ├── jobs/              # Job listing & detail
│   │   ├── dashboard/         # User dashboard
│   │   ├── companies/         # Company pages
│   │   ├── admin/             # Admin panel
│   │   └── pricing/           # Pricing page
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── ui/                # Reusable UI
│   │   ├── jobs/              # Job components
│   │   ├── dashboard/         # Dashboard components
│   │   └── admin/             # Admin components
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       ├── api.ts             # API helpers (auth, rate limit, pagination)
│       ├── auth.ts            # NextAuth configuration
│       ├── prisma.ts          # Prisma client singleton
│       ├── stripe.ts          # Stripe helpers + plans
│       ├── validations.ts     # Zod schemas
│       ├── constants.ts       # App constants
│       └── store.ts           # Zustand store
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Jobs
- `GET /api/jobs` - List jobs (filter, search, paginate)
- `POST /api/jobs` - Create job (employer only)
- `GET /api/jobs/[id]` - Get job details
- `PATCH /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Deactivate job
- `POST /api/jobs/[id]/apply` - Apply to job

### Applications
- `GET /api/applications` - List user applications
- `GET /api/applications/[id]` - Get application detail
- `PATCH /api/applications/[id]` - Update application status

### Profile
- `GET /api/profile` - Get current user profile
- `PATCH /api/profile` - Update profile

### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/companies/[id]` - Company detail + jobs + reviews

### Messages
- `GET /api/messages` - List conversations
- `GET /api/messages?with=[userId]` - Get conversation messages
- `POST /api/messages` - Send message

### Subscriptions
- `GET /api/subscriptions` - Get subscription info
- `POST /api/subscriptions` - Create checkout session or portal
- `POST /api/subscriptions/webhook` - Stripe webhook handler

### Saved Jobs
- `GET /api/saved` - List saved jobs
- `POST /api/saved` - Toggle save/unsave

### Admin
- `GET /api/admin/stats` - Platform analytics
- `GET/PATCH /api/admin/users` - Manage users
- `GET/PATCH /api/admin/jobs` - Manage jobs

## Business Logic

- Free users: 5 applications/month
- Premium users ($9.99/mo): Unlimited applications + priority ranking
- Exclusive jobs visible only to premium users
- Featured jobs appear at top of listings
- Premium applications sorted first in employer dashboard
- Rate limiting on all API endpoints
- Role-based access control (Job Seeker, Employer, Admin, Recruiter)

## Deployment

```bash
# Production build
docker-compose up -d --build

# Or deploy to Vercel
vercel deploy
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to DB
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
```

## Architecture Decisions

1. **Next.js App Router** - Server components for performance, client components for interactivity
2. **Prisma** - Type-safe database queries with migrations
3. **NextAuth.js** - Handles credentials + OAuth with JWT sessions
4. **Stripe** - Subscription management with webhook handling
5. **Zustand** - Lightweight state management for client state
6. **Zod** - Runtime validation for API inputs
7. **In-memory rate limiting** - Works for single-instance; swap for Redis in production cluster
