'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { APP_NAME } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success(String(t('auth.register.accountCreated')));
        if (form.role === 'EMPLOYER') {
          router.push('/dashboard/post-job');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      toast.error(String(t('common.somethingWrong')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register.title')}</h1>
          <p className="text-gray-500">{t('auth.register.subtitle')}</p>
        </div>

        <div className="card p-8">
          {/* Role selector */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'JOB_SEEKER' })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                form.role === 'JOB_SEEKER'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.register.jobSeeker')}
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'EMPLOYER' })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                form.role === 'EMPLOYER'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.register.employer')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{t('auth.register.firstName')}</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="input"
                  placeholder={String(t('auth.register.firstNamePlaceholder'))}
                  required
                />
              </div>
              <div>
                <label className="label">{t('auth.register.lastName')}</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="input"
                  placeholder={String(t('auth.register.lastNamePlaceholder'))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">{t('auth.register.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder={String(t('auth.register.emailPlaceholder'))}
                required
              />
            </div>

            <div>
              <label className="label">{t('auth.register.password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder={String(t('auth.register.passwordPlaceholder'))}
                minLength={8}
                required
              />
              <p className="mt-1 text-xs text-gray-500">{t('auth.register.minChars')}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full btn-lg"
            >
              {isLoading ? t('auth.register.creatingAccount') : t('auth.register.createAccount')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('auth.register.hasAccount')}{' '}
            <Link href="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">
              {t('auth.register.signIn')}
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-400">
            {t('auth.register.terms')}{' '}
            <Link href="#" className="underline">{t('auth.register.termsOfService')}</Link> {t('auth.register.and')}{' '}
            <Link href="#" className="underline">{t('auth.register.privacyPolicy')}</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
