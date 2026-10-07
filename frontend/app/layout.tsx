import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Discover Our Products | mettā muse',
  description: 'Browse our product listing with filters, sorting and pagination.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
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
