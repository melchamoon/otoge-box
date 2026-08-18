import type { Metadata, Viewport } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { AppBar } from "@/components/layout/AppBar";
import { Footer } from "@/components/layout/Footer";
import { NavDrawer } from "@/components/layout/NavDrawer";
import { Providers } from "./providers";
import "./globals.css";

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? "音ゲーぼっくす";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteOrigin = new URL(siteUrl);
const logoUrl = new URL("/logo.png?v=1", siteOrigin).toString();

export const viewport: Viewport = {
  themeColor: "#424242",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: { default: siteTitle, template: `%s | ${siteTitle}` },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN,
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=1", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=1", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico?v=1", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico?v=1",
    apple: [{ url: "/apple-touch-icon.png?v=1", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg?v=1" }],
  },
  manifest: "/manifest.webmanifest?v=1",
  openGraph: {
    type: "website",
    title: siteTitle,
    siteName: siteTitle,
    images: [logoUrl],
    url: siteOrigin,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION_JP,
    images: [logoUrl],
  },
  appleWebApp: { title: siteTitle },
  other: { "msapplication-TileColor": "#424242" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers locale={locale} messages={messages}>
          <AppBar />
          <NavDrawer />
          <main className="min-h-[calc(100vh-7rem)] pt-16 pb-12">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
