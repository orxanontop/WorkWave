'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { JOB_TYPES, WORK_MODELS, EXPERIENCE_LEVELS, INDUSTRIES, POPULAR_SKILLS } from '@/lib/constants';

export default function PostJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompany, setHasCompany] = useState(true);
  const [companyForm, setCompanyForm] = useState({ name: '', description: '', industry: '', city: '', state: '', website: '' });
  const [form, setForm] = useState({
    title: '', description: '', requirements: [''], responsibilities: [''], benefits: [''],
    city: '', state: '', salaryMin: 0, salaryMax: 0, jobType: 'FULL_TIME', workModel: 'ON_SITE',
    experienceLevel: 'MID', skills: [] as string[], industry: '', isExclusive: false,
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') checkCompany();
  }, [status]);

  const checkCompany = async () => {
    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      if (data.success && data.data.companies.length === 0) setHasCompany(false);
    } catch (err) { console.error(err); }
  };

  const createCompany = async () => {
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm),
      });
      const data = await res.json();
      if (res.ok) { setHasCompany(true); toast.success('Company created!'); }
      else toast.error(data.error || 'Failed to create company');
    } catch (err) { toast.error('Something went wrong'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.filter(r => r.trim()),
          responsibilities: form.responsibilities.filter(r => r.trim()),
          benefits: form.benefits.filter(b => b.trim()),
          salaryMin: form.salaryMin || undefined,
          salaryMax: form.salaryMax || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('Job posted!'); router.push(`/jobs/${data.data.id}`); }
      else toast.error(data.error || 'Failed to post job');
    } catch (err) { toast.error('Something went wrong'); }
    finally { setIsLoading(false); }
  };

  const addListItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const updateListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    const list = [...form[field]];
    list[index] = value;
    setForm({ ...form, [field]: list });
  };

  const removeListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  if (!hasCompany) {
    return (
      <div className="container-app py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Company Profile</h1>
        <p className="text-gray-500 mb-8">You need a company profile before posting jobs</p>
        <div className="card p-6 sm:p-8 space-y-4">
          <div>
            <label className="label">Company Name *</label>
            <input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={companyForm.description} onChange={e => setCompanyForm({...companyForm, description: e.target.value})} className="input min-h-[100px]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Industry</label>
              <select value={companyForm.industry} onChange={e => setCompanyForm({...companyForm, industry: e.target.value})} className="input">
                <option value="">Select</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Website</label>
              <input type="url" value={companyForm.website} onChange={e => setCompanyForm({...companyForm, website: e.target.value})} className="input" placeholder="https://" />
            </div>
            <div>
              <label className="label">City</label>
              <input type="text" value={companyForm.city} onChange={e => setCompanyForm({...companyForm, city: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">State</label>
              <input type="text" value={companyForm.state} onChange={e => setCompanyForm({...companyForm, state: e.target.value})} className="input" />
            </div>
          </div>
          <button onClick={createCompany} className="btn btn-primary w-full btn-lg">Create Company</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a Job</h1>
      <p className="text-gray-500 mb-8">Fill in the details to create a new job listing</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
          <div>
            <label className="label">Job Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="e.g. Senior Software Engineer" required />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input min-h-[200px]" placeholder="Describe the role, team, and what makes this opportunity special..." required minLength={50} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Job Type</label>
              <select value={form.jobType} onChange={e => setForm({...form, jobType: e.target.value})} className="input">
                {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Work Model</label>
              <select value={form.workModel} onChange={e => setForm({...form, workModel: e.target.value})} className="input">
                {WORK_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Experience Level</label>
              <select value={form.experienceLevel} onChange={e => setForm({...form, experienceLevel: e.target.value})} className="input">
                {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Location & Salary</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">City</label><input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input" /></div>
            <div><label className="label">State</label><input type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="input" /></div>
            <div><label className="label">Min Salary (annual)</label><input type="number" value={form.salaryMin || ''} onChange={e => setForm({...form, salaryMin: parseInt(e.target.value) || 0})} className="input" placeholder="e.g. 50000" /></div>
            <div><label className="label">Max Salary (annual)</label><input type="number" value={form.salaryMax || ''} onChange={e => setForm({...form, salaryMax: parseInt(e.target.value) || 0})} className="input" placeholder="e.g. 100000" /></div>
          </div>
        </div>

        {/* Requirements */}
        <div className="card p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          {form.requirements.map((req, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={req} onChange={e => updateListItem('requirements', i, e.target.value)} className="input flex-1" placeholder="e.g. 3+ years of React experience" />
              {form.requirements.length > 1 && <button type="button" onClick={() => removeListItem('requirements', i)} className="btn btn-ghost btn-icon text-red-500">&times;</button>}
            </div>
          ))}
          <button type="button" onClick={() => addListItem('requirements')} className="btn btn-secondary btn-sm">+ Add Requirement</button>
        </div>

        {/* Responsibilities */}
        <div className="card p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Responsibilities</h2>
          {form.responsibilities.map((resp, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={resp} onChange={e => updateListItem('responsibilities', i, e.target.value)} className="input flex-1" placeholder="e.g. Design and implement new features" />
              {form.responsibilities.length > 1 && <button type="button" onClick={() => removeListItem('responsibilities', i)} className="btn btn-ghost btn-icon text-red-500">&times;</button>}
            </div>
          ))}
          <button type="button" onClick={() => addListItem('responsibilities')} className="btn btn-secondary btn-sm">+ Add Responsibility</button>
        </div>

        {/* Benefits */}
        <div className="card p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
          {form.benefits.map((ben, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={ben} onChange={e => updateListItem('benefits', i, e.target.value)} className="input flex-1" placeholder="e.g. Health insurance" />
              {form.benefits.length > 1 && <button type="button" onClick={() => removeListItem('benefits', i)} className="btn btn-ghost btn-icon text-red-500">&times;</button>}
            </div>
          ))}
          <button type="button" onClick={() => addListItem('benefits')} className="btn btn-secondary btn-sm">+ Add Benefit</button>
        </div>

        {/* Skills */}
        <div className="card p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Required Skills</h2>
          <div className="flex gap-2">
            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (skillInput.trim() && !form.skills.includes(skillInput.trim())) { setForm({...form, skills: [...form.skills, skillInput.trim()]}); setSkillInput(''); }}}} className="input flex-1" placeholder="Type a skill and press Enter" />
            <button type="button" onClick={() => { if (skillInput.trim() && !form.skills.includes(skillInput.trim())) { setForm({...form, skills: [...form.skills, skillInput.trim()]}); setSkillInput(''); }}} className="btn btn-secondary">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg">
                {skill}
                <button type="button" onClick={() => setForm({...form, skills: form.skills.filter(s => s !== skill)})} className="hover:text-primary-900">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg">{isLoading ? 'Posting...' : 'Post Job'}</button>
        </div>
      </form>
    </div>
  );
}
