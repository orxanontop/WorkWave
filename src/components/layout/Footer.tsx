'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-gray-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-900/20 rounded-full blur-3xl" />
      <div className="container-app py-12 sm:py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 via-accent-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {['M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z',
              'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
              ].map((d, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25">
                  <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {[
            { title: t('footer.jobSeekers'), links: [
              { href: '/jobs', label: t('footer.browseJobs') },
              { href: '/companies', label: t('footer.companies') },
              { href: '/pricing', label: t('footer.premium') },
              { href: '/auth/register', label: t('footer.createAccount') },
            ]},
            { title: t('footer.employers'), links: [
              { href: '/auth/register', label: t('footer.postJob') },
              { href: '/pricing', label: t('footer.pricing') },
              { href: '/companies', label: t('footer.companyProfile') },
            ]},
            { title: t('footer.support'), links: [
              { href: '#', label: t('footer.helpCenter') },
              { href: '#', label: t('footer.privacy') },
              { href: '#', label: t('footer.terms') },
              { href: '#', label: t('footer.contact') },
            ]},
          ].map((section) => (
            <div key={String(section.title)}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center text-sm">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} {APP_NAME}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
