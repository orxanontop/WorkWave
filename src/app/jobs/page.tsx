'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { JOB_TYPES, WORK_MODELS, EXPERIENCE_LEVELS, INDUSTRIES, SALARY_RANGES } from '@/lib/constants';

interface Job {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  state: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  jobType: string;
  workModel: string;
  experienceLevel: string;
  skills: string[];
  isFeatured: boolean;
  isExclusive: boolean;
  isUrgent: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
    rating: number;
  };
}

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    jobType: searchParams.get('jobType')?.split(',').filter(Boolean) || [],
    workModel: searchParams.get('workModel')?.split(',').filter(Boolean) || [],
    experienceLevel: searchParams.get('experienceLevel')?.split(',').filter(Boolean) || [],
    salaryMin: searchParams.get('salaryMin') || '',
    industry: searchParams.get('industry') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.city) params.set('city', filters.city);
    if (filters.jobType.length) params.set('jobType', filters.jobType.join(','));
    if (filters.workModel.length) params.set('workModel', filters.workModel.join(','));
    if (filters.experienceLevel.length) params.set('experienceLevel', filters.experienceLevel.join(','));
    if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
    if (filters.industry) params.set('industry', filters.industry);
    params.set('sort', filters.sort);
    params.set('page', page.toString());
    params.set('limit', '20');

    try {
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data.jobs);
        setTotal(data.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleFilter = (key: 'jobType' | 'workModel' | 'experienceLevel', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
    setPage(1);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FULL_TIME: 'badge-primary',
      PART_TIME: 'badge-warning',
      CONTRACT: 'badge-gray',
      INTERNSHIP: 'badge-success',
      FREELANCE: 'badge-gray',
    };
    return colors[type] || 'badge-gray';
  };

  return (
    <div className="container-app py-8">
      {/* Search bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
              className="input pl-10"
            />
          </div>
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <input
              type="text"
              placeholder="City or zip code"
              value={filters.city}
              onChange={(e) => { setFilters({ ...filters, city: e.target.value }); setPage(1); }}
              className="input pl-10"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary sm:w-auto">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-slide-down">
            {/* Job Type */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Job Type</p>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleFilter('jobType', type.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      filters.jobType.includes(type.value)
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Model */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Work Model</p>
              <div className="flex flex-wrap gap-2">
                {WORK_MODELS.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => toggleFilter('workModel', model.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      filters.workModel.includes(model.value)
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {model.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level & Industry */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Experience Level</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => toggleFilter('experienceLevel', level.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        filters.experienceLevel.includes(level.value)
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => { setFilters({ ...filters, industry: e.target.value }); setPage(1); }}
                  className="input"
                >
                  <option value="">All Industries</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {isLoading ? 'Searching...' : `${total} jobs found`}
        </p>
        <select
          value={filters.sort}
          onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }}
          className="input w-auto text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="salary_high">Highest Salary</option>
          <option value="salary_low">Lowest Salary</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Job listings */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-1/3 mb-3" />
              <div className="skeleton h-4 w-1/2 mb-2" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))
        ) : jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block">
              <div className={`card-hover p-6 ${job.isFeatured ? 'border-l-4 border-l-primary-500' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Company logo */}
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {job.company.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">{job.company.name[0]}</span>
                    )}
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {job.title}
                          {job.isFeatured && (
                            <span className="ml-2 badge badge-premium text-xs">Featured</span>
                          )}
                          {job.isExclusive && (
                            <span className="ml-2 badge badge-accent text-xs">Premium</span>
                          )}
                          {job.isUrgent && (
                            <span className="ml-2 badge badge-danger text-xs">Urgent</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                      {job.city && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {job.city}{job.state ? `, ${job.state}` : ''}
                        </span>
                      )}
                      {formatSalary(job.salaryMin, job.salaryMax) && (
                        <span className="flex items-center gap-1 font-medium text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                      <span className={`badge ${getJobTypeColor(job.jobType)}`}>
                        {JOB_TYPES.find((t) => t.value === job.jobType)?.label}
                      </span>
                      <span className="badge badge-gray">
                        {WORK_MODELS.find((m) => m.value === job.workModel)?.label}
                      </span>
                    </div>

                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 5).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">+{job.skills.length - 5} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-xs text-gray-400 shrink-0">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary btn-sm"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="btn btn-secondary btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
