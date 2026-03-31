import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'JobMarket - Find Your Next Opportunity, Locally',
  description:
    'Hyper-local job marketplace connecting job seekers with local employers. Browse jobs, apply instantly, and get hired faster.',
  keywords: ['jobs', 'local jobs', 'employment', 'careers', 'hiring'],
  openGraph: {
    title: 'JobMarket - Find Your Next Opportunity, Locally',
    description: 'Hyper-local job marketplace connecting job seekers with local employers.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
