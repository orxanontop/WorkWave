'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const { t } = useI18n();

  const heroRef = useInView(0.1);
  const statsRef = useInView(0.2);
  const featuresRef = useInView(0.1);
  const pricingRef = useInView(0.1);
  const ctaRef = useInView(0.1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('city', location);
    router.push(`/jobs?${params.toString()}`);
  };

  const STATS = [
    { label: t('stats.activeJobs'), value: '10,000+', icon: '💼' },
    { label: t('stats.companies'), value: '2,500+', icon: '🏢' },
    { label: t('stats.hiredThisMonth'), value: '850+', icon: '🎯' },
    { label: t('stats.cities'), value: '50+', icon: '📍' },
  ];

  const FEATURES = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: t('features.localSearch.title'),
      description: t('features.localSearch.description'),
      color: 'from-sky-500 to-cyan-500',
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      text: 'text-sky-600 dark:text-sky-400',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('features.oneClick.title'),
      description: t('features.oneClick.description'),
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('features.verified.title'),
      description: t('features.verified.description'),
      color: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      color: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      text: 'text-violet-600 dark:text-violet-400',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: t('features.messaging.title'),
      description: t('features.messaging.description'),
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50 dark:bg-pink-500/10',
      text: 'text-pink-600 dark:text-pink-400',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: t('features.aiTips.title'),
      description: t('features.aiTips.description'),
      color: 'from-indigo-500 to-blue-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef.ref} className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 30%, #8b5cf6 60%, #d946ef 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-400/20 rounded-full blur-3xl animate-float animate-delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-cyan-300/10 rounded-full blur-2xl animate-float animate-delay-300" />
          <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-fuchsia-300/10 rounded-full blur-2xl animate-float animate-delay-700" />
        </div>

        <div className="container-app relative py-20 sm:py-28 lg:py-36">
          <div className={`max-w-3xl mx-auto text-center ${heroRef.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-sm font-medium mb-8 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance leading-tight">
              {t('hero.title')}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 animate-shimmer bg-[length:200%_100%]">
                {t('hero.titleAccent')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-sky-100/90 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-lg rounded-2xl p-2 sm:p-3 shadow-2xl max-w-2xl mx-auto hover:shadow-3xl transition-shadow duration-500 border border-white/30">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative group">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={String(t('hero.searchPlaceholder'))}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                  />
                </div>
                <div className="flex-1 relative group">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={String(t('hero.locationPlaceholder'))}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                  />
                </div>
                <button type="submit" className="btn btn-lg px-8 sm:rounded-xl shadow-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white hover:shadow-2xl hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300">
                  {String(t('hero.search'))}
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className={`mt-8 flex flex-wrap justify-center gap-2 ${heroRef.isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
              {[t('hero.remote'), t('hero.engineering'), t('hero.marketing'), t('hero.design'), t('hero.sales')].map((tag, i) => (
                <Link
                  key={String(tag)}
                  href={`/jobs?search=${tag}`}
                  className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${(i + 3) * 100}ms` }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef.ref} className="border-b border-gray-200 bg-white relative overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-50/50 via-transparent to-violet-50/50 dark:from-sky-500/5 dark:to-violet-500/5" />
        <div className="container-app py-12 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`text-center ${statsRef.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef.ref} className="section bg-gray-50 relative overflow-hidden dark:bg-neutral-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/30 dark:bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-100/30 dark:bg-violet-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="container-app relative">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${featuresRef.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-sm font-semibold mb-4">
              ✨ Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-neutral-100 mb-4 text-balance">
              {t('features.title')}
            </h2>
            <p className="text-lg text-gray-500 dark:text-neutral-400 text-balance">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={String(feature.title)}
                className={`group card-hover p-6 relative overflow-hidden ${featuresRef.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.text} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{String(feature.title)}</h3>
                <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed">{String(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef.ref} className="section bg-white relative overflow-hidden dark:bg-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50/50 via-transparent to-transparent dark:from-sky-500/5" />
        <div className="container-app relative">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${pricingRef.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-4">
              💎 Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-neutral-100 mb-4 text-balance">
              {t('pricing.title')}
            </h2>
            <p className="text-lg text-gray-500 dark:text-neutral-400 text-balance">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`card p-8 relative hover-lift ${pricingRef.isVisible ? 'animate-fade-in-left animate-delay-200' : 'opacity-0'}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">{String(t('pricing.free.name'))}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-neutral-100">$0</span>
              </div>
              <ul className="space-y-4 mb-8">
                {(t('pricing.free.features') as unknown as string[]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-neutral-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn btn-secondary w-full btn-lg hover:scale-105 transition-transform duration-300">
                {String(t('pricing.getStarted'))}
              </Link>
            </div>

            <div className={`card p-8 relative gradient-border shadow-xl shadow-sky-500/10 hover-lift ${pricingRef.isVisible ? 'animate-fade-in-right animate-delay-300' : 'opacity-0'}`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-sky-500 to-violet-500 text-white text-xs font-bold rounded-full shadow-lg shadow-sky-500/30">
                {String(t('pricing.premium.badge'))}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">{String(t('pricing.premium.name'))}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold gradient-text">$9.99</span>
                <span className="text-gray-500 dark:text-neutral-400 text-sm">{String(t('pricing.premium.period'))}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {(t('pricing.premium.features') as unknown as string[]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-neutral-300">
                    <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn btn-lg w-full hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 text-white shadow-lg shadow-sky-500/25">
                {String(t('pricing.getStarted'))}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef.ref} className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float animate-delay-500" />
        </div>
        <div className="container-app text-center py-20 relative">
          <div className={ctaRef.isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance text-white">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-sky-100/90 mb-10 max-w-xl mx-auto text-balance">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn bg-white text-sky-600 hover:bg-gray-100 btn-lg shadow-2xl hover:scale-105 transition-all duration-300 font-bold">
                {String(t('cta.createAccount'))}
              </Link>
              <Link href="/jobs" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg border-2 border-white/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 font-semibold">
                {String(t('cta.browseJobs'))}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
