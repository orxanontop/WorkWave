'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { JOB_TYPES, WORK_MODELS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

export default function CompanyDetailClient({ id }: { id: string }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`/api/companies/${id}`);
        const data = await res.json();
        if (data.success) setCompany(data.data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    }
    fetchCompany();
  }, [id]);

  if (isLoading) return (
    <div className="container-app py-8">
      <div className="skeleton h-8 w-64 mb-4" />
      <div className="skeleton h-32 w-full" />
    </div>
  );

  if (!company) return (
    <div className="container-app py-8 text-center">
      <p className="text-gray-500">{t('jobDetail.companyNotFound') as string}</p>
    </div>
  );

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const f = (n: number) => `$${(n/1000).toFixed(0)}k`;
    return min && max ? `${f(min)}-${f(max)}` : min ? `From ${f(min)}` : `Up to ${f(max!)}`;
  };

  return (
    <div className={mounted ? 'animate-slide-up' : 'opacity-0'}>
      <div className="container-app py-8">
        <div className="card p-6 sm:p-8 mb-8 animate-slide-up stagger-1 opacity-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              {company.logo
                ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                : <span className="text-3xl font-bold text-gray-400">{company.name[0]}</span>}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{company.name}</h1>
                {company.isVerified && (
                  <span className="badge badge-success">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('jobDetail.verified') as string}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {company.industry && <span>{company.industry}</span>}
                {company.city && <span>{company.city}{company.state ? `, ${company.state}` : ''}</span>}
                {company.size && <span>{company.size} {t('jobDetail.employees') as string}</span>}
                {company.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {company.rating.toFixed(1)} ({company.reviewCount} reviews)
                  </span>
                )}
              </div>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  {company.website}
                </a>
              )}
            </div>
          </div>
          {company.description && <p className="text-gray-600 mt-6 leading-relaxed">{company.description}</p>}
          {company.benefits?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {company.benefits.map((b: string) => <span key={b} className="badge badge-gray">{b}</span>)}
            </div>
          )}
        </div>

        {/* Jobs */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('jobDetail.openPositions') as string} ({company._count?.jobs || 0})</h2>
        {company.jobs?.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">{t('jobDetail.noPositions') as string}</div>
        ) : (
          <div className="space-y-3 mb-8">
            {company.jobs?.map((job: any) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="card-hover p-5 block">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      {job.city && <span>{job.city}</span>}
                      <span className="badge badge-gray text-xs">{JOB_TYPES.find(jt => jt.value === job.jobType)?.label}</span>
                      <span className="badge badge-gray text-xs">{WORK_MODELS.find(m => m.value === job.workModel)?.label}</span>
                      {formatSalary(job.salaryMin, job.salaryMax) && <span className="text-green-600 font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Reviews */}
        {company.reviews?.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">{t('jobDetail.reviews') as string} ({company.reviewCount})</h2>
            <div className="space-y-4">
              {company.reviews.map((review: any) => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{review.title}</span>
                  </div>
                  {review.pros && <p className="text-sm text-green-600 mb-1"><strong>{t('jobDetail.pros') as string}:</strong> {review.pros}</p>}
                  {review.cons && <p className="text-sm text-red-500"><strong>{t('jobDetail.cons') as string}:</strong> {review.cons}</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
