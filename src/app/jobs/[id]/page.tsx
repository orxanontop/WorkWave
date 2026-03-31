'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { JOB_TYPES, WORK_MODELS, EXPERIENCE_LEVELS } from '@/lib/constants';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data);
        } else {
          router.push('/jobs');
        }
      } catch (err) {
        router.push('/jobs');
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [id, router]);

  const handleApply = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverLetter }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Application submitted successfully!');
        setJob({ ...job, hasApplied: true });
        setShowApplyModal(false);
      } else {
        toast.error(data.error || 'Failed to apply');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setJob({ ...job, isSaved: data.data.saved });
        toast.success(data.data.saved ? 'Job saved!' : 'Job unsaved');
      }
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified';
    const fmt = (n: number) => `$${n.toLocaleString()}`;
    if (min && max) return `${fmt(min)} - ${fmt(max)} / year`;
    if (min) return `From ${fmt(min)} / year`;
    return `Up to ${fmt(max!)} / year`;
  };

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-2/3 mb-4" />
          <div className="skeleton h-6 w-1/3 mb-8" />
          <div className="card p-8 space-y-4">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container-app py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to jobs
        </Link>

        {/* Header */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              {job.company.logo ? (
                <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-gray-400">{job.company.name[0]}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {job.isFeatured && <span className="badge badge-premium">Featured</span>}
                {job.isExclusive && <span className="badge badge-accent">Premium Only</span>}
                {job.isUrgent && <span className="badge badge-danger">Urgent</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
              <Link href={`/companies/${job.company.id}`} className="text-lg text-primary-600 hover:text-primary-700 mt-1 block">
                {job.company.name}
              </Link>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                {job.city && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.city}{job.state ? `, ${job.state}` : ''}
                  </span>
                )}
                <span className={`badge ${job.jobType === 'FULL_TIME' ? 'badge-primary' : 'badge-gray'}`}>
                  {JOB_TYPES.find((t) => t.value === job.jobType)?.label}
                </span>
                <span className="badge badge-gray">
                  {WORK_MODELS.find((m) => m.value === job.workModel)?.label}
                </span>
                <span className="badge badge-gray">
                  {EXPERIENCE_LEVELS.find((l) => l.value === job.experienceLevel)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
            {job.hasApplied ? (
              <div className="btn btn-secondary cursor-default">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Applied
              </div>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn btn-primary btn-lg"
              >
                Apply Now
              </button>
            )}
            <button onClick={handleSave} className="btn btn-secondary">
              <svg className="w-5 h-5 mr-2" fill={job.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {job.isSaved ? 'Saved' : 'Save'}
            </button>
            <button className="btn btn-ghost">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About this role</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary & details */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Salary</dt>
                  <dd className="text-sm font-semibold text-green-600 mt-0.5">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Job Type</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {JOB_TYPES.find((t) => t.value === job.jobType)?.label}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Work Model</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {WORK_MODELS.find((m) => m.value === job.workModel)?.label}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Experience</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {EXPERIENCE_LEVELS.find((l) => l.value === job.experienceLevel)?.label}
                  </dd>
                </div>
                {job.industry && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">Industry</dt>
                    <dd className="text-sm text-gray-900 mt-0.5">{job.industry}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Posted</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company card */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">About {job.company.name}</h3>
              {job.company.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{job.company.description}</p>
              )}
              <Link href={`/companies/${job.company.id}`} className="btn btn-secondary w-full text-sm">
                View Company Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-6 sm:p-8 max-w-lg w-full animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Apply to {job.title}</h2>
            <p className="text-sm text-gray-500 mb-6">at {job.company.name}</p>

            <div className="mb-6">
              <label className="label">Cover Letter (optional)</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="input min-h-[120px]"
                placeholder="Tell the employer why you are a great fit..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn btn-primary flex-1"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
