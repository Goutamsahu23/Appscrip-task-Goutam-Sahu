import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { getSiteUrl } from '@/lib/site';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Discover Our Products | mettā muse',
    template: '%s',
  },
  description: 'Browse our product listing with filters, sorting and pagination.',
  openGraph: {
    type: 'website',
    siteName: 'mettā muse',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <a href="#main-content" className="skipLink">
          Skip to content
        </a>
        <div className="appShell">
          <AnnouncementBar />
          <Header />
          <div className="appMain">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
