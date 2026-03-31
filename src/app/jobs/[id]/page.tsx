'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { JOB_TYPES, WORK_MODELS, EXPERIENCE_LEVELS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useI18n();
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
        toast.success(String(t('jobDetail.toasts.applied')));
        setJob({ ...job, hasApplied: true });
        setShowApplyModal(false);
      } else {
        toast.error(data.error || String(t('jobDetail.toasts.failed')));
      }
    } catch (err) {
      toast.error(String(t('jobDetail.toasts.failed')));
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
        toast.success(data.data.saved ? String(t('jobDetail.toasts.saved')) : String(t('jobDetail.toasts.unsaved')));
      }
    } catch (err) {
      toast.error(String(t('jobDetail.toasts.saveFailed')));
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return String(t('jobDetail.notSpecified'));
    const fmt = (n: number) => `$${n.toLocaleString()}`;
    if (min && max) return `${fmt(min)} - ${fmt(max)} ${t('jobDetail.perYear')}`;
    if (min) return `From ${fmt(min)} ${t('jobDetail.perYear')}`;
    return `Up to ${fmt(max!)} ${t('jobDetail.perYear')}`;
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
          {t('jobDetail.backToJobs')}
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
                {job.isFeatured && <span className="badge badge-premium">{t('jobDetail.badges.featured')}</span>}
                {job.isExclusive && <span className="badge badge-accent">{t('jobDetail.badges.premium')}</span>}
                {job.isUrgent && <span className="badge badge-danger">{t('jobDetail.badges.urgent')}</span>}
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
                {t('jobDetail.applied')}
              </div>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn btn-primary btn-lg"
              >
                {t('jobDetail.applyNow')}
              </button>
            )}
            <button onClick={handleSave} className="btn btn-secondary">
              <svg className="w-5 h-5 mr-2" fill={job.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {job.isSaved ? t('jobDetail.saved') : t('jobDetail.save')}
            </button>
            <button className="btn btn-ghost">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t('jobDetail.share')}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('jobDetail.aboutRole')}</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('jobDetail.requirements')}</h2>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('jobDetail.responsibilities')}</h2>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('jobDetail.skills')}</h2>
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
              <h3 className="font-semibold text-gray-900 mb-4">{t('jobDetail.jobDetails')}</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">{t('jobDetail.salary')}</dt>
                  <dd className="text-sm font-semibold text-green-600 mt-0.5">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">{t('jobDetail.jobType')}</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {JOB_TYPES.find((t) => t.value === job.jobType)?.label}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">{t('jobDetail.workModel')}</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {WORK_MODELS.find((m) => m.value === job.workModel)?.label}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">{t('jobDetail.experience')}</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">
                    {EXPERIENCE_LEVELS.find((l) => l.value === job.experienceLevel)?.label}
                  </dd>
                </div>
                {job.industry && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">{t('jobDetail.industry')}</dt>
                    <dd className="text-sm text-gray-900 mt-0.5">{job.industry}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">{t('jobDetail.posted')}</dt>
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
                <h3 className="font-semibold text-gray-900 mb-4">{t('jobDetail.benefits')}</h3>
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
              <h3 className="font-semibold text-gray-900 mb-4">{`${t('jobDetail.about')} ${job.company.name}`}</h3>
              {job.company.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{job.company.description}</p>
              )}
              <Link href={`/companies/${job.company.id}`} className="btn btn-secondary w-full text-sm">
                {t('jobDetail.viewCompany')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-6 sm:p-8 max-w-lg w-full animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('jobDetail.applyModal.title')} {job.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{t('jobDetail.applyModal.at')} {job.company.name}</p>

            <div className="mb-6">
              <label className="label">{t('jobDetail.applyModal.coverLetter')}</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="input min-h-[120px]"
                placeholder={String(t('jobDetail.applyModal.coverLetterPlaceholder'))}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn btn-primary flex-1"
              >
                {applying ? t('jobDetail.applyModal.submitting') : t('jobDetail.applyModal.submit')}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn btn-secondary"
              >
                {t('jobDetail.applyModal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
