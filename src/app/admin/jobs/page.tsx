'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n';

export default function AdminJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return; }
    if ((session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard'); return; }
  }, [status, session]);

  useEffect(() => {
    if ((session?.user as any)?.role === 'ADMIN') fetchJobs();
  }, [search, page, session]);

  const fetchJobs = async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: '20' });
    if (search) params.set('search', search);
    try {
      const res = await fetch(`/api/admin/jobs?${params}`);
      const data = await res.json();
      if (data.success) { setJobs(data.data.jobs); setTotal(data.data.pagination.total); }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const toggleJob = async (jobId: string, field: 'isActive' | 'isFeatured', current: boolean) => {
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, [field]: !current }),
      });
      if (res.ok) { fetchJobs(); toast.success(String(t('admin.jobs.jobUpdated'))); }
    } catch (err) { toast.error(String(t('admin.jobs.failedToUpdate'))); }
  };

  return (
    <div className="container-app py-8">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">Admin</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">Jobs</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{String(t('admin.jobs.title')).replace('{total}', String(total))}</h1>

      <div className="mb-6">
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder={String(t('admin.jobs.searchPlaceholder'))} className="input max-w-md" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{String(t('admin.jobs.job'))}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{String(t('admin.jobs.company'))}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{String(t('admin.jobs.applications'))}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{String(t('admin.jobs.views'))}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{String(t('admin.jobs.status'))}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{String(t('admin.jobs.actions'))}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [1,2,3,4,5].map(i => <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-5 w-full"/></td></tr>)
              ) : jobs.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">{String(t('admin.jobs.noJobs'))}</td></tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">{job.title}</Link>
                      <div className="flex gap-1 mt-1">
                        {job.isFeatured && <span className="badge badge-premium text-xs">Featured</span>}
                        {job.isExclusive && <span className="badge badge-accent text-xs">Exclusive</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{job.company?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{job._count?.applications || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{job.viewsCount}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${job.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {job.isActive ? String(t('admin.jobs.active')) : String(t('admin.jobs.inactive'))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleJob(job.id, 'isActive', job.isActive)} className={`btn btn-sm ${job.isActive ? 'btn-ghost text-red-600' : 'btn-secondary text-green-600'}`}>
                          {job.isActive ? String(t('admin.jobs.deactivate')) : String(t('admin.jobs.activate'))}
                        </button>
                        <button onClick={() => toggleJob(job.id, 'isFeatured', job.isFeatured)} className={`btn btn-sm ${job.isFeatured ? 'btn-ghost' : 'btn-secondary'}`}>
                          {job.isFeatured ? String(t('admin.jobs.unfeature')) : String(t('admin.jobs.feature'))}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {total > 20 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn btn-secondary btn-sm">{String(t('admin.previous'))}</button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total/20)}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page >= Math.ceil(total/20)} className="btn btn-secondary btn-sm">{String(t('admin.next'))}</button>
        </div>
      )}
    </div>
  );
}
