'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { APPLICATION_STATUSES, JOB_TYPES } from '@/lib/constants';

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') fetchApplications();
  }, [status, filter, page]);

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
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'WITHDRAWN' }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to withdraw');
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'badge-warning',
      REVIEWED: 'badge-primary',
      SHORTLISTED: 'badge-primary',
      INTERVIEW: 'badge-primary',
      OFFERED: 'badge-success',
      REJECTED: 'badge-danger',
      WITHDRAWN: 'badge-gray',
    };
    return map[status] || 'badge-gray';
  };

  return (
    <div className="container-app py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">{total} total applications</p>
        </div>
        <Link href="/jobs" className="btn btn-primary">
          Browse Jobs
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
            {status === 'all' ? 'All' : APPLICATION_STATUSES.find(s => s.value === status)?.label}
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
          <h3 className="font-semibold text-gray-900 mb-1">No applications found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter !== 'all' ? 'No applications with this status' : 'Start applying to jobs to see them here'}
          </p>
          <Link href="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
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
                    {app.isPriority && <span className="badge badge-premium text-xs">Priority</span>}
                  </div>
                  <p className="text-sm text-gray-500">{app.job.company?.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    {app.job.city && <span>{app.job.city}{app.job.state ? `, ${app.job.state}` : ''}</span>}
                    <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
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
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {app.interviewDate && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-primary-600 font-medium">
                    Interview scheduled: {new Date(app.interviewDate).toLocaleString()}
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
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 10)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} className="btn btn-secondary btn-sm">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
