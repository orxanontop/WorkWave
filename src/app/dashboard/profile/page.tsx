'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EXPERIENCE_LEVELS, POPULAR_SKILLS } from '@/lib/constants';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    phone: '',
    city: '',
    state: '',
    skills: [],
    experienceYears: 0,
    experienceLevel: 'ENTRY',
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: '',
    salaryExpectation: null,
    isOpenToWork: true,
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success) {
        setProfile({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          headline: data.data.headline || '',
          bio: data.data.bio || '',
          phone: data.data.phone || '',
          city: data.data.city || '',
          state: data.data.state || '',
          skills: data.data.skills || [],
          experienceYears: data.data.experienceYears || 0,
          experienceLevel: data.data.experienceLevel || 'ENTRY',
          linkedinUrl: data.data.linkedinUrl || '',
          portfolioUrl: data.data.portfolioUrl || '',
          githubUrl: data.data.githubUrl || '',
          salaryExpectation: data.data.salaryExpectation,
          isOpenToWork: data.data.isOpenToWork ?? true,
        });
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s: string) => s !== skill) });
  };

  if (isLoading) {
    return (
      <div className="container-app py-8 max-w-3xl">
        <div className="skeleton h-10 w-48 mb-8" />
        <div className="card p-8 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-500 mt-1">Keep your profile up to date to attract employers</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Headline</label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="input"
                placeholder="e.g. Senior Software Engineer with 5+ years experience"
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="input"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="input"
                placeholder="San Francisco"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                type="text"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="input"
                placeholder="CA"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="input min-h-[150px]"
            placeholder="Tell employers about yourself, your experience, and what you are looking for..."
          />
        </div>

        {/* Experience */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={50}
                value={profile.experienceYears}
                onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value) || 0 })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Experience Level</label>
              <select
                value={profile.experienceLevel}
                onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                className="input"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Salary Expectation (annual)</label>
              <input
                type="number"
                value={profile.salaryExpectation || ''}
                onChange={(e) => setProfile({ ...profile, salaryExpectation: parseInt(e.target.value) || null })}
                className="input"
                placeholder="e.g. 80000"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.isOpenToWork}
                  onChange={(e) => setProfile({ ...profile, isOpenToWork: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Open to work</span>
              </label>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                className="input flex-1"
                placeholder="Type a skill and press Enter"
              />
              <button onClick={() => addSkill(skillInput)} className="btn btn-secondary">Add</button>
            </div>
          </div>

          {/* Popular skills */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.filter(s => !profile.skills.includes(s)).slice(0, 10).map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Selected skills */}
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-primary-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
          <div className="space-y-4">
            <div>
              <label className="label">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="input"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>
            <div>
              <label className="label">Portfolio URL</label>
              <input
                type="url"
                value={profile.portfolioUrl}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                className="input"
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <label className="label">GitHub URL</label>
              <input
                type="url"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="input"
                placeholder="https://github.com/yourname"
              />
            </div>
          </div>
        </div>

        {/* Resume Upload placeholder */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 font-medium">Upload your resume</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, or DOCX up to 5MB</p>
          </div>
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary btn-lg">
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
