'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [employerNotes, setEmployerNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const userRole = (session?.user as any)?.role;
  const isEmployer = ['EMPLOYER', 'RECRUITER', 'ADMIN'].includes(userRole);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return; }
    if (status === 'authenticated') fetchApplication();
  }, [status, id]);

  const fetchApplication = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.success) {
        setApplication(data.data);
        setSelectedStatus(data.data.status);
        setEmployerNotes(data.data.employerNotes || '');
        if (data.data.interviewDate) {
          setInterviewDate(new Date(data.data.interviewDate).toISOString().slice(0, 16));
        }
      } else {
        router.push('/dashboard/applications');
      }
    } catch (err) {
      router.push('/dashboard/applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!isEmployer) return;
    setIsUpdating(true);
    try {
      const body: any = { status: selectedStatus };
      if (employerNotes.trim()) body.employerNotes = employerNotes.trim();
      if (interviewDate) body.interviewDate = new Date(interviewDate).toISOString();

      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('applications.statusUpdated') as string);
        fetchApplication();
      } else {
        toast.error(data.error || t('applications.updateFailed') as string);
      }
    } catch (err) {
      toast.error(t('applications.updateFailed') as string);
    } finally {
      setIsUpdating(false);
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

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="skeleton h-8 w-1/3" />
          <div className="card p-6 space-y-4">
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const applicantName = application.user?.profile
    ? `${application.user.profile.firstName} ${application.user.profile.lastName}`
    : application.user?.email || 'Unknown';

  return (
    <div className={`container-app py-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/applications" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('applications.backToApplications')}
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{applicantName}</h1>
            <p className="text-gray-500 mt-1">
              {application.user?.profile?.headline || application.user?.email}
            </p>
          </div>
          <span className={`badge ${getStatusBadge(application.status)} text-sm`}>
            {APPLICATION_STATUSES.find(s => s.value === application.status)?.label || application.status}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('applications.applicantInfo')}</h2>
              <dl className="space-y-3">
                {application.user?.profile?.email && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.email')}</dt>
                    <dd className="text-sm text-gray-900">{application.user.profile.email}</dd>
                  </div>
                )}
                {application.user?.profile?.phone && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.phone')}</dt>
                    <dd className="text-sm text-gray-900">{application.user.profile.phone}</dd>
                  </div>
                )}
                {application.user?.profile?.location && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.location')}</dt>
                    <dd className="text-sm text-gray-900">{application.user.profile.location}</dd>
                  </div>
                )}
                {application.user?.profile?.experienceYears !== undefined && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.experience')}</dt>
                    <dd className="text-sm text-gray-900">{application.user.profile.experienceYears} {t('applications.years')}</dd>
                  </div>
                )}
                {application.user?.profile?.experienceLevel && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.experienceLevel')}</dt>
                    <dd className="text-sm text-gray-900">{application.user.profile.experienceLevel}</dd>
                  </div>
                )}
                {application.user?.profile?.resumeUrl && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.resume')}</dt>
                    <dd className="text-sm">
                      <a href={application.user.profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">
                        {application.user.profile.resumeFileName || t('applications.downloadResume')}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {application.user?.profile?.skills?.length > 0 && (
                <div className="mt-4">
                  <dt className="text-xs text-gray-500 uppercase mb-2">{t('applications.skills')}</dt>
                  <div className="flex flex-wrap gap-2">
                    {application.user.profile.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {application.user?.profile?.bio && (
                <div className="mt-4">
                  <dt className="text-xs text-gray-500 uppercase mb-2">{t('applications.about')}</dt>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.user.profile.bio}</p>
                </div>
              )}

              {(application.user?.profile?.linkedinUrl || application.user?.profile?.portfolioUrl || application.user?.profile?.githubUrl) && (
                <div className="mt-4 flex gap-3">
                  {application.user.profile.linkedinUrl && (
                    <a href={application.user.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700">
                      LinkedIn
                    </a>
                  )}
                  {application.user.profile.portfolioUrl && (
                    <a href={application.user.profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700">
                      Portfolio
                    </a>
                  )}
                  {application.user.profile.githubUrl && (
                    <a href={application.user.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700">
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('applications.coverLetter')}</h2>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            )}

            {/* Job Details */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('applications.jobDetails')}</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500 uppercase">{t('applications.jobTitle')}</dt>
                  <dd className="text-sm text-gray-900">
                    <Link href={`/jobs/${application.job.id}`} className="text-primary-600 hover:text-primary-700">
                      {application.job.title}
                    </Link>
                  </dd>
                </div>
                {application.job.company && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.company')}</dt>
                    <dd className="text-sm text-gray-900">{application.job.company.name}</dd>
                  </div>
                )}
                {application.job.city && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.location')}</dt>
                    <dd className="text-sm text-gray-900">{application.job.city}{application.job.state ? `, ${application.job.state}` : ''}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-500 uppercase">{t('applications.appliedOn')}</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </dd>
                </div>
                {application.salaryExpectation && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.salaryExpectation')}</dt>
                    <dd className="text-sm text-gray-900">${application.salaryExpectation.toLocaleString()}/year</dd>
                  </div>
                )}
                {application.availableFrom && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">{t('applications.availableFrom')}</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(application.availableFrom).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isEmployer && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('applications.manageApplication')}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="label">{t('applications.status')}</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="input"
                    >
                      {APPLICATION_STATUSES.filter(s => s.value !== 'WITHDRAWN').map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">{t('applications.interviewDate')}</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">{t('applications.employerNotes')}</label>
                    <textarea
                      value={employerNotes}
                      onChange={(e) => setEmployerNotes(e.target.value)}
                      className="input min-h-[100px]"
                      placeholder={t('applications.notesPlaceholder') as string}
                    />
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="btn btn-primary w-full"
                  >
                    {isUpdating ? t('applications.updating') : t('applications.updateApplication')}
                  </button>
                </div>
              </div>
            )}

            {/* Application Timeline */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('applications.timeline')}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                  <div>
                    <p className="text-sm text-gray-900">{t('applications.applied')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {application.interviewDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                    <div>
                      <p className="text-sm text-gray-900">{t('applications.interviewScheduled')}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.interviewDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    application.status === 'REJECTED' ? 'bg-red-500' :
                    application.status === 'OFFERED' ? 'bg-green-500' :
                    'bg-gray-300'
                  }`} />
                  <div>
                    <p className="text-sm text-gray-900">{APPLICATION_STATUSES.find(s => s.value === application.status)?.label}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
