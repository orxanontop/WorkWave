'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { JOB_TYPES, WORK_MODELS } from '@/lib/constants';

export default function SavedJobsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') fetchSaved();
  }, [status]);

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/saved?limit=50');
      const data = await res.json();
      if (data.success) setSaved(data.data.savedJobs);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const unsave = async (jobId: string) => {
    try {
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      setSaved(s => s.filter(item => item.job.id !== jobId));
      toast.success('Job removed from saved');
    } catch (err) { toast.error('Failed to remove'); }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const f = (n: number) => `$${(n/1000).toFixed(0)}k`;
    if (min && max) return `${f(min)} - ${f(max)}`;
    if (min) return `From ${f(min)}`;
    return `Up to ${f(max!)}`;
  };

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
      <p className="text-gray-500 mb-8">{saved.length} saved jobs</p>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-6"><div className="skeleton h-6 w-1/3"/></div>)}</div>
      ) : saved.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <h3 className="font-semibold text-gray-900 mb-1">No saved jobs</h3>
          <p className="text-sm text-gray-500 mb-4">Save jobs to review them later</p>
          <Link href="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map(({ job, createdAt }) => (
            <div key={job.id} className="card-hover p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {job.company?.logo ? <img src={job.company.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-lg font-bold text-gray-400">{job.company?.name?.[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/jobs/${job.id}`} className="font-semibold text-gray-900 hover:text-primary-600">{job.title}</Link>
                  <p className="text-sm text-gray-500">{job.company?.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                    {job.city && <span>{job.city}{job.state ? `, ${job.state}` : ''}</span>}
                    {formatSalary(job.salaryMin, job.salaryMax) && <span className="text-green-600 font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</span>}
                    <span className="badge badge-gray">{JOB_TYPES.find(t => t.value === job.jobType)?.label}</span>
                  </div>
                </div>
                <button onClick={() => unsave(job.id)} className="btn btn-ghost btn-sm text-red-500 hover:text-red-700">
                  <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
