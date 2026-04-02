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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 via-accent-500 to-coral-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/40 group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-bold text-base">J</span>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">{APP_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/jobs', label: t('nav.jobs') },
              { href: '/companies', label: t('nav.companies') },
              { href: '/pricing', label: t('nav.pricing') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-300 rounded-lg hover:bg-primary-50/50"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons & Language selector */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300"
              >
                <span className="text-lg">{LOCALE_FLAGS[locale]}</span>
                <span className="hidden lg:inline">{LOCALE_NAMES[locale]}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-in overflow-hidden">
                  {(['en', 'az', 'ru'] as Locale[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLocale(lang); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                        locale === lang
                          ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{LOCALE_FLAGS[lang]}</span>
                      <span>{LOCALE_NAMES[lang]}</span>
                      {locale === lang && (
                        <svg className="w-4 h-4 ml-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <div className="flex items-center gap-2">
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
                <Link href="/auth/register" className="btn btn-primary btn-sm shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30">
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col gap-2">
              {/* Language Selector Mobile */}
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {String(t('nav.language'))}
                </div>
                <div className="flex gap-2">
                  {(['en', 'az', 'ru'] as Locale[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLocale(lang); setMobileOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
                        locale === lang
                          ? 'bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 font-semibold shadow-sm'
                          : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                      }`}
                    >
                      <span>{LOCALE_FLAGS[lang]}</span>
                      <span>{LOCALE_NAMES[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
              {[
                { href: '/jobs', label: t('nav.jobs'), icon: '💼' },
                { href: '/companies', label: t('nav.companies'), icon: '🏢' },
                { href: '/pricing', label: t('nav.pricing'), icon: '💎' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl flex items-center gap-2 transition-all duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
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
                  <Link href="/auth/register" className="btn btn-primary btn-sm w-full shadow-lg shadow-primary-500/25" onClick={() => setMobileOpen(false)}>
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
