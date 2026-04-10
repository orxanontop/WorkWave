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

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'WorkWave — Find Your Next Opportunity',
    template: '%s | WorkWave',
  },
  description:
    'Hyper-local job marketplace connecting job seekers with local employers. Browse jobs, apply instantly, and get hired faster.',
  keywords: ['jobs', 'local jobs', 'employment', 'careers', 'hiring', 'remote work', 'tech jobs'],
  authors: [{ name: 'WorkWave' }],
  creator: 'WorkWave',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: 'WorkWave — Find Your Next Opportunity',
    description: 'Hyper-local job marketplace connecting job seekers with local employers.',
    siteName: 'WorkWave',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WorkWave — Find Your Next Opportunity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkWave — Find Your Next Opportunity',
    description: 'Hyper-local job marketplace connecting job seekers with local employers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
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
