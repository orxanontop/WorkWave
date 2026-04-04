import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireRole } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, ['ADMIN']);
  if (error) return error;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsThisMonth,
      premiumUsers,
      totalCompanies,
      revenueData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      prisma.company.count(),
      prisma.payment.aggregate({
        where: { status: 'succeeded' },
        _sum: { amount: true },
      }),
    ]);

    // User growth (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await prisma.user.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      });
      userGrowth.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count,
      });
    }

    // Jobs by type
    const jobsByType = await prisma.job.groupBy({
      by: ['jobType'],
      where: { isActive: true },
      _count: true,
    });

    // Applications by status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: true,
    });

    return apiResponse({
      overview: {
        totalUsers,
        newUsersThisMonth,
        userGrowthPercent: newUsersLastMonth > 0
          ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
          : 0,
        totalJobs,
        activeJobs,
        totalApplications,
        applicationsThisMonth,
        premiumUsers,
        totalCompanies,
        totalRevenue: (revenueData._sum.amount || 0) / 100,
      },
      charts: {
        userGrowth,
        jobsByType: jobsByType.map((j) => ({ type: j.jobType, count: j._count })),
        applicationsByStatus: applicationsByStatus.map((a) => ({
          status: a.status,
          count: a._count,
        })),
      },
    });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch admin stats');
    return apiError('Failed to fetch admin stats', 500, 'INTERNAL_ERROR');
  }
}
