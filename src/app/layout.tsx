import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { AppBar } from '@/components/layout/AppBar';
import { Footer } from '@/components/layout/Footer';
import { NavDrawer } from '@/components/layout/NavDrawer';
import { Analytics } from '@/components/Analytics';
import { Providers } from './providers';
import './globals.css';

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? '音ゲーぼっくす';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const logoUrl = new URL('/logo.png?v=1', siteUrl).toString();

export const viewport: Viewport = { themeColor: '#424242', width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  title: { default: 'N/A', template: `%s | ${siteTitle}` },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN,
  icons: { icon: [{ url: '/favicon-32x32.png?v=1', sizes: '32x32' }, { url: '/favicon-16x16.png?v=1', sizes: '16x16' }], apple: '/apple-touch-icon.png?v=1' },
  manifest: '/manifest.webmanifest',
  openGraph: { type: 'website', siteName: siteTitle, images: [logoUrl], url: siteUrl },
  twitter: { card: 'summary', images: [logoUrl] },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers locale={locale} messages={messages}>
          <Analytics />
          <AppBar />
          <NavDrawer />
          <main className="min-h-[calc(100vh-7rem)] pt-16 pb-12">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
