'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { APP_NAME } from '@/lib/constants';
import { useI18n, Locale, LOCALE_NAMES, LOCALE_FLAGS } from '@/lib/i18n';

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="font-bold text-xl text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.jobs')}
            </Link>
            <Link href="/companies" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.companies')}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.pricing')}
            </Link>
          </div>

          {/* Auth buttons & Language selector */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <span>{LOCALE_FLAGS[locale]}</span>
                <span>{LOCALE_NAMES[locale]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {(['en', 'az', 'ru'] as Locale[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLocale(lang); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        locale === lang ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{LOCALE_FLAGS[lang]}</span>
                      <span>{LOCALE_NAMES[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="btn btn-secondary btn-sm">
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn btn-ghost btn-sm"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost btn-sm">
                  {t('nav.signIn')}
                </Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col gap-2">
              {/* Language Selector Mobile */}
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {t('nav.language')}
                </div>
                <div className="flex gap-2">
                  {(['en', 'az', 'ru'] as Locale[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLocale(lang); setMobileOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        locale === lang ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{LOCALE_FLAGS[lang]}</span>
                      <span>{LOCALE_NAMES[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <hr className="my-2" />
              <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                {t('nav.jobs')}
              </Link>
              <Link href="/companies" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                {t('nav.companies')}
              </Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                {t('nav.pricing')}
              </Link>
              <hr className="my-2" />
              {session ? (
                <>
                  <Link href="/dashboard" className="btn btn-secondary btn-sm w-full" onClick={() => setMobileOpen(false)}>
                    {t('nav.dashboard')}
                  </Link>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }} className="btn btn-ghost btn-sm w-full">
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-ghost btn-sm w-full" onClick={() => setMobileOpen(false)}>
                    {t('nav.signIn')}
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary btn-sm w-full" onClick={() => setMobileOpen(false)}>
                    {t('nav.signUp')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
