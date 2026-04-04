'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FREE_APPLICATIONS_LIMIT, SUBSCRIPTION_PLANS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

interface DashboardStats {
  applicationCount: number;
  monthlyApplications: number;
  savedJobs: number;
  unreadMessages: number;
  profileViews: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, appsRes, jobsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/applications?limit=5'),
        fetch('/api/jobs?limit=4'),
      ]);

      const [profileData, appsData, jobsData] = await Promise.all([
        profileRes.json(),
        appsRes.json(),
        jobsRes.json(),
      ]);

      if (profileData.success) {
        setStats({
          applicationCount: profileData.data.applicationCount,
          monthlyApplications: profileData.data.monthlyApplications,
          savedJobs: 0,
          unreadMessages: 0,
          profileViews: profileData.data.profileViews || 0,
        });
      }

      if (appsData.success) {
        setRecentApplications(appsData.data.applications);
      }

      if (jobsData.success) {
        setRecommendedJobs(jobsData.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container-app py-8">
        <div className="skeleton h-10 w-64 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isPremium = (session?.user as any)?.subscriptionStatus === 'ACTIVE';
  const userRole = (session?.user as any)?.role;
  const isEmployer = ['EMPLOYER', 'RECRUITER'].includes(userRole);
  const remainingApps = isPremium
    ? t('dashboard.unlimited')
    : Math.max(0, FREE_APPLICATIONS_LIMIT - (stats?.monthlyApplications || 0));

  return (
    <div className={`container-app py-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 animate-pop">
            {(session?.user as any)?.name ? `${t('dashboard.welcomeName')} ${(session?.user as any)?.name}` : t('dashboard.welcome')}
          </h1>
          <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        {!isPremium && userRole === 'JOB_SEEKER' && (
          <Link href="/pricing" className="btn btn-accent">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('dashboard.upgradePremium')}
          </Link>
        )}
        {['EMPLOYER', 'RECRUITER'].includes(userRole) && (
          <Link href="/dashboard/post-job" className="btn btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('dashboard.postJob')}
          </Link>
        )}
      </div>

      {/* Premium banner */}
      {!isPremium && userRole === 'JOB_SEEKER' && (
        <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200 p-6 mb-8 animate-slide-up stagger-2 opacity-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-premium">
                  {typeof remainingApps === 'number' && remainingApps <= 2 ? t('dashboard.runningLow') : t('dashboard.freePlan')}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">
                {typeof remainingApps === 'number'
                  ? `${remainingApps} ${t('dashboard.remainigApps')}`
                  : t('dashboard.unlimitedApps')}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('dashboard.upgradeDesc')}
              </p>
            </div>
            <Link href="/pricing" className="btn btn-primary shrink-0">
              {t('dashboard.upgradePrice')}
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('dashboard.stats.applications'), value: stats?.applicationCount || 0, sub: `${stats?.monthlyApplications || 0} ${t('dashboard.stats.thisMonth')}`, color: 'primary' },
          { label: t('dashboard.stats.remaining'), value: remainingApps, sub: isPremium ? t('dashboard.stats.premiumPlan') : t('dashboard.stats.applicationsLeft'), color: 'green' },
          { label: t('dashboard.stats.profileViews'), value: stats?.profileViews || 0, sub: t('dashboard.stats.totalViews'), color: 'purple' },
          { label: t('dashboard.stats.plan'), value: isPremium ? t('dashboard.premium') : t('dashboard.free'), sub: isPremium ? t('dashboard.stats.active') : t('dashboard.stats.upgradeAvailable'), color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className={`card p-5 animate-slide-up opacity-0`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                <svg className={`w-4 h-4 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                  {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {i === 2 && <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>}
                  {i === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />}
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentApps')}</h2>
            <Link href="/dashboard/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('dashboard.viewAll')}
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="card p-8 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-1">{t('dashboard.noApps')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('dashboard.noAppsDesc')}</p>
              <Link href="/jobs" className="btn btn-primary btn-sm">
                {t('dashboard.browseJobs')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <Link key={app.id} href={`/jobs/${app.job.id}`} className="block">
                  <div className="card-hover p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        {app.job.company?.logo ? (
                          <img src={app.job.company.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-sm font-bold text-gray-400">{app.job.company?.name?.[0] || '?'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{app.job.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{app.job.company?.name}</p>
                      </div>
                      <span className={`badge text-xs ${
                        app.status === 'PENDING' ? 'badge-warning' :
                        app.status === 'INTERVIEW' ? 'badge-primary' :
                        app.status === 'OFFERED' ? 'badge-success' :
                        app.status === 'REJECTED' ? 'badge-danger' :
                        'badge-gray'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recommended */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
            <div className="grid grid-cols-2 gap-3 animate-slide-up stagger-3 opacity-0">
              <Link href="/jobs" className="card-hover p-4 text-center">
                <svg className="w-6 h-6 text-primary-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('dashboard.browseJobs')}</span>
              </Link>
              <Link href="/dashboard/profile" className="card-hover p-4 text-center">
                <svg className="w-6 h-6 text-primary-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('dashboard.editProfile')}</span>
              </Link>
              <Link href="/dashboard/saved" className="card-hover p-4 text-center">
                <svg className="w-6 h-6 text-primary-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('dashboard.savedJobs')}</span>
              </Link>
              <Link href="/dashboard/applications" className="card-hover p-4 text-center">
                <svg className="w-6 h-6 text-primary-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('dashboard.applications')}</span>
              </Link>
            </div>
          </div>

          {/* Recommended jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recommended')}</h2>
              <Link href="/jobs" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                {t('dashboard.viewAll')}
              </Link>
            </div>
            <div className="space-y-3">
              {recommendedJobs.slice(0, 3).map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                  <div className="card-hover p-4">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{job.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{job.company?.name}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      {job.city && <span>{job.city}</span>}
                      {job.salaryMin && (
                        <span className="text-green-600 font-medium">
                          ${(job.salaryMin / 1000).toFixed(0)}k+
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
