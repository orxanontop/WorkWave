'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-app py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-bold text-xl text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.jobSeekers')}</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-sm hover:text-white transition-colors">{t('footer.browseJobs')}</Link></li>
              <li><Link href="/companies" className="text-sm hover:text-white transition-colors">{t('footer.companies')}</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">{t('footer.premium')}</Link></li>
              <li><Link href="/auth/register" className="text-sm hover:text-white transition-colors">{t('footer.createAccount')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.employers')}</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/register" className="text-sm hover:text-white transition-colors">{t('footer.postJob')}</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">{t('footer.pricing')}</Link></li>
              <li><Link href="/companies" className="text-sm hover:text-white transition-colors">{t('footer.companyProfile')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">{t('footer.helpCenter')}</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
