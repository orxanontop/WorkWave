'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { APPLICATION_STATUSES, JOB_TYPES } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  const userRole = (session?.user as any)?.role;
  const isEmployer = ['EMPLOYER', 'RECRUITER', 'ADMIN'].includes(userRole);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') fetchApplications();
  }, [status, filter, page]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showStatusDropdown && !(e.target as HTMLElement).closest('[data-status-dropdown]')) {
        setShowStatusDropdown(null);
      }
    }
    if (showStatusDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStatusDropdown]);

  const fetchApplications = async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: '10' });
    if (filter !== 'all') params.set('status', filter);

    try {
      const res = await fetch(`/api/applications?${params}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data.applications);
        setTotal(data.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (!confirm(t('applications.confirmWithdraw') as string)) return;
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'WITHDRAWN' }),
      });
      if (res.ok) {
        toast.success(t('applications.withdrawn') as string);
        fetchApplications();
      }
    } catch (err) {
      toast.error(t('applications.withdrawFailed') as string);
    }
  };

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(t('applications.statusUpdated') as string);
        setShowStatusDropdown(null);
        fetchApplications();
      } else {
        const data = await res.json();
        toast.error(data.error || t('applications.updateFailed') as string);
      }
    } catch (err) {
      toast.error(t('applications.updateFailed') as string);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'badge-warning',
      REVIEWED: 'badge-primary',
      SHORTLISTED: 'badge-primary',
      INTERVIEW: 'badge-success',
      OFFERED: 'badge-success',
      REJECTED: 'badge-danger',
      WITHDRAWN: 'badge-gray',
    };
    return map[status] || 'badge-gray';
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'text-yellow-600 bg-yellow-50',
      REVIEWED: 'text-blue-600 bg-blue-50',
      SHORTLISTED: 'text-indigo-600 bg-indigo-50',
      INTERVIEW: 'text-purple-600 bg-purple-50',
      OFFERED: 'text-green-600 bg-green-50',
      REJECTED: 'text-red-600 bg-red-50',
      WITHDRAWN: 'text-gray-500 bg-gray-50',
    };
    return map[status] || 'text-gray-500 bg-gray-50';
  };

  if (isEmployer) {
    return (
      <div className={`container-app py-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('applications.employerTitle')}</h1>
            <p className="text-gray-500 mt-1">{`${total} ${t('applications.employerTotal')}`}</p>
          </div>
          <Link href="/dashboard/post-job" className="btn btn-primary">
            {t('applications.postJob')}
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('applications.pending'), count: applications.filter(a => a.status === 'PENDING').length, color: 'text-yellow-600' },
            { label: t('applications.reviewed'), count: applications.filter(a => a.status === 'REVIEWED').length, color: 'text-blue-600' },
            { label: t('applications.shortlisted'), count: applications.filter(a => a.status === 'SHORTLISTED').length, color: 'text-indigo-600' },
            { label: t('applications.interviews'), count: applications.filter(a => a.status === 'INTERVIEW').length, color: 'text-purple-600' },
          ].map((stat) => (
            <div key={String(stat.label)} className="card p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar">
          {['all', ...APPLICATION_STATUSES.map(s => s.value)].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status === 'all' ? t('applications.all') : APPLICATION_STATUSES.find(s => s.value === status)?.label}
            </button>
          ))}
        </div>

        {/* Applications list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-6 w-1/3 mb-2" />
                <div className="skeleton h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="font-semibold text-gray-900 mb-1">{t('applications.noApps')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('applications.noEmployerApps')}</p>
            <Link href="/dashboard/post-job" className="btn btn-primary btn-sm">{t('applications.postJob')}</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="card-hover p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {app.user?.profile?.image || app.user?.image ? (
                      <img src={app.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {app.user?.profile?.firstName?.[0] || app.user?.email?.[0] || '?'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/dashboard/applications/${app.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                        {app.user?.profile?.firstName} {app.user?.profile?.lastName}
                      </Link>
                      {app.isPriority && <span className="badge badge-premium text-xs">{t('applications.priority')}</span>}
                    </div>
                    <p className="text-sm text-gray-500">{app.user?.profile?.headline || app.user?.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Link href={`/jobs/${app.job.id}`} className="text-sm text-primary-600 hover:text-primary-700">
                        {app.job.title}
                      </Link>
                      {app.user?.profile?.skills?.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {app.user.profile.skills.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{skill}</span>
                          ))}
                          {app.user.profile.skills.length > 3 && (
                            <span className="text-xs text-gray-400">+{app.user.profile.skills.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{t('applications.applied')}{new Date(app.createdAt).toLocaleDateString()}</span>
                      {app.user?.profile?.experienceYears ? (
                        <span>{app.user.profile.experienceYears}y {t('applications.experience')}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative" data-status-dropdown>
                      <button
                        onClick={() => setShowStatusDropdown(showStatusDropdown === app.id ? null : app.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg ${getStatusColor(app.status)}`}
                      >
                        {APPLICATION_STATUSES.find(s => s.value === app.status)?.label || app.status}
                      </button>
                      {showStatusDropdown === app.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                          {APPLICATION_STATUSES.filter(s => s.value !== 'WITHDRAWN').map((status) => (
                            <button
                              key={status.value}
                              onClick={() => handleStatusUpdate(app.id, status.value)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                app.status === status.value ? 'text-primary-600 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {status.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link href={`/dashboard/applications/${app.id}`} className="btn btn-secondary btn-sm">
                      {t('applications.viewDetails')}
                    </Link>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{t('applications.coverLetter')}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                  </div>
                )}

                {app.interviewDate && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-primary-600 font-medium">
                      {t('applications.interview')} {new Date(app.interviewDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 10 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">
              {t('applications.previous')}
            </button>
            <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 10)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} className="btn btn-secondary btn-sm">
              {t('applications.next')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`container-app py-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('applications.title')}</h1>
          <p className="text-gray-500 mt-1">{`${total} ${t('applications.total')}`}</p>
        </div>
        <Link href="/jobs" className="btn btn-primary">
          {t('applications.browseJobs')}
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar">
        {['all', ...APPLICATION_STATUSES.map(s => s.value)].map((status) => (
          <button
            key={status}
            onClick={() => { setFilter(status); setPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status === 'all' ? t('applications.all') : APPLICATION_STATUSES.find(s => s.value === status)?.label}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-1/3 mb-2" />
              <div className="skeleton h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-semibold text-gray-900 mb-1">{t('applications.noApps')}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter !== 'all' ? t('applications.noAppsFiltered') : t('applications.noAppsDesc')}
          </p>
          <Link href="/jobs" className="btn btn-primary btn-sm">{t('applications.browseJobs')}</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card-hover p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {app.job.company?.logo ? (
                    <img src={app.job.company.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">{app.job.company?.name?.[0] || '?'}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/jobs/${app.job.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {app.job.title}
                    </Link>
                    {app.isPriority && <span className="badge badge-premium text-xs">{t('applications.priority')}</span>}
                  </div>
                  <p className="text-sm text-gray-500">{app.job.company?.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    {app.job.city && <span>{app.job.city}{app.job.state ? `, ${app.job.state}` : ''}</span>}
                    <span>{t('applications.applied')}{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusBadge(app.status)}`}>
                    {APPLICATION_STATUSES.find(s => s.value === app.status)?.label || app.status}
                  </span>
                  {app.status === 'PENDING' && (
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                    >
                      {t('applications.withdraw')}
                    </button>
                  )}
                </div>
              </div>

              {app.interviewDate && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-primary-600 font-medium">
                    {`${t('applications.interview')} ${new Date(app.interviewDate).toLocaleString()}`}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">
            {t('applications.previous')}
          </button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 10)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} className="btn btn-secondary btn-sm">
            {t('applications.next')}
          </button>
        </div>
      )}
    </div>
  );
}
