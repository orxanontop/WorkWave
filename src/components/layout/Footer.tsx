import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
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
              Connecting local talent with local opportunities. Find your dream job today.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Job Seekers</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-sm hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="text-sm hover:text-white transition-colors">Companies</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Premium</Link></li>
              <li><Link href="/auth/register" className="text-sm hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Employers</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/register" className="text-sm hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/companies" className="text-sm hover:text-white transition-colors">Company Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
